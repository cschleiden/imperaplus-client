import * as React from "react";
import { connect } from "react-redux";
import {
    Game,
    HistoryAction,
    HistoryEntry,
    HistoryTurn,
    PlayState,
} from "../../external/imperaClients";
import {
    areConnected,
    country,
    mapImage,
    MapTemplateCacheEntry,
} from "../../lib/domain/game/play/mapTemplateCache";
import {} from "../../lib/domain/game/play/play.actions";
import { game } from "../../lib/domain/game/play/play.selectors";
import {
    attack,
    move,
    place,
    selectCountry,
    setActionUnits,
    setPlaceUnits,
} from "../../lib/domain/game/play/play.slice";
import {
    IGameUIOptions,
    ITwoCountry,
} from "../../lib/domain/game/play/play.slice.state";
import { css } from "../../lib/utils/css";
import {
    countriesToMap,
    getPlayerByPlayerId,
    getTeam,
} from "../../lib/utils/game/utils";
import { IState } from "../../reducers";
import { AppDispatch } from "../../store";
import { withUser } from "../../types";
import { CountryInputField } from "./countryInput";
import style from "./map.module.scss";
import { CountryArrowDefinition, MapSvgOverlay } from "./mapSvgOverlay";

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

    selectCountry: (countryIdentifier?: string) => void;
    setUnits: (countryIdentifier: string, units: number) => void;
    setActionUnits: (units: number) => void;

    place: () => void;
    attack: () => void;
    move: () => void;
}

interface IMapState {
    hoveredCountry: string;
}

class Map extends React.Component<IMapProps, IMapState> {
    private _unitInputFocus: boolean = false;
    private _inputElement: HTMLInputElement;

    constructor(props: IMapProps, context) {
        super(props, context);

        this.state = {
            hoveredCountry: null,
        };
    }

    render(): JSX.Element {
        const { mapTemplate, historyTurn, operationInProgress } = this.props;

        return (
            <div
                className={css(style.map, "clear-country-marker", {
                    [style.blocked]: operationInProgress,
                })}
                onClick={this._onClick}
                onMouseMove={this._onMouseMove}
            >
                {mapTemplate && (
                    <img
                        src={mapImage(mapTemplate)}
                        className={style.map}
                        key="map-image"
                    />
                )}
                <MapSvgOverlay
                    className="clear-country-marker"
                    mapTemplate={mapTemplate}
                    countryArrows={this._getArrows()}
                />
                {mapTemplate && this._renderCountries()}
                {historyTurn &&
                    mapTemplate &&
                    this._renderHistory(mapTemplate, historyTurn.actions)}
            </div>
        );
    }

