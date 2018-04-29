import * as React from "react";
import { Button, Glyphicon, Table } from "react-bootstrap";
import { Link } from "react-router";
import { GameState, GameSummary, PlayerSummary } from "../../../external/imperaClients";
import { css } from "../../../lib/css";
import { Timer } from "../timer";
import GameDetails from "./gameDetail";
import "./gameList.scss";
import { GameStateDisplay } from "./gameState";
import { PlayerOutcomeDisplay } from "./playerOutcome";

interface IGameListProps {
    games: GameSummary[];

    userId: string;

    showCreatedBy?: boolean;

    showActive?: boolean;

    additionalColumns?: { [columnKey: string]: (game: GameSummary) => JSX.Element };
}

interface IGameListState {
    expandedGames?: { [id: number]: boolean };
}

export class GameList extends React.Component<IGameListProps, IGameListState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expandedGames: {}
        };
    }

    public render() {
        const header = this._renderHeader();
        const rows = this.props.games.map(game => this._renderGameRow(game));

        return (
            <Table className="game-list">
                <thead>
                    {header}
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }

    private _renderHeader() {
        const { showActive = true, showCreatedBy = false, additionalColumns = {} } = this.props;

        return (
            <tr>
                <th className="hidden-xs">{__("Id")}</th>
                <th>{__("Name")}</th>
                <th className="hidden-xs">{__("Map")}</th>
                <th className="hidden-xs">{__("Mode")}</th>
                {showCreatedBy && <th className="hidden-xs username">{__("Created By")}</th>}
                {showActive && <th className="hidden-xs username">{__("Active")}</th>}
                <th className="hidden-xs hidden-sm text-center">{__("Teams/Players")}</th>
                {showActive && <th className="timer">{__("Time")}</th>}
                {showActive && <th className="state">{__("State")}</th>}
                {
                    Object.keys(additionalColumns).map(ac => (
                        <th key={ac}>&nbsp;</th>
                    ))
                }
                <th>&nbsp;</th>
            </tr>
        );
    }

    private _renderGameRow(game: GameSummary): JSX.Element[] {
        const { showActive = true, showCreatedBy = false, userId, additionalColumns = {} } = this.props;

        const player = this._playerForGame(game);

        let name: JSX.Element;
        if (game.state !== GameState.Open) {
            name = <Link to={`/play/${game.id}`}>{game.name}</Link>;
        } else {
            name = <span>{game.name}</span>;
        }

        const isPlayersTurn = game.state === GameState.Active && game.currentPlayer && game.currentPlayer.userId === userId;

        const rows = [(
            <tr
                className={css({
                    "game-players-turn": isPlayersTurn
                })}
                key={`game-${game.id}`}
            >
                <td className="hidden-xs">{game.id}</td>
                <td>{name}</td>
                <td className="hidden-xs">{game.mapTemplate}</td>
                <td className="hidden-xs">{game.options.mapDistribution}</td>
                {
                    showCreatedBy && <td className="hidden-xs">{game.createdByName}</td>}
                {
                    showActive && <td
                        className={
                            css("hidden-xs", {
                                "players-turn": isPlayersTurn
                            })
                        }
                    >{game.currentPlayer && game.currentPlayer.name}
                    </td>
                }
                <td className="hidden-xs hidden-sm text-center">{`${game.options.numberOfTeams}/${game.options.numberOfPlayersPerTeam}`}</td>
                {showActive && <td>
                    {this._renderTimer(game)}
                </td>}
                {/* Game state */}
                {
                    showActive && <td>
                        <GameStateDisplay gameState={game.state} />
                        {player && <span>
                            &nbsp;-&nbsp;<PlayerOutcomeDisplay outcome={player.outcome} />
                        </span>}
                    </td>
                }
                {
                    Object.keys(additionalColumns).map(ac => (
                        <th key={ac}>{additionalColumns[ac](game)}</th>
                    ))
                }
                <td>
                    <Button
                        bsSize="xsmall"
                        bsStyle="info"
                        title={__("Show details")}
                        onClick={() => this._toggle(game.id)}
                    >
                        <Glyphicon glyph="info-sign" />
                    </Button>
                </td>
            </tr>
        )];

        // Show detailed information        
        if (this.state.expandedGames[game.id]) {
            rows.push(
                <tr key={`game-${game.id}-detail`}>
                    <td colSpan={9}>
                        <GameDetails game={game} />
                    </td>
                </tr>
            );
        }

        return rows;
    }

    private _renderTimer(game: GameSummary) {
        if (game.state !== GameState.Active) {
            switch (game.state) {
                case GameState.Open:
                    return <span>{__("Not started")}</span>;

                case GameState.Ended:
                    return <span>{__("Ended")}</span>;
            }
        }

        if (game.timeoutSecondsLeft > 0) {
            return <Timer startInMs={game.timeoutSecondsLeft * 1000} />;
        }

        return <span>{__("Time out")}</span>;
    }

    private _playerForGame(game: GameSummary): PlayerSummary | null {
        for (let team of game.teams) {
            for (let player of team.players) {
                if (player.userId === this.props.userId) {
                    return player;
                }
            }
        }

        return null;
    }

    private _toggle(id: number) {
        let update = Object.assign({}, this.state.expandedGames);

        if (this.state.expandedGames[id]) {
            delete update[id];
        } else {
            update[id] = true;
        }

        this.setState({
            expandedGames: update
        });
    }
}
