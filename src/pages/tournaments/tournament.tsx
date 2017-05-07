
import * as React from "react";

import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { HumanDate, HumanTime } from "../../components/ui/humanDate";
import { Section, Title } from "../../components/ui/typography";
import { Tournament, TournamentState, TournamentSummary } from "../../external/imperaClients";

import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";
import { TournamentBracket } from "./components/tournamentBracket";
import { load } from "./tournaments.actions";

const t2: any = { "teams": [{ "participants": [{ "id": "95faa3db-9e2f-4e22-8d84-69db15d1fd4a", "name": "hunter2710" }], "id": "d7b5b7c9-946b-4ddc-9d92-0304b4b608d7", "name": "hunter2710", "groupOrder": 0, "state": "Active" }, { "participants": [{ "id": "18886efb-b178-43d2-b0d3-7238a08d08eb", "name": "trouble" }], "id": "2df27b8b-339c-4251-9c4e-3bf673fb050f", "name": "trouble", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "2e786599-be83-497d-ab53-2accee52fbd1", "name": "digitald" }], "id": "32fa52d2-8203-4b6b-a209-4a90b9fa8e30", "name": "digitald", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "69a9f338-a4af-4653-ab83-55adc85af7fd", "name": "genosse27" }], "id": "b4282453-36ed-426f-a23e-51d543f69a5f", "name": "genosse27", "groupOrder": 0, "state": "Active" }, { "participants": [{ "id": "a8f660e9-cab7-4c57-ad3d-a7ab14dd07cb", "name": "Achtung" }], "id": "3e45f127-94f4-4902-9453-62475075d9e6", "name": "Achtung", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "ca9a7beb-77a1-46e2-96f3-23a42b040013", "name": "greybanana" }], "id": "d95172d4-4732-4339-a89b-6b56588bd87e", "name": "greybanana", "groupOrder": 0, "state": "Active" }, { "participants": [{ "id": "b076bcd1-26a6-48b1-874b-80ee3632893f", "name": "milo" }], "id": "24508bcd-553b-41e6-9864-a897e9e70299", "name": "milo", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "21c406cb-70ef-4130-8589-097d76e3acec", "name": "onomaeus" }], "id": "ec763368-f193-4946-8f80-abd60aa30ef6", "name": "onomaeus", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "8342e27f-a6aa-4c3a-8cfa-095f23c608ec", "name": "sunseeker" }], "id": "7d8cbd8d-1a47-46f9-8871-b5efeec7529c", "name": "sunseeker", "groupOrder": 0, "state": "Active" }, { "participants": [{ "id": "559593b0-2547-46ea-b1d6-0da8b4e74e52", "name": "beleroform" }], "id": "7534ff62-400e-4ca5-874e-bca7f043ca91", "name": "beleroform", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "957a229c-2cea-4d98-9531-be3121931c9b", "name": "castros" }], "id": "b02ac4e3-1ec2-486a-8fa1-c4e887e4f1ae", "name": "castros", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "8b9cc0e0-9649-429f-b136-c3ca297b4216", "name": "Taiga" }], "id": "035c52e9-81fe-4707-968c-c877a58924ef", "name": "Taiga", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "b6e26160-862d-44af-ace4-dc8a4006a0cb", "name": "Caesarius" }], "id": "01832bb9-ca2d-4702-a845-d1acdbb31597", "name": "Caesarius", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "980279e4-b5c7-4ae8-928c-264686ccc6c4", "name": "jean lafitte" }], "id": "ff288f50-1cc9-4c20-9593-f80a5e094ee9", "name": "jean lafitte", "groupOrder": 0, "state": "InActive" }, { "participants": [{ "id": "213740a8-be28-41bb-ad8c-7cdc25d0c0bb", "name": "zini" }], "id": "759325f9-9507-474a-a726-f8a36d5b6b54", "name": "zini", "groupOrder": 0, "state": "Active" }, { "participants": [{ "id": "cd1a75d4-af12-4ebf-b4c0-dbe60a3b144c", "name": "kruemli" }], "id": "b109aab0-f4c3-46f8-a845-fc929ab20d4c", "name": "kruemli", "groupOrder": 0, "state": "InActive" }], "groups": [], "pairings": [{ "teamA": { "id": "d95172d4-4732-4339-a89b-6b56588bd87e", "name": "greybanana fasd fasd fasd fasdf asdf sdaf sd fsdf ", "groupOrder": 0, "state": "Active" }, "teamB": { "id": "24508bcd-553b-41e6-9864-a897e9e70299", "name": "milo", "groupOrder": 0, "state": "InActive" }, "teamAWon": 3, "teamBWon": 0, "numberOfGames": 5, "phase": 1, "order": 1 }, { "teamA": { "id": "759325f9-9507-474a-a726-f8a36d5b6b54", "name": "zini", "groupOrder": 0, "state": "Active" }, "teamB": { "id": "b109aab0-f4c3-46f8-a845-fc929ab20d4c", "name": "kruemli", "groupOrder": 0, "state": "InActive" }, "teamAWon": 3, "teamBWon": 0, "numberOfGames": 5, "phase": 0, "order": 7 }, { "teamA": { "id": "32fa52d2-8203-4b6b-a209-4a90b9fa8e30", "name": "digitald", "groupOrder": 0, "state": "InActive" }, "teamB": { "id": "b4282453-36ed-426f-a23e-51d543f69a5f", "name": "genosse27", "groupOrder": 0, "state": "Active" }, "teamAWon": 0, "teamBWon": 3, "numberOfGames": 5, "phase": 0, "order": 1 }, { "teamA": { "id": "d7b5b7c9-946b-4ddc-9d92-0304b4b608d7", "name": "hunter2710", "groupOrder": 0, "state": "Active" }, "teamB": { "id": "b4282453-36ed-426f-a23e-51d543f69a5f", "name": "genosse27", "groupOrder": 0, "state": "Active" }, "teamAWon": 1, "teamBWon": 0, "numberOfGames": 5, "phase": 1, "order": 0 }, { "teamA": { "id": "d7b5b7c9-946b-4ddc-9d92-0304b4b608d7", "name": "hunter2710", "groupOrder": 0, "state": "Active" }, "teamB": { "id": "2df27b8b-339c-4251-9c4e-3bf673fb050f", "name": "trouble", "groupOrder": 0, "state": "InActive" }, "teamAWon": 2, "teamBWon": 1, "numberOfGames": 5, "phase": 0, "order": 0 }, { "teamA": { "id": "01832bb9-ca2d-4702-a845-d1acdbb31597", "name": "Caesarius", "groupOrder": 0, "state": "InActive" }, "teamB": { "id": "ff288f50-1cc9-4c20-9593-f80a5e094ee9", "name": "jean lafitte", "groupOrder": 0, "state": "InActive" }, "teamAWon": 0, "teamBWon": 3, "numberOfGames": 5, "phase": 0, "order": 6 }, { "teamA": { "id": "3e45f127-94f4-4902-9453-62475075d9e6", "name": "Achtung", "groupOrder": 0, "state": "InActive" }, "teamB": { "id": "d95172d4-4732-4339-a89b-6b56588bd87e", "name": "greybanana", "groupOrder": 0, "state": "Active" }, "teamAWon": 0, "teamBWon": 3, "numberOfGames": 5, "phase": 0, "order": 2 }, { "teamA": { "id": "7d8cbd8d-1a47-46f9-8871-b5efeec7529c", "name": "sunseeker", "groupOrder": 0, "state": "Active" }, "teamB": { "id": "035c52e9-81fe-4707-968c-c877a58924ef", "name": "Taiga", "groupOrder": 0, "state": "InActive" }, "teamAWon": 2, "teamBWon": 1, "numberOfGames": 5, "phase": 1, "order": 2 }, { "teamA": { "id": "ff288f50-1cc9-4c20-9593-f80a5e094ee9", "name": "jean lafitte", "groupOrder": 0, "state": "InActive" }, "teamB": { "id": "759325f9-9507-474a-a726-f8a36d5b6b54", "name": "zini", "groupOrder": 0, "state": "Active" }, "teamAWon": 0, "teamBWon": 3, "numberOfGames": 5, "phase": 1, "order": 3 }, { "teamA": { "id": "24508bcd-553b-41e6-9864-a897e9e70299", "name": "milo", "groupOrder": 0, "state": "InActive" }, "teamB": { "id": "ec763368-f193-4946-8f80-abd60aa30ef6", "name": "onomaeus", "groupOrder": 0, "state": "InActive" }, "teamAWon": 3, "teamBWon": 0, "numberOfGames": 5, "phase": 0, "order": 3 }, { "teamA": { "id": "b02ac4e3-1ec2-486a-8fa1-c4e887e4f1ae", "name": "castros", "groupOrder": 0, "state": "InActive" }, "teamB": { "id": "035c52e9-81fe-4707-968c-c877a58924ef", "name": "Taiga", "groupOrder": 0, "state": "InActive" }, "teamAWon": 0, "teamBWon": 3, "numberOfGames": 5, "phase": 0, "order": 5 }, { "teamA": { "id": "7d8cbd8d-1a47-46f9-8871-b5efeec7529c", "name": "sunseeker", "groupOrder": 0, "state": "Active" }, "teamB": { "id": "7534ff62-400e-4ca5-874e-bca7f043ca91", "name": "beleroform", "groupOrder": 0, "state": "InActive" }, "teamAWon": 2, "teamBWon": 1, "numberOfGames": 5, "phase": 0, "order": 4 }], "mapTemplates": ["Rom"], "winner": null, "phase": 1, "id": "e715df8f-ffa8-4b86-9893-9c6f6b467e72", "name": "Testturnier 1.0", "state": "Knockout", "options": { "numberOfPlayersPerTeam": 1, "numberOfTeams": 2, "minUnitsPerCountry": 1, "newUnitsPerTurn": 3, "attacksPerTurn": 3, "movesPerTurn": 3, "initialCountryUnits": 5, "mapDistribution": "Malibu", "timeoutInSeconds": 172800, "maximumTimeoutsPerPlayer": 2, "maximumNumberOfCards": 5, "victoryConditions": ["Survival"], "visibilityModifier": ["Fog"] }, "numberOfTeams": 16, "numberOfGroupGames": 0, "numberOfKnockoutGames": 5, "numberOfFinalGames": 7, "startOfRegistration": "2017-03-28T18:00:00Z", "startOfTournament": "2017-03-30T16:00:07.307Z", "endOfTournament": "0001-01-01T00:00:00Z", "completion": 0 };

