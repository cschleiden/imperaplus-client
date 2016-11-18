import "./signup.scss";

import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { IImmutable } from "immuts";

import { getClient } from "../../../clients/clientFactory";
import { AccountClient, LoginResponseModel } from "../../../external/imperaClients";

import { resetForm, changeField } from "../../../actions/forms";
import { signup } from "../../../actions/session";
import { IForms, IForm } from "../../../reducers/forms";

import { TextField, ITextFieldProps } from "office-ui-fabric-react/lib/TextField";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Checkbox, ICheckboxProps } from "office-ui-fabric-react/lib/Checkbox";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

import { wrapForm, Form, IFormProps } from "../../../components/ui/form/form";
import { ControlledCheckBox, ControlledTextField } from "../../../components/ui/form/inputs";

interface ISignupFields {
    username: string;
    email: string;
    password: string;
    passwordconfirm: string;

    accepttos: boolean;
}

class Signup extends React.PureComponent<IFormProps, void> {
    public componentDidMount() {
        this.props.reset();
    }

    public render(): JSX.Element {
        return <Grid className="signup">
            <GridRow>
                <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                    <p>
                        {__("Register a new account. It is completely free.")}
                    </p>

                    <div className="form">
                        <ControlledTextField
                            label={__("Username")}
                            placeholder={__("Enter username")}
                            fieldName="username" />
                        <ControlledTextField
                            label={__("Email")}
                            placeholder={__("Enter email")}
                            fieldName="email" />
                        <ControlledTextField
                            label={__("Password")}
                            placeholder={__("Enter password")} type="password"
                            fieldName="password" />
                        <ControlledTextField
                            label={__("Password (repeat)")}
                            placeholder={__("Repeat password")} type="password"
                            fieldName="passwordconfirm" />
                        <ControlledCheckBox
                            label={__("I agree to the TOS")}
                            fieldName="accepttos" />

                        <div className="ms-u-textAlignRight">
                            <ProgressButton
                                buttonType={ButtonType.primary}
                                disabled={!this._formValid()}
                                isActive={this.props.isPending}
                                onClick={this.props.submit}>
                                Register
                            </ProgressButton>
                        </div>
                    </div>
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

    private _formValid(): boolean {
        const fields = this.props.formState.fields;

        return fields
            && fields["username"] && fields["username"].value !== ""
            && fields["password"] && fields["passwordconfirm"] && fields["password"].value !== "" && fields["password"].value === fields["passwordconfirm"].value
            && fields["accepttos"] && fields["accepttos"].value === true;
    }
}

export default wrapForm<ISignupFields>({
    name: "signup",
    onSubmit: (formState: IForm) => {
        return getClient(AccountClient).register({
            userName: formState.fields["username"].value as string,
            password: formState.fields["password"].value as string,
            confirmPassword: formState.fields["passwordconfirm"].value as string,
            email: formState.fields["email"].value as string,
            language: "en", // TODO: CS
            callbackUrl: "" // TODO
        });
    },
    onSubmitSuccess: () => {
        // TODO: Redirect?
    }
})(Signup);