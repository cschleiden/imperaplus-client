// Used for displaying connections
import "jsplumb";
import * as React from "react";
import { connect } from "react-redux";
import {
    Game,
    HistoryAction,
    HistoryEntry,
    HistoryTurn,
    PlayState,
} from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { css } from "../../../lib/css";
import {
    countriesToMap,
    getPlayerByPlayerId,
    getTeam,
} from "../../../lib/game/utils";
import { IState } from "../../../reducers";
import { MapTemplateCacheEntry } from "../mapTemplateCache";
import {
    attack,
    move,
    place,
    selectCountry,
    setActionUnits,
    setPlaceUnits,
} from "../play.actions";
import { ITwoCountry } from "../reducer";
import { IGameUIOptions } from "../reducer/play.reducer.state";
import { game } from "../reducer/play.selectors";
import { CountryInputField } from "./countryInput";
import "./map.scss";

const KeyBindings = {
    ABORT: 27, // Escape

    INCREASE_UNITCOUNT: 38, // Cursor up
    DECREASE_UNITCOUNT: 40, // Cursor down
    SUBMIT_ACTION: 13, // Enter
};

interface IMapProps {
    game: Game;
    historyTurn: HistoryTurn;
    mapTemplate: MapTemplateCacheEntry;
    placeCountries: { [id: string]: number };
    twoCountry: ITwoCountry;
    operationInProgress: boolean;

    gameUiOptions: IGameUIOptions;

    selectCountry: (countryIdentifier: string) => void;
    setUnits: (countryIdentifier: string, units: number) => void;
    setActionUnits: (units: number) => void;

    place: () => void;
    attack: () => void;
    move: () => void;
}

interface IMapState {
    isLoading: boolean;
    hoveredCountry: string;
}

class Map extends React.Component<IMapProps, IMapState> {
    private _unitInputFocus: boolean = false;

    private _jsPlumb: jsPlumbInstance;
    private _connection: Connection;
    private _inputElement: HTMLInputElement;

    private _inputElementPlaceholder: HTMLDivElement;
    private _inputElementWrapper: HTMLDivElement;

    private _selectionOrigin: string = null;
    private _selectionConnections: Connection[] = [];
    private _historyConnections: Connection[] = [];

    constructor(props: IMapProps, context) {
        super(props, context);

        this.state = {
            isLoading: false,
            hoveredCountry: null,
        };

        this._jsPlumb = jsPlumb.getInstance();
    }

    componentWillReceiveProps(props: IMapProps) {
        if (this.props.game !== props.game) {
            this._update(props);
        }
    }

    private _update(props: IMapProps) {
        const { game, mapTemplate } = props;

        if (game && !mapTemplate) {
            this.setState({
                isLoading: true,
            } as IMapState);
        } else {
            this.setState({
                isLoading: false,
            } as IMapState);
        }

        // Clear position cache
        (this._jsPlumb as any).deleteEveryEndpoint();
    }

    render(): JSX.Element {
        const { mapTemplate, historyTurn, operationInProgress } = this.props;

        return (
            <div
                className={css("map", {
                    blocked: operationInProgress,
                })}
                onClick={this._onClick}
                onMouseMove={this._onMouseMove}
            >
                {mapTemplate && <img src={mapTemplate.image} className="map" />}
                {mapTemplate && this._renderCountries()}
                {historyTurn &&
                    mapTemplate &&
                    this._renderHistory(mapTemplate, historyTurn.actions)}

                {this._renderUnitInput()}
                {this._renderUnitInputPlaceholder()}
            </div>
        );
    }

    componentDidUpdate() {
        const { twoCountry, historyTurn } = this.props;

        this._renderConnections();
        this._renderConnection();

        // History
        if (!historyTurn) {
            this._clearHistoryConnections();
        } else {
            this._showHistoryConnections(historyTurn.actions);
        }

        // Focus input element if an entry box is shown
        const showConnection =
            !!twoCountry.originCountryIdentifier &&
            !!twoCountry.destinationCountryIdentifier;
        if (showConnection) {
            // Only focus/select if not already the active/focused element
            if (!this._unitInputFocus) {
                this._inputElement.focus();
            }
        }
    }

