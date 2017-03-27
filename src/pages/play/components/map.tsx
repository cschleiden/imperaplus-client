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

enum ActionState {
    Place,
    ActionDefault,
    ActionOriginSelected,
    ActionDestinationSelected
}

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

interface IMapProps {
    game: Game;

    // switchGame: (gameId: number) => void;    
}

interface IMapState {
    isLoading: boolean;

    mapTemplate: MapTemplateCache.MapTemplateCacheEntry;

    hoveredCountry: string;
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
    }

    const mapTemplateCache: { [name: string]: Promise<MapTemplateCacheEntry> } = {};
}

class Map extends React.Component<IMapProps, IMapState> {
    private _idToCountry: { [id: string]: Country } = {};

    constructor(props: IMapProps, context) {
        super(props, context);

        this.state = {
            isLoading: false,
            mapTemplate: null,
            hoveredCountry: null
        };
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

        // 
        this._idToCountry = {};
        for (let country of game.map.countries) {
            this._idToCountry[country.identifier] = country;
        }
    }

    render(): JSX.Element {
        const { mapTemplate } = this.state;

        return <div className="map" onMouseMove={this._onMouseMove}>
            {mapTemplate && <img src={mapTemplate.image} />}
            {mapTemplate && this._renderCountries()}
        </div>;
    }

    private _renderCountries() {
        const { game } = this.props;
        const { map } = game;
        const { mapTemplate, hoveredCountry } = this.state;

        return mapTemplate.countries.map(countryTemplate => {
            const country = this._idToCountry[countryTemplate.identifier];
            const team = game.teams.filter(t => t.id === country.teamId)[0];
            const player = team.players.filter(p => p.id === country.playerId)[0];

            const isHighlighted = hoveredCountry && mapTemplate.areConnected(hoveredCountry, country.identifier);

            return <div
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
            </div>;
        });
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

export default connect((state: IState) => ({
    game: state.play.data.game
}), (dispatch) => ({
}))(Map);