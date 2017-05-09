import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { setTitle } from "../../common/general/general.actions";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { HumanDate, HumanTime } from "../../components/ui/humanDate";
import { Loading } from "../../components/ui/loading";
import { ProgressButton, SimpleProgressButton } from "../../components/ui/progressButton";
import { Section, Title } from "../../components/ui/typography";
import { Tournament, TournamentState, TournamentSummary, UserReference } from "../../external/imperaClients";
import { autobind } from "../../lib/autobind";
import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";
import { TournamentBracket } from "./components/tournamentBracket";
import { join, leave, load } from "./tournaments.actions";

export interface ITournamentProps {
    params: {
        id: string;
    };

    load: (tournamentId: string) => void;
    setTitle: (title: string) => void;

    join: (tournamentId: string) => void;
    leave: (tournamentId: string) => void;

    createTeam: (tournamentId: string, teamName: string, password?: string) => void;
    joinTeam: (tournamentId: string, teamId: string, password?: string) => void;
    deleteTeam: (tournamentId: string, teamId: string) => void;

    tournament: Tournament;
    userId: string;
}

export class TournamentComponent extends React.Component<ITournamentProps, void> {
    public componentDidMount() {
        const { params, tournament, load } = this.props;

        if (params && params.id) {
            load(params.id);
        }
    }

    public componentDidUpdate() {
        const { tournament, setTitle } = this.props;

        if (tournament) {
            setTitle(__("Tournament") + ": " + tournament.name);
        }
    }

