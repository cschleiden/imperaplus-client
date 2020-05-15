import * as React from "react";
import {
    Button,
    ButtonGroup,
    Dropdown,
    MenuItem,
    OverlayTrigger,
    Popover,
} from "react-bootstrap";
import { connect } from "react-redux";
import { Game, Player, PlayState } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import {
    doLeave,
    doSetGameOption,
} from "../../lib/domain/game/play/play.actions";
import {
    canMoveOrAttack,
    canPlace,
    game,
    inputActive,
} from "../../lib/domain/game/play/play.selectors";
import {
    attack,
    endAttack,
    endTurn,
    exchange,
    move,
    place,
    toggleSidebar,
} from "../../lib/domain/game/play/play.slice";
import { IGameUIOptions } from "../../lib/domain/game/play/play.slice.state";
import { getUserId } from "../../lib/domain/shared/session/session.selectors";
import { css } from "../../lib/utils/css";
import { getTeam } from "../../lib/utils/game/utils";
import { IState } from "../../reducers";
import { AppDispatch } from "../../store";
import { Spinner } from "../ui/spinner";
import { Timer } from "../ui/timer";
import { ToggleButton } from "../ui/toggleButton";
import Cards from "./cards";
import style from "./header.module.scss";

interface IHeaderProps {}

interface IHeaderDispatchProps {
    game: Game;
    remainingPlaceUnits: number;
    player: Player;

    inputActive: boolean;
    operationInProgress: boolean;
    gameUiOptions: IGameUIOptions;
    canPlace: boolean;
    canMoveOrAttack: boolean;
    sidebarOpen: boolean;

    place: () => void;
    exchangeCards: () => void;
    attack: () => void;
    endAttack: () => void;
    move: () => void;
    endTurn: () => void;

    toggleSidebar: () => void;
    setGameUiOption: (name: keyof IGameUIOptions, value: boolean) => void;
    exit: () => void;
}

