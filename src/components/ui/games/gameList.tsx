import * as React from "react";

import "./gameList.scss";

import { GameSummary } from "../../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../../components/layout";
import HumanDate from "../humanDate";
import { Title, Section } from "../typography";
import { GameDetails } from "./gameDetail";

import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";

interface IGameListProps {
    games: GameSummary[];
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

        return <Table>
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
            <th>{__("Map")}</th>
            <th>{__("Mode")}</th>
            <th>{__("Active")}</th>
            <th>{__("Teams/Players")}</th>
            <th>{__("Time")}</th>
            <th>{__("State")}</th>
            <th>&nbsp;</th>
        </tr>;
    }

    private _renderGameRow(game: GameSummary): JSX.Element {
        return <tr>
            <td>{game.id}</td>
            <td>{game.name}</td>
            <td>{game.mapTemplate}</td>
            <td>{game.options.mapDistribution}</td>
            <td>{game.currentPlayer && game.currentPlayer.name}</td>
            <td>{`${game.options.numberOfTeams}/${game.options.numberOfPlayersPerTeam}`}</td>
            <td>{game.timeoutSecondsLeft}</td>
            <td>{game.state}</td>
            <td>
                <Button
                    title={__("Show details")}
                    onClick={() => this._toggle(game.id)}></Button>
            </td>
        </tr>;
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