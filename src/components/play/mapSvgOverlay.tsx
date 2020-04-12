import * as React from "react";
import {
    country,
    MapTemplateCacheEntry,
} from "../../lib/domain/game/play/mapTemplateCache";
import { css } from "../../lib/utils/css";
import style from "./mapSvgOverlay.module.scss";

export interface CountryArrowDefinition {
    sourceCountry: string;
    targetCountry: string;

    curve?: number;

    className?: string;

    annotation?: JSX.Element;
    annotationWidth?: number;
    annotationHeight?: number;
}

interface CountryArrowInstruction {
    definition: CountryArrowDefinition;

    ox: number;
    oy: number;
    x: number;
    y: number;

    // Control point for quadratic curve
    cx?: number;
    cy?: number;

    length: number;

    /** Left position for centered annotation */
    hx: number;

    /** Top position for centered annotation */
    hy: number;
}

function arrowDefinitionToInstruction(
    mapTemplate: MapTemplateCacheEntry,
    arrow: CountryArrowDefinition
): CountryArrowInstruction {
    const {
        sourceCountry,
        targetCountry,
        curve = 0,
        annotationWidth = 0,
        annotationHeight = 0,
    } = arrow;

    let { x: ox, y: oy } = country(mapTemplate, sourceCountry);
    let { x, y } = country(mapTemplate, targetCountry);

    // Adjust to center
    const countryRadius = 12.5;
    ox += countryRadius;
    oy += countryRadius;

    x += countryRadius;
    y += countryRadius;

    let dx = ox - x;
    let dy = oy - y;
    const length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    let cx: number, cy: number, hx: number, hy: number;
    if (curve !== 0) {
        cx = ox - dx * (length / 2) + -dy * curve;
        cy = oy - dy * (length / 2) + dx * curve;

        // in this case, use control point for annotation
        hx = cx - annotationWidth / 2;
        hy = cy - annotationHeight / 2;
    } else {
        // Calculate position for annotation
        hx = ox - dx * (length / 2) - annotationWidth / 2;
        hy = oy - dy * (length / 2) - annotationHeight / 2;
    }

    // Make sure the arrow head touches just the border and not the center
    const distanceFromCountryCenter = countryRadius;
    x += dx * distanceFromCountryCenter;
    y += dy * distanceFromCountryCenter;

    return {
        definition: arrow,
        x,
        y,
        ox,
        oy,
        cx,
        cy,
        hx,
        hy,
        length,
    };
}

export const MapSvgOverlay: React.FC<{
    className?: string;
    mapTemplate: MapTemplateCacheEntry;
    countryArrows?: CountryArrowDefinition[];
}> = ({ className, mapTemplate, countryArrows = [] }) => {
    const arrows = countryArrows.map((cA) =>
        arrowDefinitionToInstruction(mapTemplate, cA)
    );

    const maxWidth =
        Math.max(0, ...arrows.map((x) => Math.max(x.x, x.ox, x.hx))) || 0;
    const maxHeight =
        Math.max(0, ...arrows.map((x) => Math.max(x.y, x.oy, x.hy))) || 0;

    return (
        <div className={css(style.mapSvgOverlay, className)}>
            <svg width={`${maxWidth + 20}px`} height={`${maxHeight + 20}px`}>
                <defs>
                    <marker
                        id="arrowhead"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="4"
                        markerHeight="4"
                        orient="auto"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
                {arrows.map(
                    ({
                        ox,
                        oy,
                        x,
                        y,
                        cx,
                        cy,
                        length,
                        definition: { className },
                    }) => (
                        <path
                            key={`${x}-${y}`}
                            className={className}
                            markerEnd="url(#arrowhead)"
                            strokeWidth="3"
                            strokeDasharray={length}
                            strokeDashoffset={length}
                            fill="none"
                            stroke="black"
                            d={getCurveCommand(ox, oy, x, y, cx, cy)}
                        />
                    )
                )}
            </svg>

            {arrows
                .filter((x) => !!x.definition.annotation)
                .map((x) => (
                    <div
                        className={style.annotation}
                        style={{
                            left: x.hx,
                            top: x.hy,
                        }}
                    >
                        {x.definition.annotation}
                    </div>
                ))}
        </div>
    );
};

function getCurveCommand(
    ox: number,
    oy: number,
    x: number,
    y: number,
    cx?: number,
    cy?: number
): string {
    if (cx !== undefined) {
        // Quadratic curve
        return `M${ox} ${oy} Q${cx} ${cy},${x} ${y}`;
    }

    // Straight line
    return `M${ox} ${oy} L${x} ${y}`;
}
