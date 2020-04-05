import Link from "next/link";
import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { GridColumn, GridRow } from "../../components/layout";
import { HumanDate } from "../../components/ui/humanDate";
import { Section, SubSection } from "../../components/ui/typography";
import { NewsContent } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { fetch } from "../../lib/domain/news.slice";
import { IState } from "../../reducers";
import { AppNextPage } from "../../store";
// import { refresh as tournamentsRefresh } from "./tournaments/tournaments.actions";

function _getLanguageContent(
    language: string,
    content: NewsContent[]
): NewsContent {
    let matches = content.filter(x => x.language === language);
    return matches && matches.length > 0 && matches[0];
}

function selector(state: IState) {
    // const tournaments = []; //state.tournaments.tournaments || [];
    // const openTournaments = tournaments.filter(
    //     x => x.state === TournamentState.Open
    // );
    // const activeTournaments = tournaments.filter(
    //     x =>
    //         x.state === TournamentState.Knockout ||
    //         x.state === TournamentState.Groups
    // );
    // const closedTournaments = tournaments
    //     .filter(x => x.state === TournamentState.Closed)
    //     .slice(10);

    return {
        userInfo: state.session.userInfo,
        language: state.session.language,
        news: state.news.news,
        openTournaments: [],
        activeTournaments: [],
        closedTournaments: [],
    };
}

export const News: AppNextPage = props => {
    const {
        news,
        language,
        openTournaments,
        activeTournaments,
        closedTournaments,
    } = useSelector(selector);

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

                                <ReactMarkdown source={content.text || ""} />
                            </div>
                        );
                    })}
                </div>
            </GridColumn>

            <GridColumn className="col-md-3">
                <Section>{__("Tournaments")}</Section>

                <SubSection>{__("Open")}</SubSection>
                {openTournaments.map(tournament => {
                    return (
                        <div key={tournament.id}>
                            <Link href={`/game/tournaments/${tournament.id}`}>
                                {tournament.name}
                            </Link>
                        </div>
                    );
                })}

                <SubSection>{__("Active")}</SubSection>
                {activeTournaments.map(tournament => {
                    return (
                        <div key={tournament.id}>
                            <Link href={`/game/tournaments/${tournament.id}`}>
                                {tournament.name}
                            </Link>
                        </div>
                    );
                })}

                <SubSection>{__("Closed")}</SubSection>
                {closedTournaments.map(tournament => {
                    return (
                        <div key={tournament.id}>
                            <Link href={`/game/tournaments/${tournament.id}`}>
                                {tournament.name}
                            </Link>
                        </div>
                    );
                })}
            </GridColumn>
        </GridRow>
    );
};

News.getTitle = () => __("News");

News.getInitialProps = async ctx => {
    await ctx.store.dispatch(fetch());

    return selector(ctx.store.getState());
};

export default News;
