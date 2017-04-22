import "./signup.scss";

import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { IImmutable } from "immuts";

import { AccountClient, ErrorResponse } from "../../../external/imperaClients";
import { ErrorCodes } from "../../../i18n/errorCodes";

import { signup } from "../../../common/session/session.actions";

import { Button } from "react-bootstrap";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

import Form from "../../../common/forms/form";
import { ControlledCheckBox, ControlledTextField } from "../../../common/forms/inputs";
import LinkString from "../../../components/ui/strLink";
import { setDocumentTitle } from "../../../lib/title";

interface ISignupFields {
    username: string;
    email: string;
    password: string;
    passwordconfirm: string;

    accepttos: boolean;
}

interface ISignupProps {
    dispatch: Function;
}

export class SignupComponent extends React.Component<ISignupProps, void> {
    public componentDidMount() {
        setDocumentTitle(__("Signup"));
    }

    public render(): JSX.Element {
        return <Grid className="signup">
            <GridRow>
                <GridColumn className="col-md-6 col-xs-12 col-border-right">
                    <p>
                        {__("Register a new account. It is completely free.")}
                    </p>

                    <Form
                        name="signup"
                        onSubmit={((formState, options) => {
                            return signup({
                                username: formState.getFieldValue("username"),
                                password: formState.getFieldValue("password"),
                                passwordConfirm: formState.getFieldValue("passwordconfirm"),
                                email: formState.getFieldValue("email")
                            }, options);
                        })}
                        component={({ isPending, submit, formState }) => (
                            <div className="form">
                                <ControlledTextField
                                    label={__("Username")}
                                    placeholder={__("Enter username")}
                                    fieldName="username"
                                    required={true} />
                                <ControlledTextField
                                    label={__("Email")}
                                    placeholder={__("Enter email")}
                                    fieldName="email"
                                    required={true} />
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
                                    } }
                                    required={true} />
                                <ControlledCheckBox
                                    label={__("I agree to the TOS")}
                                    fieldName="accepttos" />

                                <div className="ms-u-textAlignRight">
                                    <ProgressButton
                                        type="submit"
                                        disabled={!this._formValid(formState)}
                                        isActive={isPending}
                                        bsStyle="primary">
                                        {__("Register")}
                                    </ProgressButton>
                                </div>
                            </div>)} />
                </GridColumn>
                <GridColumn className="col-md-6 col-xs-12 external">
                    <p>
                        {__("Or sign in using an existing account.")}
                    </p>

                    <ul className="list-unstyled">
                        <li>
                            <Button block bsStyle="primary">Facebook</Button>
                        </li>
                        <li>
                            <Button block bsStyle="primary">Microsoft</Button>
                        </li>
                    </ul>
                </GridColumn>
            </GridRow>

            <GridRow className="text-center">
                <GridColumn className="col-xs-12">
                    {LinkString({
                        link: __("[Recover](/recover) your password or [create](/signup) a new account.")
                    })}
                </GridColumn>
            </GridRow>
        </Grid>;
    }

    private _formValid(formState): boolean {
        return formState.getFieldValue("username")
            && formState.getFieldValue("password") && formState.getFieldValue("passwordconfirm") && formState.getFieldValue("password") !== "" && formState.getFieldValue("password") === formState.getFieldValue("passwordconfirm")
            && formState.getFieldValue("accepttos", false);
    }

    private _onSubmitSucess = () => {
        this.props.dispatch(push("signup/confirmation"));
    }
}

export default connect(state => ({}), {})(SignupComponent);