import * as React from "react";

import {
    Alert,
    Button,
    DropdownButton,
    Glyphicon,
    MenuItem,
} from "react-bootstrap";
import { AppDispatch, useAppSelector } from "../../store";
import { Grid, GridColumn, GridContainer, GridRow } from "../layout";

import Head from "next/head";
import Link from "next/link";
import { LinkString } from "../ui/strLink";
import { Title } from "../ui/typography";
import __ from "../../i18n/i18n";
import { baseUri } from "../../configuration";
import { clearMessage } from "../../lib/domain/shared/message/message.slice";
import { getStyleForMessage } from "../../lib/utils/message";
import { openClose } from "../../lib/domain/shared/general/general.slice";
import { setLanguage } from "../../lib/domain/shared/session/session.slice";
import { useDispatch } from "react-redux";

interface ILanguageSelectorProps {
    selectedLanguage: string;
    onLanguageSelect: (language: string) => void;
}

class LanguageSelector extends React.Component<ILanguageSelectorProps> {
    public render() {
        return (
            <div>
                <div className="language">
                    <DropdownButton
                        id="language"
                        title={__("LANGUAGE")}
                        bsStyle="link"
                    >
                        <MenuItem
                            onClick={() => this.props.onLanguageSelect("en")}
                            active={this.props.selectedLanguage === "en"}
                        >
                            {__("English")}
                        </MenuItem>
                        <MenuItem
                            onClick={() => this.props.onLanguageSelect("de")}
                            active={this.props.selectedLanguage === "de"}
                        >
                            {__("German")}
                        </MenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }
}

class MobileLanguageSelector extends React.Component<ILanguageSelectorProps> {
    public render() {
        return (
            <ul className="nav">
                <li>
                    <a>{__("Language")}</a>
                    <ul className="nav-dropdown">
                        <li>
                            <a
                                href="#"
                                onClick={this._onClick.bind(this, "en")}
                            >
                                {__("English")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={this._onClick.bind(this, "de")}
                            >
                                {__("German")}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        );
    }

    private _onClick(
        language: string,
        ev: React.MouseEvent<HTMLAnchorElement>
    ) {
        ev.preventDefault();
        ev.stopPropagation();

        this.props.onLanguageSelect(language);
    }
}

interface ILayoutProps {
    nav?: JSX.Element;
}

const Layout: React.FC<ILayoutProps> = (props) => {
    const dispatch = useDispatch<AppDispatch>();

    const { title, message, userInfo, isNavOpen, language, token } =
        useAppSelector((s) => ({
            title: s.general.title,
            message: s.message.message,
            userInfo: s.session.userInfo,
            isNavOpen: s.general.isNavOpen,
            language: s.session.language,
            token: s.session.access_token,
        }));

    const ref = React.useRef();

    let msg: JSX.Element;
    if (!!message) {
        msg = (
            <Alert
                bsStyle={getStyleForMessage(message.type)}
                onDismiss={() => dispatch(clearMessage())}
            >
                <LinkString link={message.message} />
            </Alert>
        );
    }

    let isAdmin = false;
    if (userInfo) {
        isAdmin =
            userInfo.roles
                .map((r) => r.toUpperCase())
                .indexOf("admin".toUpperCase()) !== -1;
    }

    return (
        <div className="mainWrapper">
            <GridContainer className="layout">
                <GridRow className="header">
                    {/* <LoadingBar className="loading-bar" /> */}

                    <GridColumn className="col-xs-10 col-sm-5 logo">
                        <img src="/assets/logo_150.png" />
                    </GridColumn>

                    {/* Responsive Navigation */}
                    <GridColumn className="col-xs-2 col-sm-7 mobile-navigation visible-xs-block">
                        {isNavOpen && (
                            <div className="mobile-nav">
                                <Grid className="container">
                                    <GridRow className="text-right">
                                        <Button
                                            onClick={() =>
                                                dispatch(openClose(false))
                                            }
                                        >
                                            <Glyphicon glyph="menu-hamburger" />
                                        </Button>
                                    </GridRow>

                                    <GridRow>{props.nav}</GridRow>

                                    <GridRow>
                                        <MobileLanguageSelector
                                            selectedLanguage={language}
                                            onLanguageSelect={(lang: string) =>
                                                dispatch(setLanguage(lang))
                                            }
                                        />
                                    </GridRow>
                                </Grid>
                            </div>
                        )}

                        <Button onClick={() => dispatch(openClose(true))}>
                            <Glyphicon glyph="menu-hamburger" />
                        </Button>
                    </GridColumn>

                    <GridColumn className="col-xs-7 col-lg-7 navigation-container hidden-xs">
                        <div className="lang">
                            <LanguageSelector
                                selectedLanguage={language}
                                onLanguageSelect={(language: string) =>
                                    dispatch(setLanguage(language))
                                }
                            />
                        </div>

                        <div className="navigation">{props.nav}</div>
                    </GridColumn>
                </GridRow>

                <GridRow className="message">
                    <div ref={ref}>{msg}</div>
                </GridRow>

                <GridRow className="content">
                    {title && (
                        <GridColumn className="col-xs-12 main-title">
                            <Title>{title}</Title>

                            <Head>
                                <title>
                                    {!!title ? `Impera - ${title}` : "title"}
                                </title>
                            </Head>
                        </GridColumn>
                    )}

                    <GridColumn className="col-xs-12 main-content">
                        {props.children}
                    </GridColumn>
                </GridRow>

                <GridRow className="footer">
                    {isAdmin && (
                        <span>
                            <a
                                href="#"
                                onClick={() => {
                                    // Move token to cookie
                                    if (baseUri.indexOf("localhost") !== -1) {
                                        document.cookie = `bearer_token=${token};path=/`;
                                    } else {
                                        document.cookie = `bearer_token=${token};path=/;SameSite=Strict;Secure`;
                                    }

                                    // Navigate to admin
                                    window.location.href =
                                        baseUri + "/api/admin/news";
                                }}
                            >
                                ADMIN
                            </a>
                            &nbsp;|&nbsp;
                        </span>
                    )}
                    <Link href="/privacy">
                        <a>{__("Privacy Policy")}</a>
                    </Link>{" "}
                    |{" "}
                    <Link href="/tos">
                        <a>{__("Terms of Service")}</a>
                    </Link>{" "}
                    |{" "}
                    <Link href="/imprint">
                        <a>{__("Imprint")}</a>
                    </Link>{" "}
                    |{" "}
                    <a href="https://forum.imperaonline.de/">
                        {__("Forum (external)")}
                    </a>{" "}
                    |{" "}
                    <a href="https://discord.gg/FWarVXE">
                        {__("Discord (external)")}
                    </a>{" "}
                    | <a href="https://www.imperaonline.de/api/swagger/">API</a>
                </GridRow>
            </GridContainer>
        </div>
    );
};

export default Layout;
