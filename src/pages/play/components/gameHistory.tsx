import * as React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { format } from "../../../components/ui/format";
import { Spinner, SpinnerSize } from "../../../components/ui/spinner";
import { SubSection } from "../../../components/ui/typography";
import { Game, GameState, HistoryAction, HistoryEntry, HistoryTurn } from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { css } from "../../../lib/css";
import { getPlayerByPlayerId } from "../../../lib/game/utils";
import { IState } from "../../../reducers";
import { MapTemplateCacheEntry } from "../mapTemplateCache";
import { historyExit, historyTurn } from "../play.actions";

export interface IGameHistoryEntryProps {
    game: Game;
    mapTemplate: MapTemplateCacheEntry;
    entry: HistoryEntry;
}

export class GameHistoryEntry extends React.Component<IGameHistoryEntryProps> {
    render(): JSX.Element {
        const { game, mapTemplate } = this.props;
        const { action, actorId, originIdentifier, destinationIdentifier, units, result } = this.props.entry;

        const actor = getPlayerByPlayerId(game, actorId);
        let actorElement: JSX.Element;
        if (actor) {
            actorElement = <span key="actor" className={css("label", "player", "player-" + (actor.playOrder + 1))}>{actor.name}</span>;
        }

        const originCountry = mapTemplate.country(originIdentifier);
        const destCountry = mapTemplate.country(destinationIdentifier);

        switch (action) {
            case HistoryAction.StartGame:
                return format(__("Game has started"));

            case HistoryAction.EndGame:
                return format(__("Game has ended"));

            case HistoryAction.PlaceUnits:
                return format(__("{0} placed {1} units on {2}"),
                    actorElement,
                    units,
                    originCountry.name);

            case HistoryAction.Attack:
                return format(__("{0} attacked from {1} to {2} with {3} units and {4}"),
                    actorElement,
                    originCountry.name,
                    destCountry.name,
                    units,
                    result ? __("won") : __("lost"));

            case HistoryAction.Move:
                return format(__("{0} moved {1} units from {2} to {3}"),
                    actorElement,
                    units,
                    originCountry.name,
                    destCountry.name);

            case HistoryAction.ExchangeCards:
                return format(__("{0} exchanged cards"), actorElement);

            case HistoryAction.PlayerLost:
                return format(__("{0} has lost"), actorElement);

            case HistoryAction.PlayerWon:
                return format(__("{0} has won"), actorElement);

            case HistoryAction.PlayerTimeout:
                return format(__("{0} had a timeout"), actorElement);

            case HistoryAction.PlayerSurrendered:
                return format(__("{0} surrendered"), actorElement);

            default:
            case HistoryAction.StartGame:
            case HistoryAction.OwnerChange:
            case HistoryAction.EndTurn:
            case HistoryAction.None:
                break;
        }

        return null;
    }
}

interface IGameHistoryProps {
    gameEnded: boolean;
    gameTurn: number;
    historyActive: boolean;
    historyTurn: HistoryTurn;
    mapTemplate: MapTemplateCacheEntry;
    pending: boolean;

    showHistoryTurn: (turnId: number) => void;
    exitHistory: () => void;
}

class GameHistory extends React.Component<IGameHistoryProps> {
    render() {
        const { historyTurn, pending } = this.props;
        const currentTurn = this._getCurrentTurn();
        const historyTurnDisplay = historyTurn && historyTurn.turnId != null ? historyTurn.turnId : currentTurn;

        return (
            <div className="game-history">
                <SubSection>{__("History")}&nbsp;-&nbsp;{__("Turn")}&nbsp;{historyTurnDisplay}&nbsp;{__("of")}&nbsp;{currentTurn}</SubSection>

                {
                    pending && <div className="text-center">
                        <Spinner className="center-block" size={SpinnerSize.Default} />
                    </div>
                }

                {
                    !pending && this._renderControls()
                }

                {
                    (!pending && historyTurn) && this._renderActions()
                }
            </div>
        );
    }

    private _renderControls() {
        const { historyTurn } = this.props;
        const gameTurn = this._getCurrentTurn();
        const historyTurnId = (historyTurn && historyTurn.turnId != null) ? historyTurn.turnId : gameTurn;

        return (
            <ul className="list-unstyled list-inline narrow">
                <li>
                    <Button disabled={historyTurnId === 0} onClick={this._onHistoryFirst}>
                        <span className="fa fa-fast-backward" />
                    </Button>
                </li>

                <li>
                    <Button disabled={historyTurnId === 0} onClick={this._onHistoryPrevious}>
                        <span className="fa fa-step-backward" />
                    </Button>
                </li>

                <li>
                    <Button disabled={historyTurnId >= gameTurn} onClick={this._onHistoryNext}>
                        <span className="fa fa-step-forward" />
                    </Button>
                </li>

                <li>
                    <Button disabled={historyTurnId >= gameTurn} onClick={this._onHistoryExit}>
                        <span className="fa fa-play" />
                    </Button>
                </li>
            </ul>
        );
    }

    private _renderActions() {
        const { mapTemplate, historyTurn } = this.props;
        const { actions } = historyTurn;

        return (
            <ul className="list-unstyled">
                {
                    actions.map(entry => (
                        <li key={entry.id}>
                            <GameHistoryEntry game={historyTurn.game} entry={entry} mapTemplate={mapTemplate} />
                        </li>
                    ))
                }
            </ul>
        );
    }

    @autobind
    private _onHistoryFirst() {
        this.props.showHistoryTurn(0);
    }

    @autobind
    private _onHistoryPrevious() {
        const { historyTurn } = this.props;
        const historyTurnId = historyTurn && historyTurn.turnId || null;

        if (historyTurnId > 0) {
            this.props.showHistoryTurn(historyTurnId - 1);
        } else {
            this.props.showHistoryTurn(this._getCurrentTurn() - 1);
        }
    }

    @autobind
    private _onHistoryNext() {
        const { historyTurn } = this.props;
        const historyTurnId = historyTurn && historyTurn.turnId || null;
        const newHistoryTurn = historyTurnId + 1;

        if (newHistoryTurn === this._getCurrentTurn()) {
            this.props.exitHistory();
        } else {
            this.props.showHistoryTurn(newHistoryTurn);
        }
    }

    @autobind
    private _onHistoryExit() {
        this.props.exitHistory();
    }

    private _getCurrentTurn(): number {
        const { gameEnded, gameTurn } = this.props;

        if (gameEnded) {
            return gameTurn + 1;
        }

        return gameTurn;
    }
}

export default connect((state: IState) => {
    const playState = state.play;

    return {
        gameEnded: playState.game && playState.game.state === GameState.Ended,
        gameTurn: playState.game && playState.game.turnCounter,
        historyActive: playState.historyActive,
        historyTurn: playState.historyTurn,
        mapTemplate: playState.mapTemplate,
        pending: playState.operationInProgress
    };
}, (dispatch) => ({
    showHistoryTurn: (turnId: number): void => { dispatch(historyTurn(turnId)); },
    exitHistory: (): void => { dispatch(historyExit(null)); }
}))(GameHistory);