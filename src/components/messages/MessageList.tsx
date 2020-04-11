import * as React from "react";
import { Button, Table } from "react-bootstrap";
import { Message } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { css } from "../../lib/utils/css";
import { HumanDate } from "../ui/humanDate";
import { UserRef } from "../ui/userReference";
import style from "./MessageList.module.scss";

export interface IMessageListProps {
    messages: Message[];

    onMessageSelect: (message: Message) => void;
    onMessageDelete: (message: Message) => void;
}

export class MessageList extends React.Component<IMessageListProps> {
    public render() {
        const { messages } = this.props;

        return (
            <div className={style.messageList}>
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
                        {messages &&
                            messages.map((m) => this._renderMessage(m))}
                    </tbody>
                </Table>
            </div>
        );
    }

    private _renderMessage(message: Message) {
        return (
            <tr
                key={message.id}
                className={css({
                    [style.unread]: !message.isRead,
                })}
                onClick={() => this._openMessage(message)}
            >
                <td>
                    <UserRef userRef={message.from} />
                </td>
                <td>{message.subject}</td>
                <td>{HumanDate(message.sentAt)}</td>
                <td className="text-right">
                    <Button
                        bsStyle="danger"
                        bsSize="xs"
                        onClick={(ev) => this._deleteMessage(ev, message)}
                    >
                        <i className="fa fa-trash-o" />
                        &nbsp;{__("Delete")}
                    </Button>
                </td>
            </tr>
        );
    }

    private _openMessage = (message: Message) => {
        this.props.onMessageSelect(message);
    };

    private _deleteMessage = (ev: React.MouseEvent<any>, message: Message) => {
        this.props.onMessageDelete(message);

        ev.preventDefault();
        ev.stopPropagation();
    };
}