    public render(): JSX.Element {
        const { tournament, userId } = this.props;

        if (!tournament) {
            return <Loading />;
        }

        const currentUserIsRegistered = tournament.teams.some(t => t.participants.some(p => p.id === userId));

        return <GridColumn className="col-xs-12">
            <div className="tournament">
                <GridRow>
                    <GridColumn className="col-md-5 col-md-offset-1">
                        <dl className="dl-horizontal clearfix">
                            <dt><span>{__("Start of registration")}</span></dt>
                            <dd>{HumanDate(tournament.startOfRegistration)}</dd>

                            <dt><span>{__("Start of tournament")}</span></dt>
                            <dd>{HumanDate(tournament.startOfTournament)}</dd>

                            <dt><span>{__("Number of teams")}</span></dt>
                            <dd>{tournament.numberOfTeams}</dd>

                            <dt><span>{__("Players per Team")}</span></dt>
                            <dd>{tournament.options.numberOfPlayersPerTeam}</dd>

                            <dt><span>{__("Games in group phase")}</span></dt>
                            <dd>{tournament.numberOfGroupGames}</dd>

                            <dt><span>{__("Games in knockout phase")}</span></dt>
                            <dd>{tournament.numberOfKnockoutGames}</dd>

                            <dt><span>{__("Games in final")}</span></dt>
                            <dd>{tournament.numberOfFinalGames}</dd>

                            <dt><span>{__("Maps")}</span></dt>
                            <dd>
                                {tournament.mapTemplates.join(", ")}
                            </dd>
                        </dl>
                    </GridColumn>

                    <GridColumn className="col-md-6">
                        <dl className="dl-horizontal">
                            <dt><span>{__("Timeout")}</span></dt>
                            <dd>
                                {HumanTime(tournament.options.timeoutInSeconds)}
                            </dd>

                            <dt><span>{__("Mode")}</span></dt>
                            <dd>
                                {tournament.options.mapDistribution}
                            </dd>

                            <dt><span><span>{__("Attacks")}</span></span> / <span><span>{__("Moves")}</span></span></dt>
                            <dd>
                                {tournament.options.attacksPerTurn} / {tournament.options.movesPerTurn}
                            </dd>

                            <dt><span><span>{__("Victory Conditions")}</span></span></dt>
                            <dd>
                                {tournament.options.victoryConditions}
                            </dd>

                            <dt><span><span>{__("Visibility Modifier")}</span></span></dt>
                            <dd>
                                {tournament.options.visibilityModifier}
                            </dd>

                            <dt><span>{__("Initial units per country")}</span></dt>
                            <dd>
                                {tournament.options.initialCountryUnits}
                            </dd>

                            <dt><span>{__("Max timeouts")}</span></dt>
                            <dd>
                                {tournament.options.maximumTimeoutsPerPlayer}
                            </dd>

                            <dt><span>{__("Max cards")}</span></dt>
                            <dd>
                                {tournament.options.maximumNumberOfCards}
                            </dd>

                            <dt><span>{__("New units per turn")}</span></dt>
                            <dd>
                                {tournament.options.newUnitsPerTurn}
                            </dd>
                        </dl>
                    </GridColumn>
                </GridRow>

                {
                    tournament.state === TournamentState.Open && tournament.startOfRegistration <= new Date() &&
                    <GridRow>
                        <Section>{__("Registration")}</Section>

                        {
                            !currentUserIsRegistered &&
                            <div>
                                <SimpleProgressButton onClick={this._join}>{__("Join tournament")}</SimpleProgressButton>
                            </div>
                        }

                        {
                            currentUserIsRegistered &&
                            <div>
                                <SimpleProgressButton onClick={this._leave}>{__("Leave tournament")}</SimpleProgressButton>
                            </div>
                        }
                    </GridRow>
                }

                <GridRow>
                    <Section>{__("Participants")}</Section>
                    <ul className="list-unstyled">
                        {
                            tournament.teams.map(team =>
                                <li className="team" key={team.id}>
                                    <ul>
                                        {
                                            team.participants.map(p => <li className="participant">
                                                <span className="user" key={p.id}>
                                                    {p.name}
                                                </span>
                                            </li>)
                                        }
                                    </ul>
                                </li>)
                        }
                    </ul>
                </GridRow>

                {
                    tournament.phase >= TournamentState.Groups
                    && <div>
                        <Section><span>{__("Group Phase")}</span></Section>
                        <div className="tournament-bracket"></div>
                    </div>
                }

                {
                    tournament.phase >= TournamentState.Knockout
                    && <div>
                        <Section><span>{__("Knockout Phase")}</span></Section>
                        <div className="tournament-bracket">
                            <TournamentBracket tournament={tournament} />
                        </div>
                    </div>
                }


                {
                    tournament.phase >= TournamentState.Knockout
                    && <div>
                        <Section><span>{__("Winner")}</span></Section>
                        <div>
                            {tournament.winner && tournament.winner.name}
                        </div>
                    </div>
                }
            </div>
        </GridColumn>;
    }

    @autobind
    private _join() {
        const { tournament } = this.props;

        this.props.join(tournament.id);
    }

    @autobind
    private _leave() {
        const { tournament, userId } = this.props;

        const userTeam = tournament.teams.find(x => x.participants.some(p => p.id === userId));
        if (userTeam) {
            if (userTeam.participants.length === 1) {
                // User is last user in team, delete team
                this.props.deleteTeam(tournament.id, userTeam.id);
            } else {
                // Just leave team
                this.props.leave(tournament.id);
            }
        }
    }
}

export default connect((state: IState, ownProps: ITournamentProps) => {
    const tournament = state.tournaments.data.tournament;

    return {
        tournament: tournament && ownProps.params.id === tournament.id && tournament,
        userId: state.session.data.userInfo.userId
    };
}, (dispatch) => ({
    load: (tournamentId: string) => dispatch(load(tournamentId)),
    setTitle: (title: string) => { dispatch(setTitle(title)); },
    join: (tournamentId: string) => { dispatch(join(tournamentId)) },
    leave: (tournamentId: string) => { dispatch(leave(tournamentId)) },
    createTeam: (tournamentId: string, teamName: string) => { },
    joinTeam: (tournamentId: string, teamId: string) => { },
    deleteTeam: (tournamentId: string, teamId: string) => { }
}))(TournamentComponent);
