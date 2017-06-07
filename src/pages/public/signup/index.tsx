import "./signup.scss";

import { IImmutable } from "immuts";
import * as React from "react";
import { Button, ControlLabel, FormGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Form from "../../../common/forms/form";
import { ControlledCheckBox, ControlledDropdown, ControlledTextField } from "../../../common/forms/inputs";
import { signup } from "../../../common/session/session.actions";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { ProgressButton } from "../../../components/ui/progressButton";
import LinkString from "../../../components/ui/strLink";
import { AccountClient, ErrorResponse } from "../../../external/imperaClients";
import { ErrorCodes } from "../../../i18n/errorCodes";

function range(start: number, count: number) {
    return Array.apply(0, Array(count))
        .map(function (element, index) {
            return index + start;
        });
}

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
    public render(): JSX.Element {
        if (document.cookie.indexOf("age_block=") !== -1) {
            return <Grid className="signup">
                <GridRow>
                    <GridColumn className="col-xs-12">
                        {__("You have to be 13 years or older to play Impera.")}
                    </GridColumn>
                </GridRow>
            </Grid>;
        }

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
                                email: formState.getFieldValue("email"),
                                day: formState.getFieldValue("day"),
                                month: formState.getFieldValue("month"),
                                year: formState.getFieldValue("year")
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
                                    }}
                                    required={true} />

                                <div className="form-inline">
                                    <div className="form-group">
                                        <ControlLabel>{__("Birthdate")}</ControlLabel>
                                        <div>
                                            <ControlledDropdown
                                                fieldName="day">
                                                <option value=""></option>
                                                {
                                                    range(1, 31).map(x =>
                                                        <option value={x} key={x}>{x}</option>
                                                    )
                                                }
                                            </ControlledDropdown>
                                            <ControlledDropdown
                                                fieldName="month">
                                                <option value=""></option>
                                                {
                                                    range(1, 12).map(x =>
                                                        <option value={x} key={x}>{x}</option>
                                                    )
                                                }
                                            </ControlledDropdown>
                                            <ControlledDropdown
                                                fieldName="year">
                                                <option value=""></option>
                                                {
                                                    range(new Date().getFullYear() - 85, 85).map(x =>
                                                        <option value={x} key={x}>{x}</option>
                                                    )
                                                }
                                            </ControlledDropdown>
                                        </div>
                                    </div>
                                </div>

                                <ControlledCheckBox
                                    label={__("I agree to the TOS")}
                                    fieldName="accepttos" />

                                <div>
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
                        {/*<li>
                            <Button block bsStyle="primary">Facebook</Button>
                        </li>*/}
                        <li>
                            {__("Coming soon..")}
                        </li>
                    </ul>
                </GridColumn>
            </GridRow>

            <GridRow className="text-center">
                <GridColumn className="col-xs-12">
                    {LinkString({
                        link: __("[Reset](/reset) your password or [create](/signup) a new account.")
                    })}
                </GridColumn>
            </GridRow>
        </Grid>;
    }

    private _formValid(formState): boolean {
        return formState.getFieldValue("username")
            && formState.getFieldValue("password") && formState.getFieldValue("passwordconfirm") && formState.getFieldValue("password") !== "" && formState.getFieldValue("password") === formState.getFieldValue("passwordconfirm")
            && formState.getFieldValue("day") > 0 && formState.getFieldValue("month") > 0 && formState.getFieldValue("year")
            && formState.getFieldValue("accepttos", false);
    }

    private _onSubmitSucess = () => {
        this.props.dispatch(push("signup/confirmation"));
    }
}

export default connect(state => ({}), {})(SignupComponent);