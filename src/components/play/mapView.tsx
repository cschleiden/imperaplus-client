import * as React from "react";
import { MapTemplateCacheEntry } from "../../lib/domain/game/play/mapTemplateCache";
import style from "./map.module.scss";
import { css } from "../../lib/utils/css";

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
            <div onMouseMove={this._onMouseMove}>
                <img src={mapTemplate.image} />
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
                mapTemplate.areConnected(
                    hoveredCountry,
                    countryTemplate.identifier
                );
            const continent = mapTemplate.continent(countryTemplate.identifier);

            return (
                <div
                    id={countryTemplate.identifier}
                    key={countryTemplate.identifier}
                    className={css(style.country, `continent-${continent.id}`, {
                        [style.countryHighlight]: isHighlighted,
                    })}
                    style={{
                        left: countryTemplate.x,
                        top: countryTemplate.y,
                    }}
                    title={`${countryTemplate.identifier} - ${countryTemplate.name}`}
                >
                    {continent.bonus}
                </div>
            );
        });
    }
}
