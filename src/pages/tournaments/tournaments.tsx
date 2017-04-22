import * as React from "react";

import { connect } from "react-redux";
import { TournamentSummary, TournamentState} from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { HumanDate, HumanTime} from "../../components/ui/humanDate";
import { Title, Section } from "../../components/ui/typography";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";

export interface ITournamentProps {
    params: { id: string; };
    tournament: TournamentSummary;
}

export class TournamentComponent extends React.Component<ITournamentProps, void> {
    public componentDidMount() {
        setDocumentTitle(__("Tournament") + ": " + this.props.tournament.name);
    }

    public render(): JSX.Element {

        return <GridColumn className="col-xs-12">
            <Title>{__("Tournament") + this.props.tournament.name}</Title>
            <div className="container tournament">
                <div>
                    <h3><span>{__("Information")}</span></h3>

                </div>

                <div className="row">
                    <div className="col-md-5 col-md-offset-1">
                        <dl className="dl-horizontal clearfix">
                            <dt><span>{__("Start of registration")}</span></dt>
                            <dd>{HumanDate(this.props.tournament.startOfRegistration)}</dd>

                            <dt><span>{__("Start of tournament")}</span></dt>
                            <dd>{HumanDate(this.props.tournament.startOfTournament)}</dd>

                            <dt><span>{__("Number of teams")}</span></dt>
                            <dd>{this.props.tournament.numberOfTeams}</dd>

                            <dt><span>{__("Players per Team")}</span></dt>
                            <dd>{this.props.tournament.options.numberOfPlayersPerTeam}</dd>

                            <dt><span>{__("Games in group phase")}</span></dt>
                            <dd>{this.props.tournament.numberOfGroupGames}</dd>

                            <dt><span>{__("Games in knockout phase")}</span></dt>
                            <dd>{this.props.tournament.numberOfKnockoutGames}</dd>

                            <dt><span>{__("Games in final")}</span></dt>
                            <dd>{this.props.tournament.numberOfFinalGames}</dd>

                            <dt><span>{__("Maps")}</span></dt>
                            <dd>
                                {/* not in array */ __("random")}
                            </dd>
                        </dl>
                    </div>

                    <div className="col-md-6">
                        <dl className="dl-horizontal">
                            <dt><span>{__("Timeout")}</span></dt>
                            <dd>
                                {HumanTime(this.props.tournament.options.timeoutInSeconds)}
                            </dd>

                            <dt><span>{__("Mode")}</span></dt>
                            <dd>
                                {this.props.tournament.options.mapDistribution}
                            </dd>

                            <dt><span><span>{__("Attacks")}</span></span> / <span><span>{__("Moves")}</span></span></dt>
                            <dd>
                                {this.props.tournament.options.attacksPerTurn} / {this.props.tournament.options.movesPerTurn}
                            </dd>

                            <dt><span><span>{__("Victory Conditions")}</span></span></dt>
                            <dd>
                                {this.props.tournament.options.victoryConditions}
                            </dd>

                            <dt><span><span>{__("Visibility Modifier")}</span></span></dt>
                            <dd>
                                {this.props.tournament.options.visibilityModifier}
                            </dd>

                            <dt><span>{__("Initial units per country")}</span></dt>
                            <dd>
                                {this.props.tournament.options.initialCountryUnits}
                            </dd>

                            <dt><span>{__("Max timeouts")}</span></dt>
                            <dd>
                                {this.props.tournament.options.maximumTimeoutsPerPlayer}
                            </dd>

                            <dt><span>{__("Max cards")}</span></dt>
                            <dd>
                                {this.props.tournament.options.maximumNumberOfCards}
                            </dd>

                            <dt><span>{__("New units per turn")}</span></dt>
                            <dd>
                                {this.props.tournament.options.newUnitsPerTurn}
                            </dd>
                        </dl>
                    </div>
                </div>

                <h3>{__("Participants")}</h3>

                <div>
                    <ul className="list-unstyled">
                       <li type="team">
                            <ul>
                                <li type="participant">
                                    <span className="user" ref="participant">{ /* player */ }</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3><span>{__("Group Phase")}</span></h3>
                    <div className="tournament-bracket"></div>
                </div>

                <div>
                    <h3><span>{__("Knockout Phase")}</span></h3>
                    <div className="tournament-bracket"></div>
                </div>

                <div>
                    <h3><span>{__("Winner")}</span></h3>
                    <div className="tournament-bracket"></div>
                </div>
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState, ownProps: ITournamentProps) => {
    return {tournament: state.tournaments.data.tournaments[ownProps.params.id]};
}, (dispatch) => ({
}))(TournamentComponent);