export interface ITournamentProps {
    params: {
        id: string;
    };

    load: (tournamentId: string) => void;

    tournament: Tournament;
}

export class TournamentComponent extends React.Component<ITournamentProps, void> {
    public componentDidMount() {
        const { params, tournament, load } = this.props;

        if (params && params.id) {
            load(params.id);
        }

        if (tournament) {
            setDocumentTitle(__("Tournament") + ": " + tournament.name);
        }
    }

    public render(): JSX.Element {
        const { tournament } = this.props;

        if (!tournament) {
            return <div>Loading</div>;
        }

        return <GridColumn className="col-xs-12">
            <Title>{tournament.name}</Title>
            <div className="tournament">
                <div>
                    <h3><span>{__("Information")}</span></h3>
                </div>

                <div className="row">
                    <div className="col-md-5 col-md-offset-1">
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
                    </div>

                    <div className="col-md-6">
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
                    </div>
                </div>

                <h3>{__("Participants")}</h3>

                <div>
                    <ul className="list-unstyled">
                        <li type="team">
                            <ul>
                                <li type="participant">
                                    <span className="user" ref="participant">{ /* player */}</span>
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
                    <div className="tournament-bracket">
                        <TournamentBracket tournament={t2} />
                    </div>
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
    const tournament = state.tournaments.data.tournament;

    return {
        tournament: tournament && ownProps.params.id === tournament.id && tournament
    };
}, (dispatch) => ({
    load: (tournamentId: string) => dispatch(load(tournamentId))
}))(TournamentComponent);
