import * as React from "react";
import * as ReactMarkdown from "react-markdown";

import { connect } from "react-redux";
import { UserInfo, NewsItem, NewsContent } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title } from "../../components/ui/typography";
import HumanDate from "../../components/ui/humanDate";

import { refresh } from "./news.actions";

export interface IStartProps {
    userInfo: UserInfo;
    news: NewsItem[];

    refresh: () => void;
}

export class StartComponent extends React.Component<IStartProps, void> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        return <GridColumn className="ms-u-sm12">
            <Title>{__("News")}</Title>
            <div>
                {this.props.news.map((n, i) => {
                    let content = this._getLanguageContent(n.content);
                    if (!content) {
                        return null;
                    }

                    return <div key={i}>
                        <h2>{content.title}</h2>
                        <h5>{HumanDate(n.dateTime)} - {n.postedBy}</h5>

                        <ReactMarkdown source={content.text} />
                    </div>;
                })}
            </div>
        </GridColumn>;
    };

    private _getLanguageContent(content: NewsContent[]): NewsContent {
        let matches = content.filter(x => x.language === this.props.userInfo.language);
        return matches && matches.length > 0 && matches[0];
    }
}

export default connect(state => ({
    userInfo: state.session.data.userInfo,
    news: state.news.data.news
}), (dispatch) => ({
    refresh: () => dispatch(refresh(null))
}))(StartComponent);