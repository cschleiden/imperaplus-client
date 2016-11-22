import "./main.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Grid, GridRow, GridColumn } from "../layout";

import { clear } from "../../actions/message";
import { TState } from "../../reducers/message";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import LinkString from "../../components/ui/strLink";

export const Layout = ({ message, clear, nav, content }): JSX.Element => {
    let msg: JSX.Element;
    if (!!message) {
        msg = <MessageBar
            messageBarType={message.type}
            onDismiss={clear}>
            <LinkString link={message.message} />
        </MessageBar>;
    }

    return <Grid className="layout">
        <GridRow className="header">
            <GridColumn className="ms-u-sm12 ms-u-md5 logo">
                <img src="https://impera-dev.azurewebsites.net/assets/logo_150.png" />
            </GridColumn>
            <GridColumn className="ms-u-sm12 ms-u-md7 navigation">
                {nav}
            </GridColumn>
        </GridRow>

        <GridRow>
            {msg}
        </GridRow>

        <GridRow className="content">
            {content}
        </GridRow>

        <GridRow className="footer">
            2003-2016 © Christopher Schleiden and the Impera team. All Rights Reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">User Voice</a>
        </GridRow>
    </Grid>;
};

export default connect((state: { message: TState }) => ({
    message: state.message.data.message
}), (dispatch) => ({
    clear: () => dispatch(clear())
}))(Layout);