import * as React from "react";
import { GridColumn, GridRow } from "../components/layout";
import { ProgressButton } from "../components/ui/progressButton";
import __ from "../i18n/i18n";
import Form, { IFormState } from "../lib/domain/shared/forms/form";
import { ControlledTextField } from "../lib/domain/shared/forms/inputs";
import { resendConfirmation } from "../lib/domain/shared/session/session.slice";
import { AppNextPage } from "../store";

function _formValid(formState): boolean {
    return (
        formState.getFieldValue("username") &&
        formState.getFieldValue("password")
    );
}

const ResendConfirmation: AppNextPage = () => {
    return (
        <GridRow>
            <GridColumn className="col-xs-12 col-md-6 col-md-push-3">
                <Form
                    name="resend-confirmation"
                    onSubmit={async (formState: IFormState, dispatch) => {
                        await dispatch(
                            resendConfirmation({
                                username: formState.getFieldValue("username"),
                                password: formState.getFieldValue("password"),
                            })
                        );
                    }}
                    component={({ isPending, submit, formState }) => (
                        <div className="form">
                            <ControlledTextField
                                label={__("Username")}
                                placeholder={__("Enter username")}
                                fieldName="username"
                                required={true}
                            />
                            <ControlledTextField
                                label={__("Password")}
                                placeholder={__("Enter password")}
                                type="password"
                                fieldName="password"
                                required={true}
                            />

                            <div className="pull-right">
                                <ProgressButton
                                    type="submit"
                                    disabled={!_formValid(formState)}
                                    isActive={isPending}
                                    bsStyle="primary"
                                >
                                    {__("Resend")}
                                </ProgressButton>
                            </div>
                        </div>
                    )}
                />
            </GridColumn>
        </GridRow>
    );
};

ResendConfirmation.getTitle = () => __("Resend Confirmation");

export default ResendConfirmation;
