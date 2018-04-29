import * as React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { GridColumn, GridRow } from "../../components/layout/index";
import { HumanDate } from "../../components/ui/humanDate";
import { Spinner } from "../../components/ui/spinner";
import { Section } from "../../components/ui/typography";
import { UserRef } from "../../components/ui/userReference";
import { Message } from "../../external/imperaClients";
import { autobind } from "../../lib/autobind";
import { IState } from "../../reducers";
import "./message.scss";
import { openMessage } from "./messages.actions";

interface IMessageProps {
    params: {
        id: string;
    };

    message: Message;
    openMessage: (messageId: string) => void;
    reply: (messageId: string) => void;
}

class MessageComponent extends React.Component<IMessageProps> {
    public componentDidMount() {
        this.props.openMessage(this.props.params.id);
    }

    public render() {
        const { message } = this.props;

        if (!message) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <GridRow>
                <GridColumn className="col-xs-12">
                    <Section
                        additionalContent={
                            <div
                                className="pull-right clearfix"
                            >
                                <Button
                                    onClick={this._reply}
                                >
                                    <i className="fa fa-envelope-o" />&nbsp;{__("Reply")}
                                </Button>
                            </div>
                        }
                    >
                        {message.subject}
                    </Section>

                    <p>
                        <i className="fa fa-calendar" />&nbsp;{HumanDate(message.sentAt)}&nbsp;-&nbsp;<UserRef userRef={message.from} />
                    </p>

                    <p className="message-text">
                        {message.text}
                    </p>
                </GridColumn>
            </GridRow>
        );
    }

    @autobind
    private _reply() {
        this.props.reply(this.props.message.id);
    }
}

export default connect((state: IState) => {
    const messages = state.messages;

    return {
        message: messages.currentMessage
    };
}, (dispatch) => ({
    openMessage: (messageId: string) => {
        dispatch(openMessage(messageId));
    },
    reply: (replyId: string) => {
        dispatch(push(`/game/messages/compose/${replyId}`));
    }
}))(MessageComponent);