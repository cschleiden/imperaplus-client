import * as React from "react";

import "./header.scss";

import { connect } from "react-redux";
import { push } from "react-router-redux";

import Cards from "./cards";
import { ButtonGroup, Button } from "react-bootstrap";
import { IState } from "../../../reducers";
import { exchange, attack, move, endAttack, place, endTurn, toggleSidebar } from "../play.actions";
import { autobind } from "../../../lib/autobind";
import { Game, PlayState } from "../../../external/imperaClients";
import { css } from "../../../lib/css";
import { ToggleButton } from "../../../components/ui/toggleButton";

interface IHeaderProps {
}

interface IHeaderDispatchProps {
    game: Game;

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
        const inputActive = true;
        const placeOnlyTurn = false;
        const moveActive = false;
        const attackActive = false;
        const { game } = this.props;

        if (!game) {
            return null;
        }

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
                <span className="text-highlights ng-binding player-2" ng-className="'player-' + (playCtrl.game.currentPlayer.playOrder + 1)">digitald</span>
            </div>
            <div className="play-header-block full-text hidden-xs">
                <span>{/*<timer interval="1000" countdown="true" autostart="false" className="ng-binding ng-isolate-scope"><span className="ng-binding ng-scope">0:3:45:49</span></timer>*/}</span>
            </div>

            { /*<!-- Cards --> */}
            <div ng-show="playCtrl.player.cards &amp;&amp; playCtrl.player.cards.length > 0" className="play-header-block hidden-xs">
                <Button className="btn btn-u" title={__("Exchange cards")} onClick={this._onExchangeCards}>
                    <Cards />
                </Button>
            </div>

            {/*<!-- Actions -->*/}
            {inputActive && <div className="play-header-block" ng-show="playCtrl.inputActive">
                <Button
                    title={__("Place")}
                    className={css({
                        "current": game.playState === PlayState.PlaceUnits,
                        "enabled": false,
                        "hidden-xs": game.playState !== PlayState.PlaceUnits
                    })}
                    disabled={false}
                    ng-disabled="!playCtrl.placeActive"
                    ng-show="playCtrl.game.playState === 1"
                    onClick={this._onPlace}>
                    <span className="fa fa-dot-circle-o"></span>
                    <span>0/4</span>
                </Button>

                <ButtonGroup>
                    {/*<div className="btn-group hidden-xs" ng-className="{ 'hidden-xs': playCtrl.game.playState !== 2 }">*/}
                    {this.props.game.playState <= 2 && <Button title={__("Attack")} className={css("btn-u", {
                        "current": game.playState === PlayState.Attack
                    })}>
                        {/*<button className="btn btn-u ng-binding" ng-show="playCtrl.game.playState <= 2 &amp;&amp; !playCtrl.placeOnlyTurn" ng-className="{ current: playCtrl.game.playState === 2, enabled: playCtrl.attackActive }" ng-disabled="!playCtrl.attackActive" ng-click="playCtrl.attack()" disabled={true}>*/}
                        <span className="fa fa-crosshairs"></span>
                        <span>0/5</span>
                    </Button>}
                    <Button title={__("Change to move")} className="btn-u">
                        <span className="fa fa-mail-forward"></span>
                    </Button>
                </ButtonGroup>

                {game.playState <= PlayState.Move && placeOnlyTurn && <Button title={__("Move")} className={css("btn-u", "hidden-xs", {
                    "current": game.playState === 3,
                    "enabled": /*moveActive*/ true,
                    "hidden-xs": game.playState !== 3
                })}
                    onClick={this._onMove}
                    ng-disabled="!playCtrl.moveActive"
                    disabled={true}>
                    <span className="fa fa-mail-forward"></span>
                    <span>0/4</span>
                </Button>}
            </div>}

            {/*<!-- End Turn -->*/}
            {inputActive && game.playState > PlayState.PlaceUnits && <div className="play-header-block">
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

export default connect((state: IState, ownProps: IHeaderProps) => ({
    game: state.play.data.game
}), (dispatch) => ({
    place: () => dispatch(place(null)),
    exchangeCards: () => dispatch(exchange(null)),
    attack: () => dispatch(attack(null)),
    endAttack: () => dispatch(endAttack(null)),
    move: () => dispatch(move(null)),
    endTurn: () => dispatch(endTurn(null)),

    toggleSidebar: () => { dispatch(toggleSidebar()); },
    exit: () => { dispatch(push("/game/games")); }
}))(Header);