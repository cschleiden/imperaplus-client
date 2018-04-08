import * as React from "react";

import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { TournamentList } from "../../components/ui/games/tournamentList";
import { Section, Title } from "../../components/ui/typography";
import { TournamentState, TournamentSummary } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { join, refresh } from "../tournaments/tournaments.actions";

export interface ITournamentGamesProps {
    refresh: () => void;

    openTournaments: TournamentSummary[];
    inProgressTournaments: TournamentSummary[];
    closedTournaments: TournamentSummary[];
}

export class TournamentsComponent extends React.Component<ITournamentGamesProps> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        let open: JSX.Element[];
        let inProgress: JSX.Element[];
        let knockout: JSX.Element[];
        let closed: JSX.Element[];

        if (this.props.openTournaments.length > 0) {
            open = [<Section key="open-title">{__("Open")}</Section>,
            <TournamentList tournaments={this.props.openTournaments} key="open" />];
        }

        if (this.props.inProgressTournaments.length > 0) {
            inProgress = [<Section key="in-progres-title">{__("In Progress")}</Section>,
            <TournamentList tournaments={this.props.inProgressTournaments} key="inprogress" />];
        }

        if (this.props.closedTournaments.length > 0) {
            closed = [<Section key="closed-title">{__("Closed")}</Section>,
            <TournamentList tournaments={this.props.closedTournaments} key="closed" />];
        }

        return (
            <GridColumn className="col-xs-12">
                <div>
                    <div className="pull-right">
                        <ButtonGroup>
                            <Button key="refresh" onClick={this.props.refresh} title={__("Refresh")}><span className="glyphicon glyphicon-refresh" /></Button>
                        </ButtonGroup>
                    </div>

                    {open}
                    {inProgress}
                    {closed}
                </div>
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    const tournamentMap = state.tournaments.tournaments;
    const tournaments = Object.keys(tournamentMap).map(id => tournamentMap[id]);

    return {
        openTournaments: tournaments.filter(t => t.state === TournamentState.Open),
        inProgressTournaments: tournaments.filter(t => t.state === TournamentState.Groups || t.state === TournamentState.Knockout),
        closedTournaments: tournaments.filter(t => t.state === TournamentState.Closed)
    };
}, (dispatch) => ({
    refresh: () => { dispatch(refresh(null)); }
}))(TournamentsComponent);