    private _renderCountries() {
        const {
            game,
            placeCountries,
            mapTemplate,
            operationInProgress,
            gameUiOptions,
        } = this.props;
        const { map } = game;
        const { hoveredCountry } = this.state;

        const idToCountry = countriesToMap(map.countries);

        const isTeamGame = game.options.numberOfPlayersPerTeam > 1;

        return mapTemplate.countries.map((countryTemplate) => {
            const country = idToCountry[countryTemplate.identifier];

            const player =
                country && getPlayerByPlayerId(game, country.playerId);
            const team = country && player && getTeam(game, player.userId);

            const isHighlighted =
                hoveredCountry &&
                mapTemplate.areConnected(
                    hoveredCountry,
                    countryTemplate.identifier
                );

            const placeUnits = placeCountries[countryTemplate.identifier];
            const hasInput = !operationInProgress && placeUnits !== undefined;

            let units = "?";
            if (country && country.units != null) {
                units = country.units.toString(10);
            }

            const result = [
                <div
                    id={countryTemplate.identifier}
                    key={countryTemplate.identifier}
                    className={css("country", {
                        // only show player color when country is visible
                        ["player-" +
                        (player ? player.playOrder + 1 : 0)]: !!country,
                        "country-highlight": isHighlighted,
                        ["country-team-" + (team ? team.playOrder + 1 : 0)]:
                            isTeamGame && gameUiOptions.showTeamsOnMap,
                    })}
                    style={{
                        left: countryTemplate.x,
                        top: countryTemplate.y,
                    }}
                >
                    {units}
                </div>,
                hasInput && (
                    <CountryInputField
                        key={`p${countryTemplate.identifier}`}
                        countryTemplate={countryTemplate}
                        value={placeUnits}
                        onKeyUp={this._onKeyUp}
                        onChange={(inputUnits) =>
                            this.props.setUnits(
                                countryTemplate.identifier,
                                inputUnits
                            )
                        }
                    />
                ),
            ];

            return result;
        });
    }

    private _renderConnections() {
        const { twoCountry, game, historyTurn } = this.props;
        const showConnections =
            !historyTurn &&
            !!twoCountry.originCountryIdentifier &&
            !twoCountry.destinationCountryIdentifier;

        if (
            showConnections &&
            this._selectionOrigin === twoCountry.originCountryIdentifier
        ) {
            // Already up-to-date
            return;
        }

        if (
            !showConnections ||
            this._selectionOrigin !== twoCountry.originCountryIdentifier ||
            !!twoCountry.destinationCountryIdentifier
        ) {
            // Remove any existing connections
            this._selectionOrigin = null;
            (jsPlumb as any).doWhileSuspended(() => {
                this._jsPlumb.unbind("click");

                if (this._selectionConnections.length) {
                    (this._jsPlumb as any).deleteEveryConnection();

                    this._selectionConnections = [];
                }
            });
        }

        if (!showConnections) {
            return;
        }

        this._selectionOrigin = twoCountry.originCountryIdentifier;
        (jsPlumb as any).doWhileSuspended(() => {
            for (let destination of twoCountry.allowedDestinations) {
                this._selectionConnections.push(
                    this._jsPlumb.connect({
                        source: twoCountry.originCountryIdentifier,
                        target: destination,
                        cssClass:
                            "connections connections-" +
                            (game.playState === PlayState.Attack
                                ? "attack"
                                : "move"),
                        hoverClass: "connections-hover",
                        anchors: [
                            ["Perimeter", { shape: "Circle" }],
                            ["Perimeter", { shape: "Circle" }],
                        ],
                        connector: ["StateMachine"],
                        endpoint: "Blank",
                        paintStyle: {
                            outlineWidth: 15, // Increased hit target
                            outlineColor: "transparent",
                            outlineStroke: "black",
                        },
                        hoverPaintStyle: {
                            lineWidth: 4,
                        },
                        overlays: [
                            [
                                "PlainArrow",
                                { location: 1, width: 15, length: 12 },
                            ],
                        ],
                    } as any)
                );

                this._jsPlumb.bind("click", (connection) => {
                    const targetId: string = connection.targetId;
                    this.props.selectCountry(targetId);
                });
            }
        });
    }

