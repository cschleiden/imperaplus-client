import * as React from "react";
import * as ReactMarkdown from "react-markdown";

import { connect } from "react-redux";
import { UserInfo, NewsItem, NewsContent } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import HumanDate from "../../components/ui/humanDate";

//import { refresh } from "./.actions";

export interface IMyGamesProps {
    refresh: () => void;
}

export class MyGamesComponent extends React.Component<IMyGamesProps, void> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        return <GridColumn className="ms-u-sm12">
            <h1>{__("My Games")}</h1>
            <div>
                
            </div>
        </GridColumn>;
    }
}

export default connect(state => ({
}), (dispatch) => ({
}))(MyGamesComponent);