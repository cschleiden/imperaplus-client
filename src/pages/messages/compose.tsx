import * as React from "react";
import { connect } from "react-redux";
import { FormGroup, ControlLabel } from "react-bootstrap";
import { GridRow, GridColumn } from "../../components/layout/index";
import Form, { IFormState } from "../../common/forms/form";
import { ProgressButton } from "../../components/ui/progressButton";
import { ControlledTextField, ControlledUserPicker } from "../../common/forms/inputs";
import { IState } from "../../reducers";
import { UserPicker } from "../../components/misc/userPicker";
import { SendMessage } from "../../external/imperaClients";
import { sendMessage } from "./messages.actions";

interface IComposeProps {
}

class ComposeComponent extends React.Component<IComposeProps, void> {
    public render() {
        return <GridRow>
            <GridColumn className="col-xs-12">
                <Form
                    name="messages-compose"
                    onSubmit={(formState: IFormState, options) => {
                        return sendMessage({
                            to: formState.getFieldValue("user"),
                            subject: formState.getFieldValue("subject"),
                            text: formState.getFieldValue("text")
                        });
                    }}
                    component={(({ isPending, submit, formState }) => (
                        <div>
                            <ControlledUserPicker
                                label={__("User")}
                                fieldName="user"
                            />

                            <ControlledTextField
                                label={__("Subject")}
                                placeholder={__("Subject")}
                                fieldName="subject"
                                required={true} />

                            <ControlledTextField
                                label={__("Text")}
                                placeholder={__("Text")}
                                fieldName="text"
                                required={true}
                                componentClass="textarea"
                                style={{
                                    "resize": "vertical"
                                }}
                                rows={10} />

                            <div className="pull-right clearfix">
                                <ProgressButton
                                    type="submit"
                                    bsStyle="primary"
                                    disabled={!this._formValid(formState)}
                                    isActive={isPending}>
                                    {__("Send")}
                                </ProgressButton>
                            </div>
                        </div>
                    ))} />
            </GridColumn>
        </GridRow>;
    }

    private _formValid(formState: IFormState): boolean {
        return formState.getFieldValue("user")
            && formState.getFieldValue("subject")
            && formState.getFieldValue("text");
    }
}

export default connect((state: IState) => {
    const messages = state.messages.data;

    return {
    };
}, (dispatch) => ({
}))(ComposeComponent);