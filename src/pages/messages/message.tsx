import "./message.scss";

import * as React from "react";
import { connect } from "react-redux";
import { GridRow, GridColumn } from "../../components/layout/index";
import { SendMessage, Message } from "../../external/imperaClients";
import { sendMessage, loadMessage, openMessage } from "./messages.actions";
import { Section } from "../../components/ui/typography";
import { HumanDate } from "../../components/ui/humanDate";
import { Spinner } from "../../components/ui/spinner";
import { autobind } from "../../lib/autobind";
import { Button } from "react-bootstrap";
import { IState } from "../../reducers";
import { push } from "react-router-redux";

interface IMessageProps {
    params: {
        id: string;
    };

    message: Message;
    openMessage: (messageId: string) => void;
    reply: (messageId: string) => void;
}

class MessageComponent extends React.Component<IMessageProps, void> {
    public componentDidMount() {
        this.props.openMessage(this.props.params.id);
    }

    public render() {
        const { message } = this.props;

        if (!message) {
            return <div>
                <Spinner />
            </div>;
        }

        return <GridRow>
            <GridColumn className="col-xs-12">
                <Section additionalContent={
                    <div className="pull-right clearfix">
                        <Button onClick={this._reply}>
                            <i className="fa fa-envelope-o" />&nbsp;{__("Reply")}
                        </Button>
                    </div>
                }>
                    {message.subject}
                </Section>

                <p>
                    <i className="fa fa-calendar" />&nbsp;{HumanDate(message.sentAt)}&nbsp;-&nbsp;{message.from.name}
                </p>

                <p className="message-text">
                    {message.text}
                </p>
            </GridColumn>
        </GridRow>;
    }

    @autobind
    private _reply() {
        this.props.reply(this.props.message.id);
    }
}

export default connect((state: IState) => {
    const messages = state.messages.data;

    return {
        message: messages.currentMessage
    };
}, (dispatch) => ({
    openMessage: (messageId: string) => {
        dispatch(openMessage(messageId))
    },
    reply: (replyId: string) => {
        dispatch(push(`/game/messages/compose/${replyId}`));
    }
}))(MessageComponent);