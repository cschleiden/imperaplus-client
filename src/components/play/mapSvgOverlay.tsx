import * as React from "react";
import {
    country,
    MapTemplateCacheEntry,
} from "../../lib/domain/game/play/mapTemplateCache";
import style from "./mapSvgOverlay.module.scss";

export interface CountryArrowDefinition {
    sourceCountry: string;
    targetCountry: string;

    annotation?: JSX.Element;
    annotationWidth?: number;
    annotationHeight?: number;
}

interface CountryArrowInstruction {
    ox: number;
    oy: number;
    x: number;
    y: number;

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

    const distanceFromCountryCenter = countryRadius + 8;
    x += dx * distanceFromCountryCenter;
    y += dy * distanceFromCountryCenter;

    // Calculate position for annotation
    const hx = x + dx * (length / 2) - annotationWidth / 2;
    const hy = y + dy * (length / 2) - annotationHeight / 2;

    return {
        x,
        y,
        ox,
        oy,
        hx,
        hy,
        length,
    };
}

export const MapSvgOverlay: React.FC<{
    mapTemplate: MapTemplateCacheEntry;
    countryArrows?: CountryArrowDefinition[];
}> = ({ mapTemplate, countryArrows = [] }) => {
    const arrows = countryArrows.map((cA) =>
        arrowDefinitionToInstruction(mapTemplate, cA)
    );

    return (
        <div className={style.mapSvgOverlay}>
            <svg>
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
                {arrows.map(({ ox, oy, x, y, length }) => (
                    <path
                        key={`${x}-${y}`}
                        markerEnd="url(#arrowhead)"
                        strokeWidth="3"
                        strokeDasharray={length}
                        strokeDashoffset={length}
                        fill="none"
                        stroke="black"
                        d={`M${ox},${oy} L${x},${y}`}
                    />
                ))}
            </svg>
        </div>
    );
};
