import * as React from "react";
import { GridColumn, GridRow } from "../../../components/layout";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Message } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { fetch, sendMessage } from "../../../lib/domain/game/messages.slice";
import Form, { IFormState } from "../../../lib/domain/shared/forms/form";
import {
    ControlledTextField,
    ControlledUserPicker,
} from "../../../lib/domain/shared/forms/inputs";
import { AppNextPage } from "../../../store";

function _formValid(formState: IFormState): boolean {
    return (
        formState.getFieldValue("user") &&
        formState.getFieldValue("subject") &&
        formState.getFieldValue("text")
    );
}

interface IComposeProps {
    replyTo: Message;
}

const Compose: AppNextPage<IComposeProps> = (props) => {
    const { replyTo } = props;

    return (
        <GridRow>
            <GridColumn className="col-xs-12">
                <Form
                    name="messages-compose"
                    onSubmit={async (formState, dispatch) => {
                        await dispatch(
                            sendMessage({
                                to: formState.getFieldValue("user"),
                                subject: formState.getFieldValue("subject"),
                                text: formState.getFieldValue("text"),
                            })
                        );
                    }}
                    component={({ isPending, submit, formState }) => (
                        <div>
                            <ControlledUserPicker
                                label={__("User")}
                                fieldName="user"
                                initialValue={replyTo && replyTo.from}
                            />

                            <ControlledTextField
                                label={__("Subject")}
                                placeholder={__("Subject")}
                                fieldName="subject"
                                required={true}
                                initialValue={
                                    replyTo && `${__("RE:")} ${replyTo.subject}`
                                }
                            />

                            <ControlledTextField
                                label={__("Text")}
                                placeholder={__("Text")}
                                fieldName="text"
                                required={true}
                                componentClass="textarea"
                                style={{
                                    resize: "vertical",
                                }}
                                rows={10}
                                initialValue={
                                    replyTo && `\n\n---------\n${replyTo.text}`
                                }
                            />

                            <div className="pull-right clearfix">
                                <ProgressButton
                                    type="submit"
                                    bsStyle="primary"
                                    disabled={!_formValid(formState)}
                                    isActive={isPending}
                                >
                                    {__("Send")}
                                </ProgressButton>
                            </div>
                        </div>
                    )}
                />
            </GridColumn>
        </GridRow>
    );
};

Compose.needsLogin = true;
Compose.getTitle = () => __("Compose");
Compose.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(fetch());

    const state = ctx.store.getState();

    let replyTo: Message;
    if (ctx.query["replyId"]) {
        // This only works if you're coming from the previous message, but good enough for now
        const replyId = ctx.query["replyId"] as string;

        if (
            state.messages.currentMessage &&
            state.messages.currentMessage.id === replyId
        ) {
            replyTo = state.messages.currentMessage;
        }
    }

    return {
        replyTo,
    };
};

export default Compose;
