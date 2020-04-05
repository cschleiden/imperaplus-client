import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import {
    Alert,
    Button,
    DropdownButton,
    Glyphicon,
    MenuItem,
} from "react-bootstrap";
import { connect } from "react-redux";
import { UserInfo } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { openClose } from "../../lib/domain/shared/general/general.slice";
import {
    clearMessage,
    IMessage,
} from "../../lib/domain/shared/message/message.slice";
import { setLanguage } from "../../lib/domain/shared/session/session.slice";
import { getStyleForMessage } from "../../lib/utils/message";
import { IState } from "../../reducers";
import { AppDispatch } from "../../store";
import { Grid, GridColumn, GridContainer, GridRow } from "../layout";
import { LinkString } from "../ui/strLink";
import { Title } from "../ui/typography";

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
    nav?: React.ReactNode;

    message?: IMessage;
    isNavOpen: boolean;
    language: string;
    userInfo: UserInfo;

    title: string;

    clear: () => void;
    openCloseNav: (state: boolean) => void;
    setLanguage: (language: string) => void;
}

class Layout extends React.Component<ILayoutProps> {
    private _msg: HTMLDivElement;
    private _resolveMsg = (element: HTMLDivElement) => (this._msg = element);

    public componentDidUpdate(prevProps: ILayoutProps) {
        // Scroll message into view if it exists
        const { message } = this.props;

        if (!!message && prevProps.message !== message && this._msg) {
            this._msg.scrollIntoView();
        }
    }

    public render(): JSX.Element {
        const { title, message, userInfo } = this.props;

        let msg: JSX.Element;
        if (!!message) {
            msg = (
                <Alert
                    bsStyle={getStyleForMessage(message.type)}
                    onDismiss={this._onClear}
                >
                    <LinkString link={message.message} />
                </Alert>
            );
        }

        let isAdmin = false;
        if (userInfo) {
            isAdmin =
                userInfo.roles
                    .map(r => r.toUpperCase())
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
                            {this.props.isNavOpen && (
                                <div className="mobile-nav">
                                    <Grid className="container">
                                        <GridRow className="text-right">
                                            <Button
                                                onClick={() =>
                                                    this.props.openCloseNav(
                                                        false
                                                    )
                                                }
                                            >
                                                <Glyphicon glyph="menu-hamburger" />
                                            </Button>
                                        </GridRow>

                                        <GridRow>{this.props.nav}</GridRow>

                                        <GridRow>
                                            <MobileLanguageSelector
                                                selectedLanguage={
                                                    this.props.language
                                                }
                                                onLanguageSelect={
                                                    this._onLanguageSelect
                                                }
                                            />
                                        </GridRow>
                                    </Grid>
                                </div>
                            )}

                            <Button
                                onClick={() => this.props.openCloseNav(true)}
                            >
                                <Glyphicon glyph="menu-hamburger" />
                            </Button>
                        </GridColumn>

                        <GridColumn className="col-xs-7 col-lg-7 navigation-container hidden-xs">
                            <div className="lang">
                                <LanguageSelector
                                    selectedLanguage={this.props.language}
                                    onLanguageSelect={this._onLanguageSelect}
                                />
                            </div>

                            <div className="navigation">{this.props.nav}</div>
                        </GridColumn>
                    </GridRow>

                    <GridRow className="message">
                        <div ref={this._resolveMsg}>{msg}</div>
                    </GridRow>

                    <GridRow className="content">
                        {title && (
                            <GridColumn className="col-xs-12 main-title">
                                <Title>{title}</Title>

                                <Head>
                                    <title>
                                        {!!title
                                            ? `Impera - ${title}`
                                            : "title"}
                                    </title>
                                </Head>
                            </GridColumn>
                        )}

                        <GridColumn className="col-xs-12 main-content">
                            {this.props.children}
                        </GridColumn>
                    </GridRow>

                    <GridRow className="footer">
                        {isAdmin && (
                            <span>
                                <a href="/toadmin">ADMIN</a>&nbsp;|&nbsp;
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
                        <a href="http://forum.imperaonline.de/">
                            {__("Forum (external)")}
                        </a>{" "}
                        | <a href="https://www.imperaonline.de/swagger/">API</a>
                    </GridRow>
                </GridContainer>
            </div>
        );
    }

    private _onLanguageSelect = (language: string) => {
        this.props.setLanguage(language);
    };

    private _onClear = () => {
        this.props.clear();
    };
}

export default connect(
    (state: IState) => {
        const session = state.session;
        const general = state.general;

        return {
            message: state.message.message,
            isNavOpen: general.isNavOpen,
            language: session.language,
            userInfo: session.userInfo,
            title: general.title,
        };
    },
    (dispatch: AppDispatch) => ({
        clear: () => {
            dispatch(clearMessage());
        },
        openCloseNav: (state: boolean) => {
            dispatch(openClose(state));
        },
        setLanguage: (language: string) => {
            dispatch(setLanguage(language));
        },
    })
)(Layout);
