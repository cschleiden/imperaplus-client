import * as React from "react";

import "./header.scss";

import { connect } from "react-redux";
import { push } from "react-router-redux";

import Cards from "./cards";
import { ButtonGroup, Button } from "react-bootstrap";
import { IState } from "../../../reducers";
import { exchange, attack, move, endAttack, place, endTurn, toggleSidebar } from "../play.actions";
import { autobind } from "../../../lib/autobind";
import { Game, PlayState, Player } from "../../../external/imperaClients";
import { css } from "../../../lib/css";
import { ToggleButton } from "../../../components/ui/toggleButton";
import { store } from "../../../store";
import { canPlace, inputActive } from "../play.selectors";

interface IHeaderProps {
}

interface IHeaderDispatchProps {
    game: Game;
    remainingPlaceUnits: number;
    player: Player;

    inputActive: boolean;
    canPlace: boolean;
    canAttack: boolean;
    canMove: boolean;

    place: () => void;
    exchangeCards: () => void;
    attack: () => void;
    endAttack: () => void;
    move: () => void;
    endTurn: () => void;

    toggleSidebar: () => void;
    exit: () => void;
}

class Header extends React.Component<IHeaderProps & IHeaderDispatchProps, void> {
    render() {
        const { game, remainingPlaceUnits, player, inputActive, canPlace, canAttack, canMove } = this.props;

        if (!game) {
            return null;
        }

        const placeOnlyTurn = false;
        const attackActive = game.playState === PlayState.Attack;
        const moveActive = game.playState === PlayState.Move;

        return <div className="play-header">
            <div className="play-header-block">
                <ToggleButton className="btn-u" onToggle={this._onToggleSidebar} initialIsToggled={false}>
                    <span className="fa fa-bars" />
                </ToggleButton>
            </div>

            <div className="play-header-block stacked visible-xs">
                <span className="text-highlights ng-binding player-2" ng-className="'player-' + (playCtrl.game.currentPlayer.playOrder + 1)">digitald</span>
                <span>{/*<timer interval="1000" countdown="true" autostart="false" className="ng-binding ng-isolate-scope"><span className="ng-binding ng-scope">0:3:45:49</span></timer>*/}</span>
            </div>

            <div className="play-header-block full-text hidden-xs">
                <span className={css("current-player", "player-" + (game.currentPlayer.playOrder + 1))}>
                    {game.currentPlayer.name}
                </span>
            </div>
            <div className="play-header-block full-text hidden-xs">
                <span>{/*<timer interval="1000" countdown="true" autostart="false" className="ng-binding ng-isolate-scope"><span className="ng-binding ng-scope">0:3:45:49</span></timer>*/}</span>
            </div>

            {/*<!-- Cards --> */}
            <div className="play-header-block hidden-xs">
                <Button className="btn btn-u" title={__("Exchange cards")} onClick={this._onExchangeCards} disabled={!inputActive}>
                    <Cards cards={player && player.cards} />
                </Button>
            </div>

            {/*<!-- Actions -->*/}
            {inputActive && <div className="play-header-block" ng-show="playCtrl.inputActive">
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
                    <Button title={__("Attack")} className={css("btn-u")} disabled={!canAttack}>
                        <span className="fa fa-crosshairs" />&nbsp;<span>
                            {game.attacksInCurrentTurn}/{game.options.attacksPerTurn}
                        </span>
                    </Button>
                    <Button title={__("Change to move")} className="btn-u">
                        <span className="fa fa-mail-forward"></span>
                    </Button>
                </ButtonGroup>}

                {game.playState === PlayState.Move && <Button title={__("Move")} className={css("btn-u", "hidden-xs", {
                    "current": game.playState === 3,
                    "enabled": canMove,
                    "hidden-xs": game.playState !== 3
                })}
                    onClick={this._onMove}
                    disabled={!canMove}>
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
            <div className="play-header-block right ng-hide" ng-show="playCtrl.operationInProgress">

            </div>
        </div>;
    }

    @autobind
    private _onExchangeCards() {
    }

    @autobind
    private _onPlace() {
        this.props.place();
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
    const { game, canMove, canAttack, placeCountries, player } = state.play.data;
    const remainingPlaceUnits = Object.keys(placeCountries).reduce((sum, ci) => sum + placeCountries[ci], 0);

    return {
        game: game,
        remainingPlaceUnits,
        player,
        inputActive: inputActive(state.play),
        canPlace: canPlace(state.play),
        canMove,
        canAttack
    };
}, (dispatch) => ({
    place: () => dispatch(place(null)),
    exchangeCards: () => dispatch(exchange(null)),
    attack: () => dispatch(attack(null)),
    endAttack: () => dispatch(endAttack(null)),
    move: () => dispatch(move(null)),
    endTurn: () => dispatch(endTurn(null)),

    toggleSidebar: () => { dispatch(toggleSidebar()); },
    exit: () => { dispatch(push("/game/games")); }
}))(Header);