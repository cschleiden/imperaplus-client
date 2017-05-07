import * as React from "react";
import { connect } from "react-redux";
import Form from "../../../common/forms/form";
import { ControlledTextField } from "../../../common/forms/inputs";
import { activate, reset, signup } from "../../../common/session/session.actions";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Spinner } from "../../../components/ui/spinner";
import { Title } from "../../../components/ui/typography";
import { setDocumentTitle } from "../../../lib/title";

interface IResetConfirmationProps {
    params: {
        userId: string;
        code: string;
    };
}

export default class ResetConfirmationComponent extends React.Component<IResetConfirmationProps, void> {
    public componentDidMount() {
        setDocumentTitle(__("Reset password"));
    }

    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <Title>
                        {__("Reset password")}
                    </Title>

                    <Form
                        name="reset-password"
                        onSubmit={((formState, options) => {
                            return reset({
                                userId: this.props.params.userId,
                                code: this.props.params.code,
                                password: formState.getFieldValue("password"),
                                confirmPassword: formState.getFieldValue("passwordconfirm")
                            }, options);
                        })}
                        component={({ isPending, submit, formState }) => (
                            <div className="form">
                                <ControlledTextField
                                    label={__("Password")}
                                    placeholder={__("Enter password")} type="password"
                                    fieldName="password"
                                    required={true} />
                                <ControlledTextField
                                    label={__("Password (repeat)")}
                                    placeholder={__("Repeat password")} type="password"
                                    fieldName="passwordconfirm"
                                    validate={(value: string, form) => {
                                        if (form.getFieldValue("password") !== value) {
                                            return __("Passwords do not match");
                                        }
                                    }}
                                    required={true} />

                                <div>
                                    <ProgressButton
                                        type="submit"
                                        disabled={!this._formValid(formState)}
                                        isActive={isPending}
                                        bsStyle="primary">
                                        {__("Reset")}
                                    </ProgressButton>
                                </div>
                            </div>)} />
                </GridColumn>
            </GridRow>
        </Grid>;
    }

    private _formValid(formState): boolean {
        return formState.getFieldValue("password")
            && formState.getFieldValue("passwordconfirm")
            && formState.getFieldValue("password") !== ""
            && formState.getFieldValue("password") === formState.getFieldValue("passwordconfirm");
    }
}