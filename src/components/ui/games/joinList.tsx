import * as React from "react";

import "./joinList.scss";

import { GameSummary, PlayerSummary, Game, GameState } from "../../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../../components/layout";
import HumanDate from "../humanDate";
import { Title, Section } from "../typography";
import GameDetails from "./gameDetail";

import { Table, Glyphicon, Button } from "react-bootstrap";
import { GameStateDisplay } from "./gameState";
import { PlayerOutcomeDisplay } from "./playerOutcome";
import { store } from "../../../store";
import { Link } from "react-router";


interface IGameListProps {
    games: GameSummary[];
}

interface IGameListState {
    expandedGames?: { [id: number]: boolean };
}

export class JoinList extends React.Component<IGameListProps, IGameListState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expandedGames: {}
        };
    }

    public render() {
        const header = this._renderHeader();
        const rows = this.props.games.map(game => this._renderGameRow(game));

        return <Table className="game-list">
            <thead>
                {header}
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>;
    }

    private _renderHeader() {
        return <tr>
            <th>{__("Id")}</th>
            <th>{__("Name")}</th>
            <th className="hidden-xs">{__("Map")}</th>
            <th className="hidden-xs">{__("Mode")}</th>
            <th className="hidden-xs">{__("Owner")}</th>
            <th className="hidden-xs">{__("Teams/Players")}</th>
            <th>&nbsp;</th>
        </tr>;
    }

    private _renderGameRow(game: GameSummary): JSX.Element[] {
        const player = this._playerForGame(game);
        let playerState: JSX.Element = null;

        if (!!player) {
            playerState = <span>&nbsp;-&nbsp;<PlayerOutcomeDisplay outcome={player.outcome} /></span>;
        }

        let name: JSX.Element;
        if (game.state !== GameState.Open) {
            name = <Link to={`/play/${game.id}`}>{game.name}</Link>;
        } else {
            name = <span>{game.name}</span>;
        }

        const rows = [<tr key={`game-${game.id}`}>
            <td>{game.id}</td>
            <td>
                {name}
            </td>
            <td className="hidden-xs">{game.mapTemplate}</td>
            <td className="hidden-xs">{game.options.mapDistribution}</td>
            <td className="hidden-xs">{game.createdByName}</td>
            <td className="hidden-xs">{`${game.options.numberOfTeams}/${game.options.numberOfPlayersPerTeam}`}</td>
            <td>
                <Button
                    bsSize="xsmall" bsStyle="info"
                    title={__("Show details")}
                    onClick={() => this._toggle(game.id)}>
                    <Glyphicon glyph="info-sign" />
                </Button>
            </td>
        </tr>];

        if (this.state.expandedGames[game.id]) {
            rows.push(<tr key={`game-${game.id}-detail`}>
                <td colSpan={9}>
                    <GameDetails
                        game={game} />
                </td>
            </tr>);
        }

        return rows;
    }

    private _playerForGame(game: GameSummary): PlayerSummary | null {
        for (let team of game.teams) {
            for (let player of team.players) {
                if (player.userId === store.getState().session.data.userInfo.userId) {
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