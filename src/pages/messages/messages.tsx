import * as React from "react";

import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Button, ButtonGroup } from "react-bootstrap";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";

import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";
import { FolderList } from "./components/FolderList";
import { autobind } from "../../lib/autobind";
import { load, switchFolder } from "./messages.actions";
import { FolderInformation, MessageFolder, Message } from "../../external/imperaClients";
import { MessageList } from "./components/MessageList";
import { FolderName } from "./components/FolderName";

export interface IMessagesProps {
    init: () => void;
    switchFolder: (folder: MessageFolder) => void;
    compose: () => void;

    currentFolder: MessageFolder;
    currentMessages: Message[];
    folderInformation: FolderInformation[];
}

export class MessagesComponent extends React.Component<IMessagesProps, void> {
    public componentDidMount() {
        setDocumentTitle(__("Messages"));

        this.props.init();
    }

    public render(): JSX.Element {
        const { folderInformation, currentFolder, currentMessages } = this.props;

        let messages: JSX.Element[];

        return <GridRow>
            <GridColumn className="col-xs-3">
                <Section>{__("Folders")}</Section>
                <FolderList onFolderSelect={this._changeFolder} folders={folderInformation} selectedFolder={currentFolder} />
            </GridColumn>

            <GridColumn className="col-xs-9">
                <Section additionalContent={<div className="pull-right clearfix">
                    <Button onClick={this._compose}>
                        <i className="fa fa-envelope-o" />&nbsp;{__("Compose")}
                    </Button>
                </div>}>
                    {FolderName(currentFolder)}
                </Section>

                <MessageList messages={currentMessages} onMessageSelect={this._selectMessage} onMessageDelete={this._deleteMessage} />
            </GridColumn>
        </GridRow>;
    }

    @autobind
    private _compose() {
        this.props.compose();
    }

    @autobind
    private _changeFolder(folder: FolderInformation) {
        this.props.switchFolder(folder.folder);
    }

    @autobind
    private _selectMessage(message: Message) {
        // Navigate
    }

    @autobind
    private _deleteMessage(message: Message) {
        // delete
    }
}

export default connect((state: IState) => {
    const messages = state.messages.data;

    return {
        currentFolder: messages.currentFolder,
        currentMessages: messages.currentMessages,
        folderInformation: messages.folderInformation
    };
}, (dispatch) => ({
    init: () => {
        dispatch(load(null));
    },
    switchFolder: (folder: MessageFolder) => { dispatch(switchFolder(folder)); },
    compose: () => { dispatch(push("/game/messages/compose")); }
}))(MessagesComponent);