    private _renderConnection() {
        const { twoCountry, game, historyTurn } = this.props;
        const showConnection =
            !historyTurn &&
            !!twoCountry.originCountryIdentifier &&
            !!twoCountry.destinationCountryIdentifier;

        const hasExistingConnection = !!this._connection;

        const untypedConnection: any = this._connection;
        const existingConnectionMatches =
            hasExistingConnection &&
            twoCountry &&
            (untypedConnection.sourceId !==
                twoCountry.originCountryIdentifier ||
                untypedConnection.targetId !==
                    twoCountry.destinationCountryIdentifier);

        if (showConnection && existingConnectionMatches) {
            // Already up-to-date
            return;
        }

        if (
            hasExistingConnection &&
            (!showConnection || !existingConnectionMatches)
        ) {
            // Remove existing connection
            (this._jsPlumb as any).deleteEveryConnection();
            this._connection = null;
        }

        if (!showConnection) {
            return;
        }

        this._connection = this._jsPlumb.connect({
            source: twoCountry.originCountryIdentifier,
            target: twoCountry.destinationCountryIdentifier,
            anchors: [
                ["Perimeter", { shape: "Circle" }],
                ["Perimeter", { shape: "Circle" }],
            ],
            endpoint: "Blank",
            paintStyle: {
                outlineWidth: 15,
                outlineColor: "transparent",
                outlineStroke: "black",
            },
            connector: ["StateMachine"],
            cssClass:
                "connections connections-" +
                (game.playState === PlayState.Attack ? "attack" : "move"),
            overlays: [
                [
                    "Custom",
                    {
                        create: (component) => {
                            return $(this._inputElementPlaceholder);
                        },
                        location: 0.4,
                        id: "unit-input",
                    },
                ],
                ["PlainArrow", { location: 1, width: 20, length: 12 }],
            ],
        } as any);

        // Update real input element with placeholder position
        this._inputElementWrapper.style.left = this._inputElementPlaceholder.style.left;
        this._inputElementWrapper.style.top = this._inputElementPlaceholder.style.top;
    }

    private _renderUnitInput(): JSX.Element {
        const {
            destinationCountryIdentifier,
            numberOfUnits,
            minUnits,
            maxUnits,
        } = this.props.twoCountry;

        return (
            <div
                className="action-overlay-wrapper"
                ref={this._resolveInputWrapper}
            >
                <input
                    className="action-overlay-input"
                    type="number"
                    min={minUnits}
                    max={maxUnits}
                    value={!isNaN(numberOfUnits) ? numberOfUnits : ""}
                    onChange={this._changeUnits}
                    onKeyUp={this._onKeyUp}
                    onFocus={this._onUnitInputFocus}
                    onBlur={this._onUnitInputBlur}
                    style={{
                        display: !destinationCountryIdentifier
                            ? "none"
                            : "block",
                    }}
                    ref={this._resolveInput}
                />
            </div>
        );
    }

    private _renderUnitInputPlaceholder(): JSX.Element {
        return (
            <div
                className="action-overlay-placeholder"
                ref={this._resolveInputPlaceholder}
            />
        );
    }

    @autobind
    private _onUnitInputFocus() {
        this._unitInputFocus = true;
        this._inputElement.select();
    }

    @autobind
    private _onUnitInputBlur() {
        this._unitInputFocus = false;
    }

    @autobind
    private _resolveInputWrapper(element: HTMLDivElement) {
        this._inputElementWrapper = element;
    }

    @autobind
    private _resolveInputPlaceholder(element: HTMLDivElement) {
        this._inputElementPlaceholder = element;
    }

    @autobind
    private _resolveInput(element: HTMLInputElement) {
        this._inputElement = element;
    }

    @autobind
    private _changeUnits(ev: React.FormEvent<HTMLInputElement>) {
        const value = (ev.target as HTMLInputElement).value;
        const units = parseInt(value, 10);

        this.props.setActionUnits(units);
    }

    @autobind
    private _onClick(ev: React.MouseEvent<HTMLDivElement>) {
        const target = ev.target as HTMLDivElement;

        if (target.classList.contains("country")) {
            const countryIdentifier = target.id;
            this._onCountryClick(countryIdentifier);
        } else if (target.classList.contains("map")) {
            // Cancel any country selection
            this.props.selectCountry(null);
        }
    }

