
import "./main.scss";

import * as React from "react";
import { connect } from "react-redux";
import LoadingBar from "react-redux-loading-bar";
import { Grid, GridColumn, GridContainer, GridRow } from "../layout";

import { openCloseNav } from "../../common/general/general.actions";
import { clear, MessageType } from "../../common/message/message.actions";
import { setLanguage } from "../../common/session/session.actions";
import { IState } from "../../reducers";

import { Alert, Button, ButtonProps, DropdownButton, Glyphicon, MenuItem, Modal } from "react-bootstrap";

import LinkString from "../../components/ui/strLink";
import { UserInfo } from "../../external/imperaClients";
import { getStyleForMessage } from "../../lib/message";

interface ILanguageSelectorProps {
    selectedLanguage: string;
    onLanguageSelect: (language: string) => void;
}

class LanguageSelector extends React.Component<ILanguageSelectorProps, void> {
    public render() {
        return <div>
            <div className="language">
                <DropdownButton id="language" title={__("LANGUAGE")} bsStyle="link">
                    <MenuItem
                        onClick={() => this.props.onLanguageSelect("en")}
                        active={this.props.selectedLanguage === "en"}>
                        {__("English")}
                    </MenuItem>
                    <MenuItem
                        onClick={() => this.props.onLanguageSelect("de")}
                        active={this.props.selectedLanguage === "de"}>
                        {__("German")}
                    </MenuItem>
                </DropdownButton>
            </div>
        </div>;
    }
}


class MobileLanguageSelector extends React.Component<ILanguageSelectorProps, void> {
    public render() {
        return <ul className="nav">
            <li>
                <a>{__("Language")}</a>
                <ul className="nav-dropdown">
                    <li><a href="#" onClick={this._onClick.bind(this, "en")}>
                        {__("English")}
                    </a>
                    </li>
                    <li>
                        <a href="#" onClick={this._onClick.bind(this, "de")}>
                            {__("German")}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>;
    }

    private _onClick(language: string, ev: React.MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.props.onLanguageSelect(language);
    }
}


interface ILayoutProps {
    message;
    clear: () => void;
    breadcrumbs;
    commercials;
    nav;
    content;
    pageContent;

    isNavOpen: boolean;
    language: string;
    userInfo: UserInfo;

    openCloseNav: (state: boolean) => void;
    setLanguage: (language: string) => void;
}

export class Layout extends React.Component<ILayoutProps, void> {
    public render(): JSX.Element {
        let msg: JSX.Element;
        if (!!this.props.message) {
            msg = <Alert
                bsStyle={getStyleForMessage(this.props.message.type)}
                onDismiss={this._onClear}>
                <LinkString link={this.props.message.message} />
            </Alert>;
        }

        const { userInfo } = this.props;
        let isAdmin = false;
        if (userInfo) {
            isAdmin = userInfo.roles
                .map(r => r.toUpperCase())
                .indexOf("admin".toUpperCase()) !== -1;
        }

        return <div className="mainWrapper">
            <GridContainer className="layout">
                <GridRow className="header">
                    <LoadingBar className="loading-bar" />

                    <GridColumn className="col-xs-10 col-sm-5 logo">
                        <img src="/assets/logo_150.png" />
                    </GridColumn>

                    {/* Responsive Navigation */}
                    <GridColumn className="col-xs-2 col-sm-7 mobile-navigation visible-xs-block">
                        {this.props.isNavOpen && <div className="mobile-nav">
                            <Grid className="container">
                                <GridRow className="text-right">
                                    <Button onClick={() => this.props.openCloseNav(false)}>
                                        <Glyphicon glyph="menu-hamburger" />
                                    </Button>
                                </GridRow>

                                <GridRow>
                                    {this.props.nav}
                                </GridRow>

                                <GridRow>
                                    <MobileLanguageSelector
                                        selectedLanguage={this.props.language}
                                        onLanguageSelect={this._onLanguageSelect} />
                                </GridRow>
                            </Grid>
                        </div>}

                        <Button onClick={() => this.props.openCloseNav(true)}>
                            <Glyphicon glyph="menu-hamburger" />
                        </Button>
                    </GridColumn>

                    <GridColumn className="col-xs-7 col-lg-7 navigation-container hidden-xs">
                        <div className="lang">
                            <LanguageSelector
                                selectedLanguage={this.props.language}
                                onLanguageSelect={this._onLanguageSelect} />
                        </div>

                        <div className="navigation">
                            {this.props.nav}
                        </div>
                    </GridColumn>
                </GridRow>

                <GridRow className="message">
                    {msg}
                </GridRow>

                <GridRow className="content">
                    {this.props.breadcrumbs}

                    {this.props.commercials}

                    <GridColumn className="col-xs-12 main-content">
                        {this.props.content}
                    </GridColumn>
                </GridRow>

                <GridRow className="footer">
                    {isAdmin && <a href="/toadmin">ADMIN&nbsp;</a>}
                    <a href="#">{__("Privacy Policy")}</a> | <a href="#">{__("Terms of Service")}</a> | <a href="#">User Voice</a> | <a href="http://impera.ruesken.de/">{__("Forum")}</a>
                </GridRow>
            </GridContainer>

            {this.props.pageContent}
        </div >;
    }

    private _onLanguageSelect = (language: string) => {
        this.props.setLanguage(language);
    }

    private _onClear = () => {
        this.props.clear();
    }
}

export default connect((state: IState) => ({
    message: state.message.data.message,
    isNavOpen: state.general.data.isNavOpen,
    language: state.session.data.language,
    userInfo: state.session.data.userInfo
}), (dispatch) => ({
    clear: () => { dispatch(clear(null)); },
    openCloseNav: (state: boolean) => { dispatch(openCloseNav(state)); },
    setLanguage: (language: string) => { dispatch(setLanguage(language)); }
}))(Layout);
