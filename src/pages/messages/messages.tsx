import * as React from "react";

import { connect } from "react-redux";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";

export interface IMessagesProps {
    refresh: () => void;
}

export class MessagesComponent extends React.Component<IMessagesProps, void> {
    public componentDidMount() {
        // this.props.refresh();

        setDocumentTitle(__("Your messages"));
    }

    public render(): JSX.Element {
        let messages: JSX.Element[];

        return <GridColumn className="col-xs-12">
            <div className="inProgress">
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    return {
    };
}, (dispatch) => ({
}))(MessagesComponent);