class Header extends React.Component<IHeaderProps & IHeaderDispatchProps> {
    render() {
        const {
            game,
            remainingPlaceUnits,
            inputActive,
            canPlace,
            canMoveOrAttack,
            operationInProgress,
            sidebarOpen,
        } = this.props;

        if (!game) {
            return null;
        }

        const isTeamGame = game.options.numberOfPlayersPerTeam > 1;
        const team = getTeam(game, game.currentPlayer.userId);

        const currentPlayer = (
            <span
                className={css(
                    "label",
                    style.currentPlayer,
                    "player",
                    "player-" + (game.currentPlayer.playOrder + 1),
                    {
                        ["player-team-" +
                        (team && team.playOrder + 1)]: isTeamGame,
                    }
                )}
            >
                {game.currentPlayer.name}
            </span>
        );

        return (
            <div className={style.playHeader}>
                <div className={style.playHeaderBlock}>
                    <ToggleButton
                        className={style.btn}
                        onToggle={this._onToggleSidebar}
                        initialIsToggled={sidebarOpen}
                    >
                        <span className="fa fa-bars" />
                    </ToggleButton>
                </div>

                {/* Mobile player + timeout */}
                <div
                    className={css(
                        style.playHeaderBlock,
                        style.stacked,
                        "visible-xs text-center"
                    )}
                >
                    {currentPlayer}
                    <Timer
                        key={`${game.id}-${game.turnCounter}`}
                        startInMs={game.timeoutSecondsLeft * 1000}
                    />
                </div>

                {/* Desktop current player */}
                <div
                    className={css(
                        style.playHeaderBlock,
                        style.fullText,
                        "hidden-xs"
                    )}
                >
                    {currentPlayer}
                </div>

                {/* Desktop timeout */}
                <div
                    className={css(
                        style.playHeaderBlock,
                        style.fullText,
                        "hidden-xs"
                    )}
                >
                    <Timer
                        key={`${game.id}-${game.turnCounter}`}
                        startInMs={game.timeoutSecondsLeft * 1000}
                    />
                </div>

                {/* Cards */}
                <div className={css(style.playHeaderBlock, "hidden-xs")}>
                    {this._renderCards()}
                </div>

                {/* Actions */}
                <div className={style.playHeaderBlock}>
                    {inputActive && game.playState === PlayState.PlaceUnits && (
                        <Button
                            title={__("Place")}
                            className={css(style.btn, {
                                [style.current]:
                                    game.playState === PlayState.PlaceUnits,
                                [style.enabled]: canPlace,
                                "hidden-xs":
                                    game.playState !== PlayState.PlaceUnits,
                            })}
                            onClick={this._onPlace}
                            disabled={!canPlace}
                        >
                            <span className="fa fa-dot-circle-o" />
                            &nbsp;
                            <span>
                                {remainingPlaceUnits}/{game.unitsToPlace}
                            </span>
                        </Button>
                    )}

                    {inputActive && game.playState === PlayState.Attack && (
                        <ButtonGroup className={style.actionAttack}>
                            <Button
                                key="attack"
                                title={__("Attack")}
                                className={css(style.btn, {
                                    [style.current]:
                                        game.playState === PlayState.Attack,
                                    [style.enabled]: true,
                                })}
                                disabled={!canMoveOrAttack}
                                onClick={this._onAttack}
                            >
                                <span className="fa fa-crosshairs" />
                                &nbsp;
                                <span>
                                    {game.attacksInCurrentTurn}/
                                    {game.options.attacksPerTurn}
                                </span>
                            </Button>
                            <Button
                                key="endattack"
                                title={__("Change to move")}
                                className={style.btn}
                                onClick={this._onEndAttack}
                            >
                                <span className="fa fa-mail-forward" />
                            </Button>
                        </ButtonGroup>
                    )}

                    {inputActive &&
                        (game.playState === PlayState.Attack ||
                            game.playState === PlayState.Move) && (
                            <Button
                                title={__("Move")}
                                className={css(style.btn, style.actionMove, {
                                    [style.current]:
                                        game.playState === PlayState.Move,
                                    [style.enabled]:
                                        canMoveOrAttack &&
                                        game.playState === PlayState.Move,
                                    "hidden-xs":
                                        game.playState !== PlayState.Move,
                                })}
                                onClick={this._onMove}
                                disabled={
                                    !canMoveOrAttack ||
                                    game.playState !== PlayState.Move
                                }
                            >
                                <span className="fa fa-mail-forward" />
                                &nbsp;
                                <span>
                                    {game.movesInCurrentTurn}/
                                    {game.options.movesPerTurn}
                                </span>
                            </Button>
                        )}

                    {!inputActive && (
                        <Button
                            title={__("Wait")}
                            className={css(style.btn, "action-none", {
                                [style.current]:
                                    game.playState === PlayState.Move,
                                [style.enabled]: false,
                                "hidden-xs": game.playState !== PlayState.Move,
                            })}
                            disabled={!canMoveOrAttack}
                        >
                            <span className="fa fa-mail-forward" />
                            &nbsp;
                            <span>
                                {game.movesInCurrentTurn}/
                                {game.options.movesPerTurn}
                            </span>
                        </Button>
                    )}
                </div>

                {/* End Turn */}
                {inputActive && game.playState !== PlayState.PlaceUnits && (
                    <div className={style.playHeaderBlock}>
                        <Button
                            bsStyle="danger"
                            className={css(style.btn, "enabled")}
                            title={__("End turn")}
                            onClick={this._onEndTurn}
                        >
                            <span className="fa fa-check" />
                        </Button>
                    </div>
                )}

                {/* Right section */}
                <div
                    className={css(
                        style.playHeaderBlock,
                        style.right,
                        "hidden-xs"
                    )}
                >
                    {this._renderOptions()}
                    {this._renderExit()}
                </div>

                {/* Mobile right section */}
                <div
                    className={css(
                        style.playHeaderBlock,
                        style.right,
                        "visible-xs"
                    )}
                >
                    <OverlayTrigger
                        trigger="click"
                        rootClose={true}
                        placement="bottom"
                        overlay={this._mobileGameActions()}
                    >
                        <Button className={css("btn", style.btn)}>
                            <span className="fa fa-ellipsis-h" />
                        </Button>
                    </OverlayTrigger>
                </div>

                {/* Spinner */}
                {operationInProgress && (
                    <div className={css(style.playHeaderBlock, style.right)}>
                        <Spinner />
                    </div>
                )}
            </div>
        );
    }

