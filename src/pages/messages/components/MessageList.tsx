import "./MessageList.scss"

import * as React from "react";
import { FolderInformation, MessageFolder, Message } from "../../../external/imperaClients";
import { Table, Button } from "react-bootstrap";
import { FolderName } from "./FolderName";
import { HumanDate } from "../../../components/ui/humanDate";
import { css } from "../../../lib/css";

export interface IMessageListProps {
    messages: Message[];

    onMessageSelect: (message: Message) => void;
    onMessageDelete: (message: Message) => void;
}

export class MessageList extends React.Component<IMessageListProps, void> {
    public render() {
        const { messages } = this.props;

        return <div className="messages-list">
            <Table responsive hover striped>
                <thead>
                    <tr>
                        <td>{__("User")}</td>
                        <td>{__("Subject")}</td>
                        <td>{__("Date")}</td>
                        <td>&nbsp;</td>
                    </tr>
                </thead>

                <tbody>
                    {messages && messages.map(m => this._renderMessage(m))}
                </tbody>
            </Table>
        </div>;
    }

    private _renderMessage(message: Message) {
        return <tr key={message.id} className={css({
            "unread": !message.isRead
        })}>
            <td>{message.from.name}</td>
            <td>{message.subject}</td>
            <td>{HumanDate(message.sentAt)}</td>
            <td className="text-right">
                <Button bsStyle="danger" bsSize="xs">
                    <i className="fa fa-trash-o" />&nbsp;{__("Delete")}
                </Button>
            </td>
        </tr>;
    }
}