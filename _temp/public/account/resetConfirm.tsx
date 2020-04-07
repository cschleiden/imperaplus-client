import * as React from "react";
import Form from "../../../common/forms/form";
import { ControlledTextField } from "../../../common/forms/inputs";
import { reset } from "../../../common/session/session.actions";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { ProgressButton } from "../../../components/ui/progressButton";

interface IResetConfirmationProps {
    params: {
        userId: string;
        code: string;
    };
}

export default class ResetConfirmationComponent extends React.Component<
    IResetConfirmationProps
> {
    public render() {
        return (
            <Grid>
                <GridRow>
                    <GridColumn className="col-xs-12">
                        <Form
                            name="reset-password"
                            onSubmit={(formState, options) => {
                                return reset(
                                    {
                                        userId: this.props.params.userId,
                                        code: this.props.params.code,
                                        password: formState.getFieldValue(
                                            "password"
                                        ),
                                        confirmPassword: formState.getFieldValue(
                                            "passwordconfirm"
                                        ),
                                    },
                                    options
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
                                                form.getFieldValue(
                                                    "password"
                                                ) !== value
                                            ) {
                                                return __(
                                                    "Passwords do not match"
                                                );
                                            }
                                        }}
                                        required={true}
                                    />

                                    <div>
                                        <ProgressButton
                                            type="submit"
                                            disabled={
                                                !this._formValid(formState)
                                            }
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
            </Grid>
        );
    }

    private _formValid(formState): boolean {
        return (
            formState.getFieldValue("password") &&
            formState.getFieldValue("passwordconfirm") &&
            formState.getFieldValue("password") !== "" &&
            formState.getFieldValue("password") ===
                formState.getFieldValue("passwordconfirm")
        );
    }
}
