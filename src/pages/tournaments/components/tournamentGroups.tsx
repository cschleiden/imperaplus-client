import * as React from "react";
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

        return <GridColumn className="col-xs-4 vertical-box" key={group.id}>
            <h3>{`${__("Group")} ${index + 1}`}</h3>

            <div className="group-standings">
                <ol>
                    {teams.map(team =>
                        <li key={team.id} value={team.groupOrder + 1} className={css({
                            "tournament-teams-cutoff": (team.groupOrder + 1) === 2 // first two teams proceed
                        })}>
                            {team.name}
                        </li>)}
                </ol>
            </div>

            <div className="group-pairings">
                <ul className="list-unstyled">
                    {pairings.map(p =>
                        <li key={p.order}>
                            {p.teamA.name} {__("vs")} {p.teamB.name}
                        </li>
                    )}
                </ul>
            </div>
        </GridColumn>;
    }
}