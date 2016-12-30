import "./main.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Grid, GridRow, GridColumn } from "../layout";

import { clear } from "../../common/message/message.actions";
import { openCloseNav } from "../../common/general/general.actions";
import { IState } from "../../reducers";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { LayerHost } from "office-ui-fabric-react/lib/Layer";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import LinkString from "../../components/ui/strLink";

interface ILayoutProps {
    message;
    clear: () => void;
    nav;
    content;
    pageContent;

    isNavOpen: boolean;

    openCloseNav: (state: boolean) => void;
}

export class Layout extends React.Component<ILayoutProps, void> {
    public render(): JSX.Element {
        let msg: JSX.Element;
        if (!!this.props.message) {
            msg = <MessageBar
                messageBarType={this.props.message.type}
                onDismiss={this._onClear}>
                <LinkString link={this.props.message.message} />
            </MessageBar>;
        }

        return <LayerHost className="nav-host">
            <div>
                <Grid className="layout">
                    <GridRow className="header">
                        <GridColumn className="ms-u-sm12 ms-u-md5 logo">
                            <img src="/assets/logo_150.png" />
                        </GridColumn>

                        <GridColumn className="ms-u-sm12 ms-u-md7 navigation ms-u-hiddenSm">
                            {this.props.nav}
                        </GridColumn>

                        <GridColumn className="ms-u-sm12 ms-u-md7 mobile-navigation ms-u-hiddenMdUp">
                            <Panel
                                isOpen={this.props.isNavOpen}
                                type={PanelType.smallFixedNear}
                                isBlocking={false}
                                onDismiss={() => this.props.openCloseNav(false)}
                                isLightDismiss={true}
                                className="mobile-nav">
                                {this.props.nav}
                            </Panel>

                            <Button buttonType={ButtonType.icon} icon="GlobalNavButton" onClick={() => this.props.openCloseNav(true)} />
                        </GridColumn>
                    </GridRow>

                    <GridRow>
                        {msg}
                    </GridRow>

                    <GridRow className="content">
                        {this.props.content}
                    </GridRow>

                    <GridRow className="footer">
                        2003-2016 &copy; Christopher Schleiden and the Impera team. All Rights Reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">User Voice</a>
                    </GridRow>
                </Grid>
                {this.props.pageContent}
            </div>
        </LayerHost>;
    }

    private _onClear = () => {
        this.props.clear();
    }
}

export default connect((state: IState) => ({
    message: state.message.data.message,
    isNavOpen: state.general.data.isNavOpen
}), (dispatch) => ({
    clear: () => { dispatch(clear(null)); },
    openCloseNav: (state: boolean) => { dispatch(openCloseNav(state)); }
}))(Layout);