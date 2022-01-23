import * as React from "react";
import * as ReactMarkdown from "react-markdown";

import { AppDispatch, AppNextPage } from "../../store";
import { GridColumn, GridRow } from "../../components/layout";
import { NewsContent, TournamentState } from "../../external/imperaClients";
import { Section, SubSection } from "../../components/ui/typography";
import { useDispatch, useSelector } from "react-redux";

import { HumanDate } from "../../components/ui/humanDate";
import { IState } from "../../reducers";
import Link from "next/link";
import { ProgressButton } from "../../components/ui/progressButton";
import __ from "../../i18n/i18n";
import { doQuickGame } from "../../lib/domain/game/quickGame";
import { fetch } from "../../lib/domain/game/news.slice";
import { fetchAll } from "../../lib/domain/game/tournaments.slice";
import style from "./index.module.scss";

function _getLanguageContent(
    language: string,
    content: NewsContent[]
): NewsContent {
    let matches = content.filter((x) => x.language === language);
    return matches && matches.length > 0 && matches[0];
}

function selector(state: IState) {
    const tournaments = state.tournaments.tournaments || [];
    const openTournaments = tournaments.filter(
        (x) => x.state === TournamentState.Open
    );
    const activeTournaments = tournaments.filter(
        (x) =>
            x.state === TournamentState.Knockout ||
            x.state === TournamentState.Groups
    );

    return {
        userInfo: state.session.userInfo,
        language: state.session.language,
        news: state.news.news,
        openTournaments,
        activeTournaments,
    };
}

export const News: AppNextPage = (props) => {
    const { news, language, openTournaments, activeTournaments } =
        useSelector(selector);

    const [quickGameActive, setQuickGameActive] = React.useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const quickGame = () => {
        setQuickGameActive(true);
        dispatch(doQuickGame());
    };

    return (
        <GridRow>
            <GridColumn className="col-md-9">
                <div>
                    {news.map((n, i) => {
                        let content = _getLanguageContent(language, n.content);
                        if (!content) {
                            return null;
                        }

                        return (
                            <div key={i}>
                                <h2 className="headline">{content.title}</h2>
                                <h5>
                                    {HumanDate(n.dateTime)} - {n.postedBy}
                                </h5>

                                <div className={style.newsContent}>
                                    <ReactMarkdown
                                        source={content.text || ""}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GridColumn>

            <GridColumn className="col-md-3">
                <Section>{__("First time here?")}</Section>
                <ProgressButton
                    isActive={quickGameActive}
                    onClick={() => quickGame()}
                >
                    {__("Play game against Bot")}
                </ProgressButton>

                <Section>{__("Tournaments")}</Section>

                <SubSection>{__("Open")}</SubSection>
                {openTournaments.map((tournament) => {
                    return (
                        <div key={tournament.id}>
                            <Link
                                as={`/game/tournaments/${tournament.id}`}
                                href={`/game/tournaments/[tournamentId]`}
                            >
                                <a>{tournament.name}</a>
                            </Link>
                        </div>
                    );
                })}

                <SubSection>{__("In Progress")}</SubSection>
                {activeTournaments.map((tournament) => {
                    return (
                        <div key={tournament.id}>
                            <Link
                                as={`/game/tournaments/${tournament.id}`}
                                href={`/game/tournaments/[tournamentId]`}
                            >
                                <a>{tournament.name}</a>
                            </Link>
                        </div>
                    );
                })}
            </GridColumn>
        </GridRow>
    );
};

News.getTitle = () => __("News");
News.needsLogin = true;

News.getInitialProps = async (ctx) => {
    await Promise.all([
        ctx.store.dispatch(fetch()),
        ctx.store.dispatch(fetchAll()),
    ]);

    return selector(ctx.store.getState());
};

export default News;
