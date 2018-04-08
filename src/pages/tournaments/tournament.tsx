import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Form from "../../common/forms/form";
import { ControlledCheckBox, ControlledDropdown, ControlledTextField } from "../../common/forms/inputs";
import { setTitle } from "../../common/general/general.actions";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { HumanDate, HumanTime } from "../../components/ui/humanDate";
import { Loading } from "../../components/ui/loading";
import { ProgressButton, SimpleProgressButton } from "../../components/ui/progressButton";
import { Section, SubSection, Title } from "../../components/ui/typography";
import { Tournament, TournamentState, TournamentSummary, TournamentTeamState, UserReference } from "../../external/imperaClients";
import { autobind } from "../../lib/autobind";
import { css } from "../../lib/css";
import { IState } from "../../reducers";
import { TournamentBracket } from "./components/tournamentBracket";
import { TournamentGroups } from "./components/tournamentGroups";
import "./tournament.scss";
import { createTeam, deleteTeam, join, joinTeam, leave, load } from "./tournaments.actions";

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
    navigateToPairing: (id: string) => void;

    tournament: Tournament;
    userId: string;
}

export class TournamentComponent extends React.Component<ITournamentProps> {
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

        const isGroupTournament = tournament.numberOfGroupGames > 0;

        return (
            <GridColumn className="col-xs-12">
                <div className="tournament">
                    <GridRow>
                        <GridColumn className="col-xs-12">
                            <Title>{tournament.name}</Title>
                        </GridColumn>
                    </GridRow>

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

                    {this._renderRegistration()}

                    {this._renderParticipants()}

                    {
                        isGroupTournament && (tournament.state !== TournamentState.Open)
                        && <GridRow>
                            <Section>{__("Group Phase")}</Section>
                            <TournamentGroups tournament={tournament} navigateToPairing={this._navigateToPairing} />
                        </GridRow>
                    }

                    {
                        (tournament.state === TournamentState.Knockout || tournament.state === TournamentState.Closed)
                        && <GridRow>
                            <Section>{__("Knockout Phase")}</Section>
                            <div className="tournament-bracket">
                                <TournamentBracket tournament={tournament} navigateToPairing={this._navigateToPairing} />
                            </div>
                        </GridRow>
                    }

                    {
                        tournament.state === TournamentState.Closed
                        && <GridRow>
                            <Section>{__("Winner")}</Section>
                            <div>
                                {tournament.winner && tournament.winner.name}
                            </div>
                        </GridRow>
                    }
                </div>
            </GridColumn>
        );
    }

    private _renderRegistration() {
        const { tournament, userId } = this.props;

        const registrationOpen = tournament.state === TournamentState.Open && tournament.startOfRegistration <= new Date();

        const currentUserTeam = tournament.teams.find(t => t.participants.some(p => p.id === userId));
        const currentUserIsRegistered = !!currentUserTeam;
        const isTeamTournament = tournament.options.numberOfPlayersPerTeam > 1;
        const canCreateTeam = isTeamTournament && tournament.teams.length < tournament.numberOfTeams;
        const canLeaveTeam = isTeamTournament && currentUserIsRegistered && currentUserTeam.createdById !== userId;
        const canDeleteTeam = isTeamTournament && currentUserIsRegistered && currentUserTeam.createdById === userId;
        const teamsToJoinAvailable = isTeamTournament
            && tournament.teams.some(t => t.participants.length < tournament.options.numberOfPlayersPerTeam);

        return registrationOpen && (
            <GridRow>
                <Section>{__("Registration")}</Section>

                {/* Single */}
                {
                    !isTeamTournament && !currentUserIsRegistered &&
                    <div>
                        <SimpleProgressButton onClick={this._join}>{__("Join tournament")}</SimpleProgressButton>
                    </div>
                }

                {
                    !isTeamTournament && currentUserIsRegistered &&
                    <div>
                        <SimpleProgressButton onClick={this._leave}>{__("Leave tournament")}</SimpleProgressButton>
                    </div>
                }

                {/* Teams */}
                {
                    isTeamTournament && <p>{__("This is a team tournament, you can either create a new team or join an existing one.")}</p>}
                {
                    isTeamTournament && !currentUserIsRegistered && canCreateTeam &&
                    <div>
                        <SubSection>{__("Create Team")}</SubSection>
                        <Form
                            name="tournament-team-create"
                            onSubmit={((formState, options) => {
                                return createTeam({
                                    tournamentId: tournament.id,
                                    teamName: formState.getFieldValue("teamName"),
                                    teamPassword: formState.getFieldValue("teamPassword")
                                }, options);
                            })}
                            component={({ isPending, submit, formState }) => (
                                <div className="form">
                                    <ControlledTextField
                                        label={__("Team Name")}
                                        placeholder={__("Enter name for team")}
                                        fieldName="teamName"
                                        required={true} />
                                    <ControlledTextField
                                        label={__("Password (Optional)")}
                                        fieldName="teamPassword"
                                        required={false} />

                                    <div>
                                        <ProgressButton
                                            type="submit"
                                            disabled={(formState.getFieldValue("teamName") || "").trim() === ""}
                                            isActive={isPending}
                                            bsStyle="primary">
                                            {__("Create")}
                                        </ProgressButton>
                                    </div>
                                </div>)}
                        />
                    </div>
                }

                {
                    isTeamTournament && !currentUserIsRegistered && teamsToJoinAvailable &&
                    <div>
                        <SubSection>{__("Join Team")}</SubSection>
                        <Form
                            name="tournament-team-join"
                            onSubmit={((formState, options) => {
                                return joinTeam({
                                    tournamentId: tournament.id,
                                    teamId: formState.getFieldValue("team"),
                                    teamPassword: formState.getFieldValue("password")
                                }, options);
                            })}
                            component={({ isPending, submit, formState }) => (
                                <div className="form">
                                    <ControlledDropdown
                                        label={__("Team")}
                                        placeholder={__("Select team")}
                                        fieldName="team">
                                        <option key="empty" value="" />
                                        {
                                            tournament.teams
                                                .filter(t => t.participants.length < tournament.options.numberOfPlayersPerTeam)
                                                .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                        }
                                    </ControlledDropdown>
                                    <ControlledTextField
                                        type="password"
                                        label={__("Password (if required)")}
                                        fieldName="password"
                                        required={false} />

                                    <div>
                                        <ProgressButton
                                            type="submit"
                                            disabled={(formState.getFieldValue("team") || "").trim() === ""}
                                            isActive={isPending}
                                            bsStyle="primary">
                                            {__("Join")}
                                        </ProgressButton>
                                    </div>
                                </div>)}
                        />
                    </div>
                }

                {
                    isTeamTournament && currentUserIsRegistered && canLeaveTeam &&
                    <div>
                        <SubSection>{__("Leave team")}</SubSection>
                        <p>{__("You have joined a team, you can leave if you want.")}</p>
                        <SimpleProgressButton onClick={this._leaveTeam}>{__("Leave Team")}</SimpleProgressButton>
                    </div>
                }

                {
                    isTeamTournament && currentUserIsRegistered && canDeleteTeam &&
                    <div>
                        <SubSection>{__("Delete team")}</SubSection>
                        <p>{__("You have created a team for this tournament. To leave, you have to delete it.")}</p>
                        <SimpleProgressButton onClick={this._deleteTeam}>{__("Delete Team")}</SimpleProgressButton>
                    </div>
                }
            </GridRow>
        );
    }

    private _renderParticipants() {
        const { tournament } = this.props;
        const isTeamTournament = tournament.options.numberOfPlayersPerTeam > 1;

        return (
            <GridRow>
                <Section>{__("Teams/Participants")}</Section>
                <ul className="list-unstyled">
                    {
                        tournament.teams.map(team => {
                            const teamHasSlotOpen = team.participants.length < tournament.options.numberOfPlayersPerTeam;

                            return <li
                                className={css("team", {
                                    inactive: team.state === TournamentTeamState.InActive
                                })}
                                key={team.id}
                            >
                                {isTeamTournament && <b>{team.name}</b>}
                                <ul>
                                    {
                                        team.participants.map(p => {
                                            return <li className={css("participant")} key={p.id}>
                                                <span className="user">
                                                    {p.name}
                                                </span>
                                            </li>;
                                        })
                                    }
                                </ul>
                            </li>;
                        })
                    }
                </ul>
            </GridRow>
        );
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

    @autobind
    private _deleteTeam() {
        const { tournament, userId } = this.props;

        const userTeam = tournament.teams.find(x => x.participants.some(p => p.id === userId));
        if (userTeam) {
            this.props.deleteTeam(tournament.id, userTeam.id);
        }
    }

    @autobind
    private _leaveTeam() {
        const { tournament, userId } = this.props;

        const userTeam = tournament.teams.find(x => x.participants.some(p => p.id === userId));
        if (userTeam) {
            this.props.leave(tournament.id);
        }
    }

    @autobind
    private _navigateToPairing(id: string) {
        const { navigateToPairing } = this.props;

        navigateToPairing(id);
    }
}

export default connect((state: IState, ownProps: ITournamentProps) => {
    const tournament = state.tournaments.tournament;
    const userInfo = state.session.userInfo;

    return {
        tournament: tournament && ownProps.params.id === tournament.id && tournament,
        userId: userInfo && userInfo.userId
    };
}, (dispatch) => ({
    load: (tournamentId: string) => { dispatch(load(tournamentId)); },
    setTitle: (title: string) => { dispatch(setTitle(title)); },
    join: (tournamentId: string) => { dispatch(join(tournamentId)); },
    leave: (tournamentId: string) => { dispatch(leave(tournamentId)); },
    joinTeam: (tournamentId: string, teamId: string, teamPassword?: string) => {
        dispatch(joinTeam({
            tournamentId,
            teamId,
            teamPassword
        }));
    },
    deleteTeam: (tournamentId: string, teamId: string) => {
        dispatch(deleteTeam({
            tournamentId, teamId
        }));
    },
    navigateToPairing: (id: string) => {
        dispatch(push(`/game/tournaments/pairings/${id}`));
    }
}))(TournamentComponent);
