import * as React from "react";

import {
    MapTemplateCacheEntry,
    areConnected,
    connections,
    continent,
} from "../../lib/domain/game/play/mapTemplateCache";

import { MapSvgOverlay } from "./mapSvgOverlay";
import { css } from "../../lib/utils/css";
import { imageBaseUri } from "../../configuration";
import style from "./map.module.scss";

export interface IMapViewProps {
    mapTemplate: MapTemplateCacheEntry;
}

export interface IMapViewState {
    hoveredCountry: string;
}

export class MapView extends React.Component<IMapViewProps, IMapViewState> {
    constructor(props: IMapViewProps, context: any) {
        super(props, context);

        this.state = {
            hoveredCountry: null,
        };
    }

    render(): JSX.Element {
        const { mapTemplate } = this.props;

        return (
            <div onMouseMove={this._onMouseMove} className={style.map}>
                <img src={`${imageBaseUri}${mapTemplate.image}`} />
                <MapSvgOverlay
                    mapTemplate={mapTemplate}
                    countryArrows={
                        (this.state.hoveredCountry &&
                            connections(
                                mapTemplate,
                                this.state.hoveredCountry
                            ).map((targetCountry) => ({
                                sourceCountry: this.state.hoveredCountry,
                                targetCountry,
                            }))) ||
                        []
                    }
                />
                {this._renderCountries()}
            </div>
        );
    }

    private _onMouseMove = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;

        if (target.classList.contains(style.country)) {
            // on country
            const countryIdentifier = target.id;

            if (this.state.hoveredCountry !== countryIdentifier) {
                this.setState({
                    hoveredCountry: countryIdentifier,
                });
            }
        } else if (this.state.hoveredCountry) {
            this.setState({
                hoveredCountry: null,
            });
        }
    };

    private _renderCountries(): JSX.Element[] {
        const { mapTemplate } = this.props;
        const { hoveredCountry } = this.state;

        return mapTemplate.countries.map((countryTemplate) => {
            const isHighlighted =
                hoveredCountry &&
                areConnected(
                    mapTemplate,
                    hoveredCountry,
                    countryTemplate.identifier
                );
            const countryContinent = continent(
                mapTemplate,
                countryTemplate.identifier
            );

            return (
                <div
                    id={countryTemplate.identifier}
                    key={countryTemplate.identifier}
                    className={css(style.country, {
                        [`continent-${countryContinent?.id}`]:
                            !!countryContinent,
                        [style.countryHighlight]: isHighlighted,
                    })}
                    style={{
                        left: countryTemplate.x,
                        top: countryTemplate.y,
                    }}
                    title={`${countryTemplate.identifier} - ${countryTemplate.name}`}
                >
                    {countryContinent?.bonus || "-"}
                </div>
            );
        });
    }
}
