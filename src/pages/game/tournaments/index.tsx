import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { TournamentList } from "../../../components/ui/games/tournamentList";
import { Section } from "../../../components/ui/typography";
import {
    TournamentState,
    TournamentSummary,
} from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { fetchAll } from "../../../lib/domain/game/tournaments.slice";
import { IState } from "../../../reducers";
import { AppDispatch, AppNextPage, useAppSelector } from "../../../store";

export interface ITournamentGamesProps {
    openTournaments: TournamentSummary[];
    inProgressTournaments: TournamentSummary[];
    closedTournaments: TournamentSummary[];
}

function selector(state: IState) {
    const tournamentMap = state.tournaments.tournaments;
    const tournaments = Object.keys(tournamentMap).map(
        (id) => tournamentMap[id]
    );

    return {
        openTournaments: tournaments.filter(
            (t) => t.state === TournamentState.Open
        ),
        inProgressTournaments: tournaments.filter(
            (t) =>
                t.state === TournamentState.Groups ||
                t.state === TournamentState.Knockout
        ),
        closedTournaments: tournaments.filter(
            (t) => t.state === TournamentState.Closed
        ),
    };
}

const Tournaments: AppNextPage = () => {
    const props = useAppSelector(selector);
    const dispatch = useDispatch<AppDispatch>();

    let open: JSX.Element;
    let inProgress: JSX.Element;
    let closed: JSX.Element;

    if (props.openTournaments.length > 0) {
        open = (
            <>
                <Section key="open-title">{__("Open")}</Section>
                <TournamentList
                    tournaments={props.openTournaments}
                    key="open"
                />
            </>
        );
    }

    if (props.inProgressTournaments.length > 0) {
        inProgress = (
            <>
                <Section key="in-progres-title">{__("In Progress")}</Section>
                <TournamentList
                    tournaments={props.inProgressTournaments}
                    key="inprogress"
                />
            </>
        );
    }

    if (props.closedTournaments.length > 0) {
        closed = (
            <>
                <Section key="closed-title">{__("Closed")}</Section>,
                <TournamentList
                    tournaments={props.closedTournaments}
                    key="closed"
                />
            </>
        );
    }

    return (
        <div>
            <div className="pull-right">
                <ButtonGroup>
                    <Button
                        key="refresh"
                        onClick={() => dispatch(fetchAll())}
                        title={__("Refresh")}
                    >
                        <span className="glyphicon glyphicon-refresh" />
                    </Button>
                </ButtonGroup>
            </div>

            {open}
            {inProgress}
            {closed}
        </div>
    );
};

Tournaments.needsLogin = true;
Tournaments.getTitle = () => __("Tournaments");
Tournaments.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(fetchAll());

    return {};
};

export default Tournaments;