    componentDidUpdate() {
        const { twoCountry } = this.props;

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
                areConnected(
                    mapTemplate,
                    hoveredCountry,
                    countryTemplate.identifier
                );

            const placeUnits = placeCountries[countryTemplate.identifier];
            const hasInput = !operationInProgress && placeUnits !== undefined;

            let units = "?";
            if (country && country.units != null) {
                units = country.units.toString(10);
            }

            return (
                <React.Fragment key={`cs-${countryTemplate.identifier}`}>
                    <div
                        id={countryTemplate.identifier}
                        key={countryTemplate.identifier}
                        className={css(style.country, {
                            // only show player color when country is visible
                            ["player-" +
                            (player ? player.playOrder + 1 : 0)]: !!country,
                            [style.countryHighlight]: isHighlighted,
                            ["country-team-" + (team ? team.playOrder + 1 : 0)]:
                                isTeamGame && gameUiOptions.showTeamsOnMap,
                        })}
                        style={{
                            left: countryTemplate.x,
                            top: countryTemplate.y,
                        }}
                    >
                        {units}
                    </div>
                    {hasInput && (
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
                    )}
                </React.Fragment>
            );
        });
    }

    private _getHistoryUnitAnnotation(action: HistoryEntry): JSX.Element {
        return <div className={css(style.historyLabel)}>{action.units}</div>;
    }

    private _getArrows(): CountryArrowDefinition[] {
        const { game, twoCountry, historyTurn } = this.props;

        if (historyTurn) {
            const historyArrows: CountryArrowDefinition[] = [];

            const { actions } = historyTurn;
            for (let action of actions) {
                switch (action.action) {
                    case HistoryAction.Attack: {
                        historyArrows.push({
                            sourceCountry: action.originIdentifier,
                            targetCountry: action.destinationIdentifier,
                            className: style.connectionAttack,
                            annotation: this._getHistoryUnitAnnotation(action),
                            annotationWidth: 20,
                            annotationHeight: 16,
                            curve: 10,
                        });
                        break;
                    }

                    case HistoryAction.Move: {
                        historyArrows.push({
                            sourceCountry: action.originIdentifier,
                            targetCountry: action.destinationIdentifier,
                            className: style.connectionMove,
                            annotation: this._getHistoryUnitAnnotation(action),
                            annotationWidth: 20,
                            annotationHeight: 16,
                            curve: 10,
                        });
                        break;
                    }
                }
            }

            return historyArrows;
        } else {
            switch (game.playState) {
                case PlayState.Attack:
                case PlayState.Move: {
                    if (!twoCountry.originCountryIdentifier) {
                        return [];
                    }

                    const className =
                        game.playState === PlayState.Attack
                            ? style.connectionAttack
                            : style.connectionMove;

                    if (twoCountry.destinationCountryIdentifier) {
                        // Target has been selected, render unit input
                        return [
                            {
                                sourceCountry:
                                    twoCountry.originCountryIdentifier,
                                targetCountry:
                                    twoCountry.destinationCountryIdentifier,
                                annotation: this._renderUnitInput(),
                                className,
                            },
                        ];
                    } else {
                        // Target has not been selected, render
                        return twoCountry.allowedDestinations.map((c) => ({
                            sourceCountry: twoCountry.originCountryIdentifier,
                            targetCountry: c,
                            className,
                        }));
                    }
                }
            }
        }
    }

    private _renderUnitInput(): JSX.Element {
        const {
            destinationCountryIdentifier,
            numberOfUnits,
            minUnits,
            maxUnits,
        } = this.props.twoCountry;

        return (
            <div key="unit-input" className={style.actionOverlayWrapper}>
                <input
                    className={style.actionOverlayInput}
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

    private _onUnitInputFocus = () => {
        this._unitInputFocus = true;
        this._inputElement.select();
    };

    private _onUnitInputBlur = () => {
        this._unitInputFocus = false;
    };

    private _resolveInput = (element: HTMLInputElement) => {
        this._inputElement = element;
    };
    private _changeUnits = (ev: React.FormEvent<HTMLInputElement>) => {
        const value = (ev.target as HTMLInputElement).value;
        const units = parseInt(value, 10);

        this.props.setActionUnits(units);
    };

    private _onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;

        if (target.classList.contains(style.country)) {
            const countryIdentifier = target.id;
            this._onCountryClick(countryIdentifier);
        } else if (target.classList.contains("clear-country-marker")) {
            // Cancel any country selection
            this.props.selectCountry();
        }
    };

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

    private _onMouseMove = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;

        if (target.classList.contains(style.country)) {
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
    };

    private _onKeyUp = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        switch (ev.keyCode) {
            case KeyBindings.SUBMIT_ACTION:
                this._performAction();
                break;

            case KeyBindings.ABORT:
                this.props.selectCountry();
                break;
        }
    };

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
        const result: JSX.Element[] = [];

        for (const action of actions.filter(
            (a) => a.action === HistoryAction.PlaceUnits
        )) {
            const countryTemplate = country(
                mapTemplate,
                action.originIdentifier
            );

            result.push(
                <div
                    key={`history-${action.id}`}
                    className={style.countryPlace}
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
            mapTemplate,
            placeCountries: placeCountries,
            twoCountry: twoCountry,
            operationInProgress,
            gameUiOptions: {
                ...gameUiOptions,
                ...overrideGameUiOptions,
            },
        } as IMapProps;
    },
    (dispatch: AppDispatch) => ({
        selectCountry: (countryIdentifier: string) => {
            dispatch(withUser(selectCountry, { countryIdentifier }));
        },
        setUnits: (countryIdentifier: string, units: number) => {
            dispatch(setPlaceUnits({ countryIdentifier, units }));
        },
        setActionUnits: (units: number) => {
            dispatch(setActionUnits(units));
        },
        place: () => {
            dispatch(place());
        },
        attack: () => {
            dispatch(attack());
        },
        move: () => {
            dispatch(move());
        },
    })
)(Map);