    private _onCountryClick(countryIdentifier: string) {
        const { operationInProgress, twoCountry } = this.props;

        if (operationInProgress) {
            return;
        }

        if (
            !!twoCountry.originCountryIdentifier &&
            !!twoCountry.destinationCountryIdentifier
        ) {
            this._performAction();
        } else {
            this.props.selectCountry(countryIdentifier);
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
                    hoveredCountry: countryIdentifier,
                } as IMapState);
            }
        } else if (this.state.hoveredCountry) {
            this.setState({
                hoveredCountry: null,
            } as IMapState);
        }
    }

    @autobind
    private _onKeyUp(ev: React.KeyboardEvent<HTMLInputElement>) {
        switch (ev.keyCode) {
            case KeyBindings.SUBMIT_ACTION:
                this._performAction();
                break;

            case KeyBindings.ABORT:
                this.props.selectCountry(null);
                break;
        }
    }

    private _performAction() {
        const { game } = this.props;

        switch (game.playState) {
            case PlayState.PlaceUnits:
                this.props.place();
                break;

            case PlayState.Attack:
                this.props.attack();
                break;

            case PlayState.Move:
                this.props.move();
                break;
        }
    }

    private _renderHistory(
        mapTemplate: MapTemplateCacheEntry,
        actions: HistoryEntry[]
    ): JSX.Element[] {
        let result: JSX.Element[] = [];

        for (let action of actions.filter(
            (a) => a.action === HistoryAction.PlaceUnits
        )) {
            const countryTemplate = mapTemplate.country(
                action.originIdentifier
            );

            result.push(
                <div
                    key={`history-${action.id}`}
                    className="country-place"
                    style={{
                        left: countryTemplate.x,
                        top: countryTemplate.y,
                    }}
                >
                    {action.units}
                </div>
            );
        }

        return result;
    }

    private _showHistoryConnections(actions: HistoryEntry[]) {
        // Clear
        this._clearHistoryConnections();

        for (let action of actions) {
            switch (action.action) {
                case HistoryAction.Attack: {
                    this._displayHistoryConnection(
                        action.originIdentifier,
                        action.destinationIdentifier,
                        "" + action.units,
                        "connection-attack",
                        10
                    );
                    break;
                }

                case HistoryAction.Move: {
                    this._displayHistoryConnection(
                        action.originIdentifier,
                        action.destinationIdentifier,
                        "" + action.units,
                        "connection-move",
                        -10
                    );
                    break;
                }
            }
        }
    }

    private _clearHistoryConnections() {
        if (this._historyConnections.length) {
            (this._jsPlumb as any).deleteEveryConnection();

            this._historyConnections = [];
        }
    }

    private _displayHistoryConnection(
        originIdentifier: string,
        destinationIdentifier: string,
        label: string,
        cssClass: string,
        curviness: number
    ) {
        const historyConnection = this._jsPlumb.connect({
            source: originIdentifier,
            target: destinationIdentifier,
            anchors: [["Center"], ["Perimeter", { shape: "Circle" }]],
            endpoint: "Blank",
            connector: [
                "StateMachine",
                { curviness: curviness, proximityLimit: 10 },
            ],
            cssClass: "connection " + cssClass,
            overlays: [
                ["PlainArrow", { location: 1, width: 4, length: 8 }],
                ["Label", { label: label, cssClass: "history-label" }],
            ],
        } as any);

        this._historyConnections.push(historyConnection);
    }
}

export default connect(
    (state: IState) => {
        const {
            placeCountries,
            twoCountry,
            mapTemplate,
            historyTurn,
            operationInProgress,
            gameUiOptions,
            overrideGameUiOptions,
        } = state.play;

        return {
            game: game(state.play),
            historyTurn,
            mapTemplate: mapTemplate,
            placeCountries: placeCountries,
            twoCountry: twoCountry,
            operationInProgress,
            gameUiOptions: {
                ...gameUiOptions,
                ...overrideGameUiOptions,
            },
        } as IMapProps;
    },
    (dispatch) => ({
        selectCountry: (countryIdentifier: string) => {
            dispatch(selectCountry(countryIdentifier));
        },
        setUnits: (countryIdentifier: string, units: number) => {
            dispatch(setPlaceUnits(countryIdentifier, units));
        },
        setActionUnits: (units: number) => {
            dispatch(setActionUnits(units));
        },
        place: () => {
            dispatch(place(null));
        },
        attack: () => {
            dispatch(attack(null));
        },
        move: () => {
            dispatch(move(null));
        },
    })
)(Map);
