import * as React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { GridColumn, GridRow } from "../../components/layout";
import { Section } from "../../components/ui/typography";
import {
    FolderInformation,
    Message,
    MessageFolder,
} from "../../external/imperaClients";
import { autobind } from "../../lib/autobind";
import { IState } from "../../reducers";
import { FolderList } from "./components/FolderList";
import { FolderName } from "./components/FolderName";
import { MessageList } from "./components/MessageList";
import { deleteMessage, load, switchFolder } from "./messages.actions";

export interface IMessagesProps {
    init: () => void;
    switchFolder: (folder: MessageFolder) => void;
    compose: () => void;
    open: (message: Message) => void;
    delete: (message: Message) => void;

    currentFolder: MessageFolder;
    currentMessages: Message[];
    folderInformation: FolderInformation[];
}

export class MessagesComponent extends React.Component<IMessagesProps> {
    public componentDidMount() {
        this.props.init();
    }

    public render(): JSX.Element {
        const {
            folderInformation,
            currentFolder,
            currentMessages,
        } = this.props;

        return (
            <GridRow>
                <GridColumn className="col-md-9 col-md-push-3 col-xs-12">
                    <Section
                        additionalContent={
                            <div className="pull-right clearfix">
                                <Button onClick={this._compose}>
                                    <i className="fa fa-envelope-o" />
                                    &nbsp;{__("Compose")}
                                </Button>
                            </div>
                        }
                    >
                        {FolderName(currentFolder)}
                    </Section>

                    <MessageList
                        messages={currentMessages}
                        onMessageSelect={this._selectMessage}
                        onMessageDelete={this._deleteMessage}
                    />
                </GridColumn>

                <GridColumn className="col-md-3 col-md-pull-9 col-xs-12">
                    <Section>{__("Folders")}</Section>
                    <FolderList
                        onFolderSelect={this._changeFolder}
                        folders={folderInformation}
                        selectedFolder={currentFolder}
                    />
                </GridColumn>
            </GridRow>
        );
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
        this.props.open(message);
    }

    @autobind
    private _deleteMessage(message: Message) {
        this.props.delete(message);
    }
}

export default connect(
    (state: IState) => {
        const messages = state.messages;

        return {
            currentFolder: messages.currentFolder,
            currentMessages: messages.currentMessages,
            folderInformation: messages.folderInformation,
        };
    },
    (dispatch) => ({
        init: () => {
            dispatch(load(null));
        },
        switchFolder: (folder: MessageFolder) => {
            dispatch(switchFolder(folder));
        },
        compose: () => {
            dispatch(push("/game/messages/compose"));
        },
        open: (message: Message) => {
            dispatch(push(`/game/messages/${message.id}`));
        },
        delete: (message: Message) => {
            dispatch(deleteMessage(message.id));
        },
    })
)(MessagesComponent);
