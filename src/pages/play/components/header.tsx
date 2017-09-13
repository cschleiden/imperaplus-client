import * as React from "react";

import "./header.scss";

import { connect } from "react-redux";
import { push } from "react-router-redux";

import { Button, ButtonGroup } from "react-bootstrap";
import { Spinner } from "../../../components/ui/spinner";
import { ToggleButton } from "../../../components/ui/toggleButton";
import { Game, Player, PlayState } from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { css } from "../../../lib/css";
import { IState } from "../../../reducers";
import { attack, endAttack, endTurn, exchange, leave, move, place, toggleSidebar } from "../play.actions";
import { canMoveOrAttack, canPlace, game, inputActive } from "../reducer/play.selectors";
import Cards from "./cards";

interface IHeaderProps {
}

interface IHeaderDispatchProps {
    game: Game;
    remainingPlaceUnits: number;
    player: Player;

    inputActive: boolean;
    operationInProgress: boolean;
    canPlace: boolean;
    canMoveOrAttack: boolean;

    place: () => void;
    exchangeCards: () => void;
    attack: () => void;
    endAttack: () => void;
    move: () => void;
    endTurn: () => void;

    toggleSidebar: () => void;
    exit: () => void;
}

class Header extends React.Component<IHeaderProps & IHeaderDispatchProps> {
    render() {
        const {
            game, remainingPlaceUnits, player, inputActive, canPlace, canMoveOrAttack, operationInProgress
        } = this.props;

        if (!game) {
            return null;
        }

        const currentPlayer = <span className={css("label", "current-player", "player", "player-" + (game.currentPlayer.playOrder + 1))}>
            {game.currentPlayer.name}
        </span>;

        return <div className="play-header">
            <div className="play-header-block">
                <ToggleButton className="btn-u" onToggle={this._onToggleSidebar} initialIsToggled={false}>
                    <span className="fa fa-bars" />
                </ToggleButton>
            </div>

            <div className="play-header-block stacked visible-xs">
                {currentPlayer}
                <span>{/*<timer interval="1000" countdown="true" autostart="false" className="ng-binding ng-isolate-scope"><span className="ng-binding ng-scope">0:3:45:49</span></timer>*/}</span>
            </div>

            <div className="play-header-block full-text hidden-xs">
                {currentPlayer}
            </div>
            <div className="play-header-block full-text hidden-xs">
                <span>{/*<timer interval="1000" countdown="true" autostart="false" className="ng-binding ng-isolate-scope"><span className="ng-binding ng-scope">0:3:45:49</span></timer>*/}</span>
            </div>

            {/*<!-- Cards --> */}
            <div className="play-header-block hidden-xs">
                <Button
                    className="btn btn-u"
                    title={`${__("Exchange cards")} (${player && player.cards && player.cards.length || 0}/${game.options.maximumNumberOfCards})`}
                    onClick={this._onExchangeCards}
                    disabled={!inputActive || game.playState !== PlayState.PlaceUnits}>
                    <Cards cards={player && player.cards} />
                </Button>
            </div>

            {/*<!-- Actions -->*/}
            {inputActive && <div className="play-header-block">
                {game.playState === PlayState.PlaceUnits && <Button
                    title={__("Place")}
                    className={css({
                        "current": game.playState === PlayState.PlaceUnits,
                        "enabled": canPlace,
                        "hidden-xs": game.playState !== PlayState.PlaceUnits
                    })}
                    onClick={this._onPlace}
                    disabled={!canPlace}>
                    <span className="fa fa-dot-circle-o"></span>&nbsp;<span>{remainingPlaceUnits}/{game.unitsToPlace}</span>
                </Button>}

                {game.playState === PlayState.Attack && <ButtonGroup>
                    <Button key="attack" title={__("Attack")} className={css("btn-u")} disabled={!canMoveOrAttack} onClick={this._onAttack}>
                        <span className="fa fa-crosshairs" />&nbsp;<span>
                            {game.attacksInCurrentTurn}/{game.options.attacksPerTurn}
                        </span>
                    </Button>
                    <Button key="endattack" title={__("Change to move")} className="btn-u" onClick={this._onEndAttack}>
                        <span className="fa fa-mail-forward"></span>
                    </Button>
                </ButtonGroup>}

                {game.playState === PlayState.Move && <Button title={__("Move")} className={css("btn-u", "hidden-xs", {
                    "current": game.playState === 3,
                    "enabled": canMoveOrAttack,
                    "hidden-xs": game.playState !== 3
                })}
                    onClick={this._onMove}
                    disabled={!canMoveOrAttack}>
                    <span className="fa fa-mail-forward"></span>&nbsp;<span>
                        {game.movesInCurrentTurn}/{game.options.movesPerTurn}
                    </span>
                </Button>}
            </div>}

            {/*<!-- End Turn -->*/}
            {inputActive && game.playState !== PlayState.PlaceUnits && <div className="play-header-block">
                <Button bsStyle="danger" className={css("btn-u", {
                    "enabled": game.playState !== PlayState.PlaceUnits
                })} title={__("End turn")} onClick={this._onEndTurn}>
                    <span className="fa fa-check"></span>
                </Button>
            </div>}

            {/*<!-- Right section -->*/}
            <div className="play-header-block right">
                <Button className="btn-u" onClick={this._onExit} title={__("Exit")}>
                    <span className="fa fa-level-up" />
                </Button>
            </div>

            {/*<!-- Spinner -->*/}
            {operationInProgress && <div className="play-header-block right">
                <Spinner className="btn" />
            </div>}
        </div>;
    }

    @autobind
    private _onExchangeCards() {
        this.props.exchangeCards();
    }

    @autobind
    private _onPlace() {
        this.props.place();
    }

    @autobind
    private _onAttack() {
        this.props.attack();
    }

    @autobind
    private _onEndAttack() {
        this.props.endAttack();
    }

    @autobind
    private _onMove() {
        this.props.move();
    }

    @autobind
    private _onEndTurn() {
        this.props.endTurn();
    }

    @autobind
    private _onToggleSidebar() {
        this.props.toggleSidebar();
    }

    @autobind
    private _onExit() {
        this.props.exit();
    }
}

export default connect((state: IState, ownProps: IHeaderProps) => {
    const { placeCountries, player, operationInProgress } = state.play.data;
    const remainingPlaceUnits = Object.keys(placeCountries).reduce((sum, ci) => sum + placeCountries[ci], 0);

    return {
        game: game(state.play),
        remainingPlaceUnits,
        player,
        inputActive: inputActive(state.play),
        canPlace: canPlace(state.play),
        canMoveOrAttack: canMoveOrAttack(state.play),
        operationInProgress
    };
}, (dispatch) => ({
    place: () => { dispatch(place(null)) },
    exchangeCards: () => { dispatch(exchange(null)) },
    attack: () => { dispatch(attack(null)) },
    endAttack: () => { dispatch(endAttack(null)) },
    move: () => { dispatch(move(null)) },
    endTurn: () => { dispatch(endTurn(null)) },

    toggleSidebar: () => { dispatch(toggleSidebar(null)); },
    exit: () => { dispatch(leave()); }
}))(Header);