import * as React from "react";
import { Table } from "react-bootstrap";
import { GridColumn } from "../../../components/layout/index";
import { Tournament, TournamentGroup, TournamentPairing } from "../../../external/imperaClients";
import { css } from "../../../lib/css";
import "./tournamentGroups.scss";

export interface ITournamentGroupProps {
    tournament: Tournament;
}

export class TournamentGroups extends React.Component<ITournamentGroupProps, void> {
    public render() {
        const { tournament } = this.props;



        return <div>
            {tournament.groups.map((group, index) => this._renderGroup(group, index))}
        </div>;
    }

    private _renderGroup(group: TournamentGroup, index: number) {
        const { tournament } = this.props;

        const teams = group.teams.slice(0);
        teams.sort((a, b) => a.groupOrder - b.groupOrder);

        const teamIds: { [id: string]: boolean } = {};
        for (const team of teams) {
            teamIds[team.id] = true;
        }

        const pairings = tournament.pairings.filter(p => {
            return teamIds[p.teamA.id] || teamIds[p.teamB.id];
        });
        pairings.sort((a, b) => a.order - b.order);

        return <GridColumn className="col-sm-6 col-md-4" key={group.id}>
            <div className="vertical-box">
                <h4 className="vertical-box-header">
                    {`${__("Group")} ${index + 1}`}
                </h4>

                <div className="group-standings vertical-box-content">
                    <ol>
                        {teams.map(team =>
                            <li key={team.id} value={team.groupOrder + 1} className={css({
                                "tournament-teams-cutoff": (team.groupOrder + 1) === 2 // first two teams proceed
                            })}>
                                {team.name}
                            </li>)}
                    </ol>
                </div>

                <h5 className="vertical-box-header">
                    {__("Pairings")}
                </h5>

                <div className="group-pairings vertical-box-content">
                    <Table className="group-table" striped>
                        {pairings.map(p =>
                            <tr key={p.order}>
                                <td className="text-right">
                                    {p.teamA.name}
                                    <span className={css("badge label", {
                                        "label-success": p.teamAWon >= tournament.numberOfGroupGames / 2
                                    })}> {p.teamAWon}</span>
                                </td>
                                <td className="text-center">
                                    <span className="label label-info">{tournament.numberOfGroupGames}</span>
                                </td>
                                <td>
                                    <span className={css("badge label", {
                                        "label-success": p.teamBWon >= tournament.numberOfGroupGames / 2
                                    })}> {p.teamBWon}</span>
                                    {p.teamB.name}
                                </td>
                            </tr>
                        )}
                    </Table>
                </div>
            </div>
        </GridColumn>;
    }
}