    private _mobileGameActions() {
        return (
            <Popover id="game-actions" className={style.mobileActions}>
                <div className={style.mobileAction}>{this._renderCards()}</div>

                <div className={style.mobileAction}>
                    {this._renderOptions()}
                </div>

                <div className={style.mobileAction}>{this._renderExit()}</div>
            </Popover>
        );
    }

    private _renderCards() {
        const { game, player, inputActive } = this.props;

        return (
            <Button
                className={css("btn", style.btn)}
                title={`${__("Exchange cards")} (${
                    (player && player.cards && player.cards.length) || 0
                }/${game.options.maximumNumberOfCards})`}
                onClick={this._onExchangeCards}
                disabled={
                    !inputActive || game.playState !== PlayState.PlaceUnits
                }
            >
                <Cards cards={player && player.cards} />
            </Button>
        );
    }

    private _renderOptions() {
        const { gameUiOptions } = this.props;

        const DT: any = Dropdown.Toggle;
        const DM: any = Dropdown.Menu;

        return (
            <Dropdown id="options" pullRight className={style.options}>
                <DT noCaret>
                    <span className="fa fa-cog" />
                </DT>
                <DM className="super-colors">
                    <MenuItem
                        eventKey="showTeamsOnMap"
                        onSelect={this._toggleGameUiOption as any}
                        active={gameUiOptions.showTeamsOnMap}
                    >
                        {__("Show teams on map [CTRL]")}
                    </MenuItem>
                </DM>
            </Dropdown>
        );
    }

    private _renderExit() {
        return (
            <Button
                className={style.btn}
                onClick={this._onExit}
                title={__("Exit")}
            >
                <span className="fa fa-level-up" />
            </Button>
        );
    }

    private _toggleGameUiOption = (eventKey: keyof IGameUIOptions): void => {
        const { gameUiOptions } = this.props;

        this.props.setGameUiOption(eventKey, !gameUiOptions[eventKey]);
    };

    private _onExchangeCards = () => {
        this.props.exchangeCards();
    };

    private _onPlace = () => {
        this.props.place();
    };

    private _onAttack = () => {
        this.props.attack();
    };

    private _onEndAttack = () => {
        this.props.endAttack();
    };

    private _onMove = () => {
        this.props.move();
    };

    private _onEndTurn = () => {
        this.props.endTurn();
    };

    private _onToggleSidebar = () => {
        this.props.toggleSidebar();
    };

    private _onExit = () => {
        this.props.exit();
    };
}

export default connect(
    (state: IState, ownProps: IHeaderProps) => {
        const {
            placeCountries,
            player,
            operationInProgress,
            gameUiOptions,
        } = state.play;
        const remainingPlaceUnits = Object.keys(placeCountries).reduce(
            (sum, ci) => sum + placeCountries[ci],
            0
        );

        return {
            game: game(state.play),
            remainingPlaceUnits,
            player,
            inputActive: inputActive(state.play, getUserId(state)),
            canPlace: canPlace(state.play),
            canMoveOrAttack: canMoveOrAttack(state.play),
            sidebarOpen: state.play.sidebarOpen,
            operationInProgress,
            gameUiOptions,
        };
    },
    (dispatch: AppDispatch) => ({
        place: () => {
            dispatch(place());
        },
        exchangeCards: () => {
            dispatch(exchange());
        },
        attack: () => {
            dispatch(attack());
        },
        endAttack: () => {
            dispatch(endAttack());
        },
        move: () => {
            dispatch(move());
        },
        endTurn: () => {
            dispatch(endTurn());
        },

        toggleSidebar: () => {
            dispatch(toggleSidebar());
        },
        setGameUiOption: (name: keyof IGameUIOptions, value: boolean) => {
            dispatch(doSetGameOption(false, name, value));
        },
        exit: () => {
            dispatch(doLeave());
        },
    })
)(Header);
