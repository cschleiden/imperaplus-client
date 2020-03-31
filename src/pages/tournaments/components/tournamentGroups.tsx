import * as React from "react";
import { Table } from "react-bootstrap";
import { GridColumn } from "../../../components/layout/index";
import {
    Tournament,
    TournamentGroup,
    TournamentPairing,
} from "../../../external/imperaClients";
import { css } from "../../../lib/css";
import "./tournamentGroups.scss";

export interface ITournamentGroupProps {
    tournament: Tournament;

    navigateToPairing(id: string): void;
}

export class TournamentGroups extends React.Component<ITournamentGroupProps> {
    public render() {
        const { tournament } = this.props;

        return (
            <div className="tournament-groups">
                {tournament.groups.map((group, index) =>
                    this._renderGroup(group, index)
                )}
            </div>
        );
    }

    private _renderGroup(group: TournamentGroup, index: number) {
        const { tournament, navigateToPairing } = this.props;

        const teams = group.teams.slice(0);
        teams.sort((a, b) => a.groupOrder - b.groupOrder);

        const teamIds: { [id: string]: boolean } = {};
        for (const team of teams) {
            teamIds[team.id] = true;
        }

        const pairings = tournament.pairings.filter((p) => {
            const pairingContainsCurrentTeams =
                teamIds[p.teamA.id] || teamIds[p.teamB.id];
            const isGroupPairing = p.phase === 0;

            return pairingContainsCurrentTeams && isGroupPairing;
        });
        pairings.sort((a, b) => a.order - b.order);

        return (
            <GridColumn className="col-sm-6 col-md-4" key={group.id}>
                <div className="vertical-box">
                    <h4 className="vertical-box-header">
                        {`${__("Group")} ${index + 1}`}
                    </h4>

                    <div className="group-standings vertical-box-content">
                        <ol>
                            {teams.map((team) => (
                                <li
                                    key={team.id}
                                    value={team.groupOrder}
                                    className={css({
                                        "tournament-teams-cutoff":
                                            team.groupOrder === 2, // first two teams proceed
                                    })}
                                >
                                    {team.name}
                                </li>
                            ))}
                        </ol>
                    </div>

                    <h5 className="vertical-box-header">{__("Pairings")}</h5>

                    <div className="group-pairings vertical-box-content">
                        <Table className="group-table" striped={true}>
                            <tbody>
                                {pairings.map((p) => (
                                    <tr
                                        className="group-pairing-rows"
                                        key={p.order}
                                        onClick={() => navigateToPairing(p.id)}
                                    >
                                        <td className="group-table--team">
                                            <div className="group-table--team-wrapper text-right">
                                                <div
                                                    className="group-table--team-name"
                                                    title={p.teamA.name}
                                                >
                                                    {p.teamA.name}
                                                </div>
                                                {this._renderLabel(p, true)}
                                            </div>
                                        </td>
                                        <td className="group-table--count">
                                            <span className="label label-info">
                                                {p.numberOfGames -
                                                    (p.teamAWon + p.teamBWon)}
                                            </span>
                                        </td>
                                        <td className="group-table--team">
                                            <div className="group-table--team-wrapper text-left">
                                                {this._renderLabel(p, false)}
                                                <div
                                                    className="group-table--team-name"
                                                    title={p.teamB.name}
                                                >
                                                    {p.teamB.name}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </GridColumn>
        );
    }

    private _renderLabel(p: TournamentPairing, isTeamA: boolean) {
        const won = isTeamA ? p.teamAWon : p.teamBWon;

        return (
            <div
                className={css("label", {
                    "label-default": won < p.numberOfGames / 2,
                    "label-success": won >= p.numberOfGames / 2,
                })}
            >
                {won}
            </div>
        );
    }
}
