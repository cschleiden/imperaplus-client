import "./signup.scss";

import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { IImmutable } from "immuts";

import { getClient } from "../../../clients/clientFactory";
import { AccountClient, ErrorResponse } from "../../../external/imperaClients";
import { ErrorCodes } from "../../../i18n/errorCodes";

import { resetForm, changeField } from "../../../actions/forms";
import { signup } from "../../../actions/session";
import { IForms, IForm } from "../../../reducers/forms";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

import Form from "../../../components/ui/form/form";
import { ControlledCheckBox, ControlledTextField } from "../../../components/ui/form/inputs";

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
        return <Grid className="signup">
            <GridRow>
                <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                    <p>
                        {__("Register a new account. It is completely free.")}
                    </p>

                    <Form
                        name="signup"
                        onSubmit={((formState: IForm, options) => {
                            return signup({
                                username: formState.fields["username"].value as string,
                                password: formState.fields["password"].value as string,
                                passwordConfirm: formState.fields["passwordconfirm"].value as string,
                                email: formState.fields["email"].value as string
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
                                    validate={(value: string, formState: IForm) => {
                                        if (formState.fields["password"] && formState.fields["password"].value !== value) {
                                            return __("Passwords do not match");
                                        }
                                    } }
                                    required={true} />
                                <ControlledCheckBox
                                    label={__("I agree to the TOS")}
                                    fieldName="accepttos" />

                                <div className="ms-u-textAlignRight">
                                    <ProgressButton
                                        buttonType={ButtonType.primary}
                                        disabled={!this._formValid(formState)}
                                        isActive={isPending}>
                                        {__("Register")}
                                    </ProgressButton>
                                </div>
                            </div>)} />
                </GridColumn>
                <GridColumn className="ms-u-md6 ms-u-sm12 external">
                    <p>
                        {__("Or sign in using an existing account.")}
                    </p>

                    <ul>
                        <li>
                            <Button buttonType={ButtonType.primary}>Facebook</Button>
                        </li>
                        <li>
                            <Button buttonType={ButtonType.primary}>Microsoft</Button>
                        </li>
                    </ul>
                </GridColumn>
            </GridRow>

            <GridRow className="ms-u-textAlignCenter">
                {__("Recover your password or create a new account.")}
            </GridRow>
        </Grid>;
    }

    private _formValid(formState: IForm): boolean {
        const { fields } = formState;

        return fields
            && fields["username"] && fields["username"].value !== ""
            && fields["password"] && fields["passwordconfirm"] && fields["password"].value !== "" && fields["password"].value === fields["passwordconfirm"].value
            && fields["accepttos"] && fields["accepttos"].value === true;
    }

    private _onSubmitSucess = () => {
        this.props.dispatch(push("signup/confirmation"));
    }
}

export default connect(state => ({}), {})(SignupComponent);