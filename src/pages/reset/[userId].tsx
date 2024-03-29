import * as React from "react";
import { GridColumn, GridRow } from "../../components/layout";
import { ProgressButton } from "../../components/ui/progressButton";
import __ from "../../i18n/i18n";
import Form from "../../lib/domain/shared/forms/form";
import { ControlledTextField } from "../../lib/domain/shared/forms/inputs";
import { reset } from "../../lib/domain/shared/session/session.slice";
import { AppNextPage } from "../../store";

interface IResetConfirmationProps {
    userId: string;
    code: string;
}

function _formValid(formState): boolean {
    return (
        formState.getFieldValue("password") &&
        formState.getFieldValue("passwordconfirm") &&
        formState.getFieldValue("password") !== "" &&
        formState.getFieldValue("password") ===
            formState.getFieldValue("passwordconfirm")
    );
}

const ResetConfirmation: AppNextPage<IResetConfirmationProps> = (props) => {
    return (
        <GridRow>
            <GridColumn className="col-xs-12 col-md-6 col-md-push-3">
                <Form
                    name="reset-password"
                    onSubmit={async (formState, dispatch) => {
                        await dispatch(
                            reset({
                                userId: props.userId,
                                code: props.code,
                                password: formState.getFieldValue("password"),
                                confirmPassword:
                                    formState.getFieldValue("passwordconfirm"),
                            })
                        );
                    }}
                    component={({ isPending, submit, formState }) => (
                        <div className="form">
                            <ControlledTextField
                                label={__("Password")}
                                placeholder={__("Enter password")}
                                type="password"
                                fieldName="password"
                                required={true}
                            />
                            <ControlledTextField
                                label={__("Password (repeat)")}
                                placeholder={__("Repeat password")}
                                type="password"
                                fieldName="passwordconfirm"
                                validate={(value: string, form) => {
                                    if (
                                        form.getFieldValue("password") !== value
                                    ) {
                                        return __("Passwords do not match");
                                    }
                                }}
                                required={true}
                            />

                            <div>
                                <ProgressButton
                                    type="submit"
                                    disabled={!_formValid(formState)}
                                    isActive={isPending}
                                    bsStyle="primary"
                                >
                                    {__("Reset")}
                                </ProgressButton>
                            </div>
                        </div>
                    )}
                />
            </GridColumn>
        </GridRow>
    );
};

ResetConfirmation.getTitle = () => __("Password Reset");
ResetConfirmation.getInitialProps = (ctx) => {
    return {
        userId: ctx.query["userId"] as string,
        code: ctx.query["c"] as string,
    };
};

export default ResetConfirmation;
