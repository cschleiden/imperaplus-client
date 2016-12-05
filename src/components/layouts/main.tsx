import "./main.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Grid, GridRow, GridColumn } from "../layout";

import { clear } from "../../common/message/message.actions";
import { IState } from "../../reducers";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import LinkString from "../../components/ui/strLink";

export const Layout = ({ message, clear, nav, content, pageContent }): JSX.Element => {
    let msg: JSX.Element;
    if (!!message) {
        msg = <MessageBar
            messageBarType={message.type}
            onDismiss={clear}>
            <LinkString link={message.message} />
        </MessageBar>;
    }

    return <div>
        <Grid className="layout">
            <GridRow className="header">
                <GridColumn className="ms-u-sm12 ms-u-md5 logo">
                    <img src="/assets/logo_150.png" />
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
        </Grid>
        { pageContent }
    </div>;
};

export default connect((state: IState) => ({
    message: state.message.data.message
}), (dispatch) => ({
    clear: () => dispatch(clear())
}))(Layout);