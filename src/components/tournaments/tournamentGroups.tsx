import * as React from "react";
import { Table } from "react-bootstrap";
import {
    Tournament,
    TournamentGroup,
    TournamentPairing,
} from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { css } from "../../lib/utils/css";
import { GridColumn } from "../layout/index";
import style from "./tournamentGroups.module.scss";

export interface ITournamentGroupProps {
    tournament: Tournament;

    navigateToPairing(id: string): void;
}

export class TournamentGroups extends React.Component<ITournamentGroupProps> {
    public render() {
        const { tournament } = this.props;

        return (
            <div className={style.tournamentGroups}>
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

                    <div className="groupStandings vertical-box-content">
                        <ol>
                            {teams.map((team) => (
                                <li
                                    key={team.id}
                                    value={team.groupOrder}
                                    className={css({
                                        [style.tournamentTeamCutoff]:
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
                        <Table className={style.groupTable} striped={true}>
                            <tbody>
                                {pairings.map((p) => (
                                    <tr
                                        className={style.groupPairingRows}
                                        key={p.order}
                                        onClick={() => navigateToPairing(p.id)}
                                    >
                                        <td className={style.groupTableTeam}>
                                            <div
                                                className={css(
                                                    style.groupTableTeamWrapper,
                                                    style.textRight
                                                )}
                                            >
                                                <div
                                                    className={
                                                        style.groupTableTeamName
                                                    }
                                                    title={p.teamA.name}
                                                >
                                                    {p.teamA.name}
                                                </div>
                                                {this._renderLabel(p, true)}
                                            </div>
                                        </td>
                                        <td className={style.groupTableCount}>
                                            <span
                                                className={css(
                                                    "label",
                                                    "label-info"
                                                )}
                                            >
                                                {p.numberOfGames -
                                                    (p.teamAWon + p.teamBWon)}
                                            </span>
                                        </td>
                                        <td className={style.groupTableTeam}>
                                            <div
                                                className={css(
                                                    style.groupTableTeamWrapper,
                                                    style.textLeft
                                                )}
                                            >
                                                {this._renderLabel(p, false)}
                                                <div
                                                    className={
                                                        style.groupTableTeamName
                                                    }
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
                className={css(style.label, "label", {
                    "label-default": won < p.numberOfGames / 2,
                    "label-success": won >= p.numberOfGames / 2,
                })}
            >
                {won}
            </div>
        );
    }
}
