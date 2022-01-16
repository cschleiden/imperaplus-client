import Router from "next/router";
import * as React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { GridColumn, GridRow } from "../../../components/layout";
import { FolderList } from "../../../components/messages/FolderList";
import { FolderName } from "../../../components/messages/FolderName";
import { MessageList } from "../../../components/messages/MessageList";
import { Section } from "../../../components/ui/typography";
import {
    FolderInformation,
    Message,
    MessageFolder,
} from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import {
    deleteMessage,
    fetch,
    switchFolder,
} from "../../../lib/domain/game/messages.slice";
import { IState } from "../../../reducers";
import { AppDispatch, AppNextPage, useAppSelector } from "../../../store";

function selector(state: IState): IMessagesProps {
    const { messages } = state;

    return {
        currentFolder: messages.currentFolder,
        currentMessages: messages.currentMessages,
        folderInformation: messages.folderInformation,
    };
}

export interface IMessagesProps {
    currentFolder: MessageFolder;
    currentMessages: Message[];
    folderInformation: FolderInformation[];
}

const Messages: AppNextPage<IMessagesProps> = () => {
    const { folderInformation, currentFolder, currentMessages } =
        useAppSelector(selector);

    const dispatch = useDispatch<AppDispatch>();

    return (
        <GridRow>
            <GridColumn className="col-md-9 col-md-push-3 col-xs-12">
                <Section
                    additionalContent={
                        <div className="pull-right clearfix">
                            <Button
                                onClick={() =>
                                    Router.push("/game/messages/compose")
                                }
                            >
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
                    onMessageSelect={(message) =>
                        Router.push(
                            "/game/messages/[messageId]",
                            `/game/messages/${message.id}`
                        )
                    }
                    onMessageDelete={(message) =>
                        dispatch(deleteMessage(message.id))
                    }
                />
            </GridColumn>

            <GridColumn className="col-md-3 col-md-pull-9 col-xs-12">
                <Section>{__("Folders")}</Section>
                <FolderList
                    onFolderSelect={({ folder }) =>
                        dispatch(switchFolder(folder))
                    }
                    folders={folderInformation}
                    selectedFolder={currentFolder}
                />
            </GridColumn>
        </GridRow>
    );
};

Messages.needsLogin = true;
Messages.getTitle = () => __("Messages");
Messages.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(fetch());

    return selector(ctx.store.getState());
};

export default Messages;
