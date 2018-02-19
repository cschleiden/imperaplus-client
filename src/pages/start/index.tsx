import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import { connect } from "react-redux";

import { ProgressBar } from "react-bootstrap";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { HumanDate } from "../../components/ui/humanDate";
import { Section, SubSection, Title } from "../../components/ui/typography";
import { NewsContent, NewsItem, UserInfo, TournamentState, TournamentSummary } from "../../external/imperaClients";
import { refresh } from "./news.actions";
import { refresh as tournamentsRefresh } from "../tournaments/tournaments.actions";
import { IState } from "../../reducers";
import { Link } from "react-router";

export interface IStartProps {
    userInfo: UserInfo;
    language: string;
    news: NewsItem[];

    openTournaments: TournamentSummary[];
    activeTournaments: TournamentSummary[];
    closedTournaments: TournamentSummary[];

    refresh: () => void;
}

export class StartComponent extends React.Component<IStartProps> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        return (
            <GridRow>
                <GridColumn className="col-md-9">
                    <div>
                        {this.props.news.map((n, i) => {
                            let content = this._getLanguageContent(n.content);
                            if (!content) {
                                return null;
                            }

                            return <div key={i}>
                                <h2 className="headline">{content.title}</h2>
                                <h5>{HumanDate(n.dateTime)} - {n.postedBy}</h5>

                                <ReactMarkdown source={content.text || ""} />
                            </div>;
                        })}
                    </div>
                </GridColumn>

                <GridColumn className="col-md-3">
                    <Section>{__("Tournaments")}</Section>

                    <SubSection>{__("Open")}</SubSection>
                    {
                        this.props.openTournaments.map(tournament => {
                            return (
                                <div key={tournament.id}>
                                    <Link to={`/game/tournaments/${tournament.id}`}>{tournament.name}</Link>
                                </div>
                            );
                        })
                    }

                    <SubSection>{__("Active")}</SubSection>
                    {
                        this.props.activeTournaments.map(tournament => {
                            return (
                                <div key={tournament.id}>
                                    <Link to={`/game/tournaments/${tournament.id}`}>{tournament.name}</Link>
                                </div>
                            );
                        })
                    }

                    <SubSection>{__("Closed")}</SubSection>
                    {
                        this.props.closedTournaments.map(tournament => {
                            return (
                                <div key={tournament.id}>
                                    <Link to={`/game/tournaments/${tournament.id}`}>{tournament.name}</Link>
                                </div>
                            );
                        })
                    }
                </GridColumn>
            </GridRow>
        );
    }

    private _getLanguageContent(content: NewsContent[]): NewsContent {
        const userLanguage = this.props && this.props.language || "en";

        let matches = content.filter(x => x.language === userLanguage);
        return matches && matches.length > 0 && matches[0];
    }
}

export default connect((state: IState) => {
    const tournaments = state.tournaments.data.tournaments || [];

    const openTournaments = tournaments.filter(x => x.state === TournamentState.Open);
    const activeTournaments = tournaments.filter(x => x.state === TournamentState.Knockout || x.state === TournamentState.Groups);
    const closedTournaments = tournaments.filter(x => x.state === TournamentState.Closed);

    return {
        userInfo: state.session.data.userInfo,
        language: state.session.data.language,
        news: state.news.data.news,
        openTournaments,
        activeTournaments,
        closedTournaments
    };
}, (dispatch) => ({
    refresh: () => {
        dispatch(refresh(null));
        dispatch(tournamentsRefresh(null));
    }
}))(StartComponent);