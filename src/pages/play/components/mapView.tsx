import * as React from "react";
import { autobind } from "../../../lib/autobind";
import { css } from "../../../lib/css";
import { MapTemplateCacheEntry } from "../mapTemplateCache";
import "./map.scss";

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
            hoveredCountry: null
        };
    }

    render(): JSX.Element {
        const { mapTemplate } = this.props;

        return (
            <div className="map-view" onMouseMove={this._onMouseMove}>
                <img src={mapTemplate.image} />
                {this._renderCountries()}
            </div>
        );
    }

    @autobind
    private _onMouseMove(ev: React.MouseEvent<HTMLDivElement>) {
        const target = ev.target as HTMLDivElement;

        if (target.classList.contains("country")) {
            // on country
            const countryIdentifier = target.id;

            if (this.state.hoveredCountry !== countryIdentifier) {
                this.setState({
                    hoveredCountry: countryIdentifier
                });
            }
        } else if (this.state.hoveredCountry) {
            this.setState({
                hoveredCountry: null
            });
        }
    }

    private _renderCountries(): JSX.Element[] {
        const { mapTemplate } = this.props;
        const { hoveredCountry } = this.state;

        return mapTemplate.countries.map(countryTemplate => {
            const isHighlighted = hoveredCountry && mapTemplate.areConnected(hoveredCountry, countryTemplate.identifier);
            const continent = mapTemplate.continent(countryTemplate.identifier);

            return (
                <div
                    id={countryTemplate.identifier}
                    key={countryTemplate.identifier}
                    className={css(
                        "country",
                        `continent-${continent.id}`,
                        {
                            "country-highlight": isHighlighted,
                        })}
                    style={{
                        left: countryTemplate.x,
                        top: countryTemplate.y
                    }}
                    title={`${countryTemplate.identifier} - ${countryTemplate.name}`}
                >
                    {continent.bonus}
                </div>
            );
        });
    }
}