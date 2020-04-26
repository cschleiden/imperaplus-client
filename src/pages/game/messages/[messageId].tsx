import Link from "next/link";
import Router from "next/router";
import * as React from "react";
import { Button } from "react-bootstrap";
import { GridColumn, GridRow } from "../../../components/layout";
import { HumanDate } from "../../../components/ui/humanDate";
import { Spinner } from "../../../components/ui/spinner";
import { Section } from "../../../components/ui/typography";
import { UserRef } from "../../../components/ui/userReference";
import { Message } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { fetchMessage } from "../../../lib/domain/game/messages.slice";
import { AppNextPage } from "../../../store";
import style from "./message.module.scss";

interface IMessageProps {
    message: Message;
}

const MessageView: AppNextPage<IMessageProps> = (props) => {
    const { message } = props;

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
                        <div className="pull-right clearfix">
                            <Link
                                href={`/game/messages/compose?replyId=${message.id}`}
                            >
                                <Button>
                                    <i className="fa fa-envelope-o" />
                                    &nbsp;{__("Reply")}
                                </Button>
                            </Link>
                        </div>
                    }
                >
                    {message.subject}
                </Section>

                <p>
                    <i className="fa fa-calendar" />
                    &nbsp;{HumanDate(message.sentAt)}&nbsp;-&nbsp;
                    <UserRef userRef={message.from} />
                </p>

                <p className={style.messageText}>{message.text}</p>
            </GridColumn>
        </GridRow>
    );
};

MessageView.needsLogin = true;
MessageView.getTitle = () => __("Message");
MessageView.getInitialProps = async (ctx) => {
    const messageId = ctx.query["messageId"] as string;
    if (!messageId) {
        Router.push("/game");
    }

    await ctx.store.dispatch(fetchMessage(messageId));

    return {
        message: ctx.store.getState().messages.currentMessage,
    };
};

export default MessageView;
