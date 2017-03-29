import * as React from "react";

import "./map.scss";

import { connect } from "react-redux";
import { Game, MapTemplate, MapClient, Country, CountryTemplate } from "../../../external/imperaClients";
import { IState } from "../../../reducers";
import { getCachedClient } from "../../../clients/clientFactory";
import { imageBaseUri } from "../../../configuration";
import { css } from "../../../lib/css";
import { autobind } from "../../../lib/autobind";
import { log } from "../../../lib/log";
import { selectCountry, setPlaceUnits } from "../play.actions";
import { ITwoCountry } from "../play.reducer";

import "jsplumb";

enum MapState {
    DisplayOnly,
    Place,
    Move,
    Attack,
    History
}

enum MouseState {
    Default,
    ActionDragger
}

namespace KeyBindings {
    const ABORT = 27; // Escape

    const INCREASE_UNITCOUNT = 38; // Cursor up
    const DECREASE_UNITCOUNT = 40; // Cursor down
    const SUBMIT_ACTION = 13; // Enter
}

namespace MapTemplateCache {
    export function getMapTemplate(name: string): Promise<MapTemplateCacheEntry> {
        if (mapTemplateCache[name]) {
            return mapTemplateCache[name];
        }

        return getCachedClient(MapClient).getMapTemplate(name).then(mapTemplate => {
            mapTemplateCache[name] = Promise.resolve(new MapTemplateCacheEntry(mapTemplate));

            return mapTemplateCache[name];
        });
    }

    export class MapTemplateCacheEntry {
        private _countries: { [id: string]: CountryTemplate } = {};
        private _connections: { [id: string]: { [id: string]: boolean } } = {};

        constructor(public mapTemplate: MapTemplate) {
            for (let country of mapTemplate.countries) {
                this._countries[country.identifier] = country;
            }

            for (let connection of mapTemplate.connections) {
                if (this._connections[connection.origin]) {
                    this._connections[connection.origin][connection.destination] = true;
                } else {
                    this._connections[connection.origin] = { [connection.destination]: true };
                }
            }
        }

        get countries(): CountryTemplate[] {
            return this.mapTemplate.countries;
        }

        get image(): string {
            return `${imageBaseUri}${this.mapTemplate.image}`;
        }

        country(identifier: string): CountryTemplate {
            return this._countries[identifier];
        }

        areConnected(origin: string, destination: string) {
            const conn = this._connections[origin];
            return conn && conn[destination];
        }

        connections(identifier: string): string[] {
            return Object.keys(this._connections[identifier]);
        }
    }

    const mapTemplateCache: { [name: string]: Promise<MapTemplateCacheEntry> } = {};
}

interface ICountryInputFieldProps {
    countryTemplate: CountryTemplate;

    value: number;

    onChange: (value: number) => void;
}

class CountryInputField extends React.Component<ICountryInputFieldProps, void> {
    private _element: HTMLDivElement;
    private _resolveElement = (elem: HTMLDivElement) => { this._element = elem; };

    private _inputElement: HTMLInputElement;
    private _resolveInputElement = (elem: HTMLInputElement) => { this._inputElement = elem; };

    render() {
        const { countryTemplate, value } = this.props;

        return <div
            id={`p${countryTemplate.identifier}`}
            className={css("input-country")}
            style={{
                left: countryTemplate.x + 10,
                top: countryTemplate.y + 2
            }}
            ref={this._resolveElement}>
            <input
                type="number"
                min={1}
                defaultValue={value.toString(10)}
                onChange={this._onChange}
                onFocus={this._onFocus}
                ref={this._resolveInputElement} />
        </div>;
    }

    componentDidMount() {
        this._element.classList.add("input-country-active");

        this._inputElement.focus();
    }

    componentWillReceiveProps(props: ICountryInputFieldProps) {
        if (this._inputElement.value !== "") {
            this._inputElement.value = props.value.toString(10);
        }
    }

    @autobind
    private _onChange(ev: React.FormEvent<HTMLInputElement>) {
        const newValue = parseInt(this._inputElement.value, 10);

        if (!isNaN(newValue)) {
            this.props.onChange(newValue);
        }
    }

    @autobind
    private _onFocus() {
        this._inputElement.select();
    }
}

interface IMapProps {
    game: Game;
    placeCountries: { [id: string]: number };
    twoCountry: ITwoCountry;
    idToCountry: { [id: string]: Country };

    selectCountry: (countryIdentifier: string) => void;
    setUnits: (countryIdentifier: string, units: number) => void;
}

interface IMapState {
    isLoading: boolean;

    mapTemplate: MapTemplateCache.MapTemplateCacheEntry;

    hoveredCountry: string;
}

class Map extends React.Component<IMapProps, IMapState> {
    private _jsPlumb: jsPlumbInstance;

