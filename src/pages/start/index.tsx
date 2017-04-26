import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import { connect } from "react-redux";

import { ProgressBar } from "react-bootstrap";
import { UserInfo, NewsItem, NewsContent } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
import { HumanDate } from "../../components/ui/humanDate";

import { refresh } from "./news.actions";
import { setDocumentTitle } from "../../lib/title";

export interface IStartProps {
    userInfo: UserInfo;
    news: NewsItem[];

    refresh: () => void;
}

export class StartComponent extends React.Component<IStartProps, void> {
    public componentDidMount() {
        this.props.refresh();

        setDocumentTitle(__("News"));
    }

    public render(): JSX.Element {
        return <GridRow>
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

                            <ReactMarkdown source={content.text} />
                        </div>;
                    })}
                </div>
            </GridColumn>

            <GridColumn className="col-md-3">
                <Section>{__("Tournaments")}</Section>

                {__("Champion's Cup March")}
                <div className="progress progress-xxs">
                    <ProgressBar now={80} />
                </div>

                {__("Champion's Cup March")}
                <div className="progress progress-xxs">
                    <ProgressBar now={80} />
                </div>
            </GridColumn>
        </GridRow>;
    };

    private _getLanguageContent(content: NewsContent[]): NewsContent {
        const userLanguage = this.props && this.props.userInfo && this.props.userInfo.language || "en";

        let matches = content.filter(x => x.language === userLanguage);
        return matches && matches.length > 0 && matches[0];
    }
}

export default connect(state => ({
    userInfo: state.session.data.userInfo,
    news: state.news.data.news
}), (dispatch) => ({
    refresh: () => dispatch(refresh(null))
}))(StartComponent);