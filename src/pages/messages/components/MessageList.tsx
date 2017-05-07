import "./MessageList.scss"

import * as React from "react";
import { Button, Table } from "react-bootstrap";
import { HumanDate } from "../../../components/ui/humanDate";
import { FolderInformation, Message, MessageFolder } from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { css } from "../../../lib/css";
import { FolderName } from "./FolderName";

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
        })} onClick={() => this._openMessage(message)}>
            <td>{message.from.name}</td>
            <td>{message.subject}</td>
            <td>{HumanDate(message.sentAt)}</td>
            <td className="text-right">
                <Button bsStyle="danger" bsSize="xs" onClick={(ev) => this._deleteMessage(ev, message)}>
                    <i className="fa fa-trash-o" />&nbsp;{__("Delete")}
                </Button>
            </td>
        </tr>;
    }

    @autobind
    private _openMessage(message: Message) {
        this.props.onMessageSelect(message);
    }

    @autobind
    private _deleteMessage(ev: React.MouseEvent<any>, message: Message) {
        this.props.onMessageDelete(message);

        ev.preventDefault();
        ev.stopPropagation();
    }
}