    constructor(props: IMapProps, context) {
        super(props, context);

        this.state = {
            isLoading: false,
            mapTemplate: null,
            hoveredCountry: null
        };

        this._jsPlumb = jsPlumb.getInstance();
    }

    componentWillReceiveProps(props: IMapProps) {
        if (this.props.game !== props.game) {
            this._update(props.game);
        }
    }

    private _update(game: Game) {
        this.setState({
            isLoading: true
        } as IMapState);

        // Get template
        const mapTemplateName = game.mapTemplate;

        MapTemplateCache.getMapTemplate(mapTemplateName).then(mapTemplate => {
            this.setState({
                isLoading: false,
                mapTemplate
            } as IMapState);
        });
    }

    render(): JSX.Element {
        const { mapTemplate } = this.state;

        return <div className="map" onClick={this._onClick} onMouseMove={this._onMouseMove}>
            {mapTemplate && <img src={mapTemplate.image} />}
            {mapTemplate && this._renderCountries()}
        </div>;
    }

    componentDidUpdate() {
        this._renderConnections();
    }

    private _renderCountries() {
        const { game, placeCountries, idToCountry } = this.props;
        const { map } = game;
        const { mapTemplate, hoveredCountry } = this.state;

        return mapTemplate.countries.map(countryTemplate => {
            const country = idToCountry[countryTemplate.identifier];
            const team = game.teams.filter(t => t.id === country.teamId)[0];
            const player = team.players.filter(p => p.id === country.playerId)[0];

            const isHighlighted = hoveredCountry && mapTemplate.areConnected(hoveredCountry, country.identifier);

            const placeUnits = placeCountries[countryTemplate.identifier];
            const hasInput = placeUnits !== undefined;

            return [<div
                id={countryTemplate.identifier}
                key={countryTemplate.identifier}
                className={css(
                    "country",
                    "player-" + (player.playOrder + 1),
                    {
                        "country-highlight": isHighlighted
                    })}
                style={{
                    left: countryTemplate.x,
                    top: countryTemplate.y
                }}>
                {country.units}
            </div>,
            hasInput && <CountryInputField
                key={`p${countryTemplate.identifier}`}
                countryTemplate={countryTemplate}
                value={placeUnits}
                onChange={(units) => this.props.setUnits(countryTemplate.identifier, units)} />
            ];
        });
    }

    private _renderConnections() {
        const { twoCountry } = this.props;
        const showConnections = !!twoCountry.originCountryIdentifier && !twoCountry.destinationCountryIdentifier;
        if (!showConnections) {
            this._jsPlumb.detachEveryConnection();
            (this._jsPlumb as any).deleteEveryEndpoint();
            return;
        }

        const targets = this.state.mapTemplate.connections(twoCountry.originCountryIdentifier);

        (jsPlumb as any).doWhileSuspended(() => {
            for (let target of targets) {
                this._jsPlumb.connect({
                    source: twoCountry.originCountryIdentifier,
                    target: target,
                    cssClass: "connections connections-attack",
                    hoverClass: "connections-hover",
                    anchors: [
                        ["Perimeter", { shape: "Circle" }],
                        ["Perimeter", { shape: "Circle" }]
                    ],
                    connector: ["StateMachine"],
                    endpoint: "Blank",
                    paintStyle: {
                        outlineWidth: 15, // Increased hit target
                        outlineColor: "transparent",
                        outlineStroke: "black"
                    },
                    hoverPaintStyle: {
                        lineWidth: 4
                    },
                    overlays: [
                        ["PlainArrow", { location: 1, width: 15, length: 12 }]
                    ]
                } as any);

                // this._jsPlumb.bind("click", () => {
                //     alert(42);
                // });
            }
        });
    }

    private _renderInputArrow() {
        const { twoCountry } = this.props;

        if (twoCountry.originCountryIdentifier && twoCountry.destinationCountryIdentifier) {
            //jsPlumb.
        }
    }

    @autobind
    private _onClick(ev: React.MouseEvent<HTMLDivElement>) {
        const target = ev.target as HTMLDivElement;

        if (target.classList.contains("country")) {
            const countryIdentifier = target.id;

            this.props.selectCountry(countryIdentifier);
        } else {
            this.props.selectCountry(null);
        }
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
                } as IMapState);
            }
        } else if (this.state.hoveredCountry) {
            this.setState({
                hoveredCountry: null
            } as IMapState);
        }
    }
}

export default connect((state: IState) => {
    const { game, placeCountries, countriesByIdentifier, twoCountry } = state.play.data;

    return {
        game: game,
        placeCountries: placeCountries,
        twoCountry: twoCountry,
        idToCountry: countriesByIdentifier
    };
}, (dispatch) => ({
    selectCountry: (countryIdentifier: string) => { dispatch(selectCountry(countryIdentifier)); },
    setUnits: (countryIdentifier: string, units: number) => { dispatch(setPlaceUnits(countryIdentifier, units)); }
}))(Map);