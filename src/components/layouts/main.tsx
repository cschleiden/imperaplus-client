
import "./main.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Grid, GridRow, GridColumn } from "../layout";

import { clear } from "../../common/message/message.actions";
import { openCloseNav } from "../../common/general/general.actions";
import { setLanguage } from "../../common/session/session.actions";
import { IState } from "../../reducers";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { LayerHost } from "office-ui-fabric-react/lib/Layer";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { ContextualMenu, DirectionalHint } from "office-ui-fabric-react/lib/ContextualMenu";
import LinkString from "../../components/ui/strLink";

interface ILanguageSelectorProps {
    selectedLanguage: string;
    onLanguageSelect: (language: string) => void;
}

interface ILanguageSelectorState {
    languageMenuVisible: boolean;
    languageMenuTarget: EventTarget;
}

class LanguageSelector extends React.Component<ILanguageSelectorProps, ILanguageSelectorState> {
    private _element: HTMLElement;
    private _resolveButton = (element: HTMLElement) => this._element = element;

    constructor(props, context) {
        super(props, context);

        this.state = {
            languageMenuVisible: false,
            languageMenuTarget: null
        };
    }

    public render() {
        return <div ref={this._resolveButton}>
            <Button
                onClick={this._onLanguageMenu}
                buttonType={ButtonType.command}
                icon="Globe">
                {__("LANGUAGE")}
            </Button>

            {
                this.state.languageMenuVisible ? <ContextualMenu
                    shouldFocusOnMount={true}
                    onDismiss={this._onLanguageMenuDismiss}
                    target={this._element as any}
                    items={[
                        {
                            key: "en",
                            name: __("English"),
                            canCheck: true,
                            isChecked: this.props.selectedLanguage === "en",
                            onClick: () => this.props.onLanguageSelect("en")
                        },
                        {
                            key: "de",
                            name: __("German"),
                            canCheck: true,
                            isChecked: this.props.selectedLanguage === "de",
                            onClick: () => this.props.onLanguageSelect("de")
                        }
                    ]}
                    /> : null
            }
        </div>;
    }

    private _onLanguageMenu = (event: React.MouseEvent<Button>) => {
        this.setState({
            languageMenuVisible: true,
            languageMenuTarget: event.target
        });
    }

    private _onLanguageMenuDismiss = () => {
        this.setState({
            languageMenuVisible: false
        } as ILanguageSelectorState);
    }
}

interface ILayoutProps {
    message;
    clear: () => void;
    nav;
    content;
    pageContent;

    isNavOpen: boolean;
    language: string;

    openCloseNav: (state: boolean) => void;
    setLanguage: (language: string) => void;
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

        return <div>
            <Grid className="layout">
                <GridRow className="header">
                    <GridColumn className="ms-u-sm12 ms-u-lg5 logo">
                        <img src="/assets/logo_150.png" />
                    </GridColumn>

                    <GridColumn className="ms-u-sm12 ms-u-lg7 navigation-container ms-u-hiddenMdDown">
                        <div className="lang">
                            <LanguageSelector selectedLanguage={this.props.language} onLanguageSelect={this._onLanguageSelect} />
                        </div>

                        <div className="navigation">
                            {this.props.nav}
                        </div>
                    </GridColumn>

                    {/* Responsive Navigation */}
                    <GridColumn className="ms-u-sm12 ms-u-lg7 mobile-navigation ms-u-hiddenLgUp">
                        <Panel
                            isOpen={this.props.isNavOpen}
                            type={PanelType.smallFixedNear}
                            isBlocking={false}
                            onDismiss={() => this.props.openCloseNav(false)}
                            isLightDismiss={true}
                            className="mobile-nav">
                            <LanguageSelector selectedLanguage={this.props.language} onLanguageSelect={this._onLanguageSelect} />

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

            <LayerHost className="nav-host" />
        </div>;
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
    language: state.session.data.language
}), (dispatch) => ({
    clear: () => { dispatch(clear(null)); },
    openCloseNav: (state: boolean) => { dispatch(openCloseNav(state)); },
    setLanguage: (language: string) => { dispatch(setLanguage(language)); }
}))(Layout);