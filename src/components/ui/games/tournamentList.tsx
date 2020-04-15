import Link from "next/link";
import * as React from "react";
import { Table } from "react-bootstrap";
import { TournamentSummary } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { HumanDate } from "../humanDate";

interface ITournamentListProps {
    tournaments: TournamentSummary[];
}

export class TournamentList extends React.Component<
    ITournamentListProps,
    null
> {
    public render() {
        const rows = this.props.tournaments.map((tournament) =>
            this._renderTournamentRow(tournament)
        );

        return (
            <Table className="tournament-list">
                <thead>{this._renderHeader()}</thead>
                <tbody>{rows}</tbody>
            </Table>
        );
    }

    private _renderHeader() {
        return (
            <tr>
                <th>{__("Name")}</th>
                <th className="hidden-xs">{__("Teams/Players")}</th>
                <th className="hidden-xs">{__("Group Phase")}</th>
                <th className="hidden-xs">{__("Start Registration")}</th>
                <th className="hidden-xs">{__("Start Tournament")}</th>
            </tr>
        );
    }

    private _renderTournamentRow(tournament: TournamentSummary): JSX.Element {
        let groupPhase = __("Yes");
        if (tournament.numberOfGroupGames === 0) {
            groupPhase = __("No");
        }

        return (
            <tr key={tournament.id}>
                <td>
                    <Link
                        as={`/game/tournaments/${tournament.id}`}
                        href="/game/tournaments/[tournamentId].tsx"
                    >
                        {tournament.name}
                    </Link>
                </td>
                <td className="hidden-xs">
                    {tournament.numberOfTeams} /{" "}
                    {tournament.options.numberOfPlayersPerTeam}
                </td>
                <td className="hidden-xs">{groupPhase}</td>
                <td className="hidden-xs">
                    {HumanDate(tournament.startOfRegistration)}
                </td>
                <td className="hidden-xs">
                    {HumanDate(tournament.startOfTournament)}
                </td>
            </tr>
        );
    }
}
