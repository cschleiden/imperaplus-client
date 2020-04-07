import * as React from "react";
import { connect } from "react-redux";
import Form, { IFormState } from "../../common/forms/form";
import {
    ControlledTextField,
    ControlledUserPicker,
} from "../../common/forms/inputs";
import { GridColumn, GridRow } from "../../components/layout/index";
import { ProgressButton } from "../../components/ui/progressButton";
import { Message } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { sendMessage } from "./messages.actions";

interface IOwnProps {
    params: {
        replyId?: string;
    };
}

interface IComposeProps {
    replyTo: Message;
}

class ComposeComponent extends React.Component<IComposeProps & IOwnProps> {
    public render() {
        const { replyTo } = this.props;

        return (
            <GridRow>
                <GridColumn className="col-xs-12">
                    <Form
                        name="messages-compose"
                        onSubmit={(formState: IFormState, options) => {
                            return sendMessage(
                                {
                                    to: formState.getFieldValue("user"),
                                    subject: formState.getFieldValue("subject"),
                                    text: formState.getFieldValue("text"),
                                },
                                options
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
                                        replyTo &&
                                        `${__("RE:")} ${replyTo.subject}`
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
                                        replyTo &&
                                        `\n\n---------\n${replyTo.text}`
                                    }
                                />

                                <div className="pull-right clearfix">
                                    <ProgressButton
                                        type="submit"
                                        bsStyle="primary"
                                        disabled={!this._formValid(formState)}
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
    }

    private _formValid(formState: IFormState): boolean {
        return (
            formState.getFieldValue("user") &&
            formState.getFieldValue("subject") &&
            formState.getFieldValue("text")
        );
    }
}

export default connect(
    (state: IState, ownProps: IOwnProps) => {
        const messages = state.messages;

        let replyTo: Message;
        if (ownProps && ownProps.params && ownProps.params.replyId) {
            if (
                messages.currentMessage &&
                messages.currentMessage.id === ownProps.params.replyId
            ) {
                replyTo = messages.currentMessage;
            }
        }

        return {
            replyTo,
        };
    },
    (dispatch) => ({})
)(ComposeComponent);
