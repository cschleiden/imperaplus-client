import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GameList } from "../../components/ui/games/gameList";
import { Section } from "../../components/ui/typography";
import { GameType } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { fetch, hideAll } from "../../lib/domain/game/games.actions";
import { IState } from "../../reducers";
import { AppDispatch, AppNextPage } from "../../store";

function selector(state: IState) {
    const gamesMap = state.games.games;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]);
    const userInfo = state.session.userInfo;

    return {
        funGames: games.filter(g => g.type === GameType.Fun),
        rankingGames: games.filter(g => g.type === GameType.Ranking),
        tournamentGames: games.filter(g => g.type === GameType.Tournament),
        userId: userInfo && userInfo.userId,
    };
}

const MyGames: AppNextPage = props => {
    const dispatch = useDispatch<AppDispatch>();
    const { userId, funGames, rankingGames, tournamentGames } = useSelector(
        selector
    );

    let fun: JSX.Element;
    let ranking: JSX.Element;
    let tournament: JSX.Element;

    if (funGames.length > 0) {
        fun = (
            <>
                <Section key="fun-title">{__("Fun")}</Section>
                <GameList games={funGames} userId={userId} key="fun" />
            </>
        );
    }

    if (rankingGames.length > 0) {
        ranking = (
            <>
                <Section key="ranking-title">{__("Ranking")}</Section>
                <GameList games={rankingGames} userId={userId} key="ranking" />
            </>
        );
    }

    if (tournamentGames.length > 0) {
        tournament = (
            <>
                <Section key="tournaments-title">{__("Tournaments")}</Section>
                <GameList
                    games={tournamentGames}
                    userId={userId}
                    key="tournaments"
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
                        onClick={() => dispatch(fetch())}
                        title={__("Refresh")}
                    >
                        <span className="glyphicon glyphicon-refresh" />
                    </Button>
                    <Button
                        key="hideAll"
                        onClick={() => dispatch(hideAll())}
                        title={__("Hide completed games")}
                    >
                        <span className="glyphicon glyphicon-eye-close" />
                    </Button>
                </ButtonGroup>
            </div>

            {fun}
            {ranking}
            {tournament}
        </div>
    );
};

MyGames.getTitle = () => __("My Games");
MyGames.needsLogin = true;

MyGames.getInitialProps = async ctx => {
    await ctx.store.dispatch(fetch());

    return selector(ctx.store.getState());
};

export default MyGames;
