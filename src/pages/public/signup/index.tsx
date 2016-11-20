import "./signup.scss";

import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { IImmutable } from "immuts";

import { getClient } from "../../../clients/clientFactory";
import { AccountClient, ErrorResponse } from "../../../external/imperaClients";

import { resetForm, changeField } from "../../../actions/forms";
import { signup } from "../../../actions/session";
import { IForms, IForm } from "../../../reducers/forms";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

import Form from "../../../components/ui/form/form";
import { ControlledCheckBox, ControlledTextField } from "../../../components/ui/form/inputs";

import { Test } from "./test";

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

interface ISignupState {
    error: string;
}

export class SignupComponent extends React.Component<ISignupProps, ISignupState> {
    constructor(props, context) {
        super(props, context);

        console.log("ctor");

        this.state = {
            error: null
        };
    }

    private _clearError = () => {
        this.setState({
            error: null
        });
    }

    public componentDidMount() {
        console.log("mount");
    }

    public render(): JSX.Element {
        let error: JSX.Element;
        if (!!this.state.error) {
            error = <MessageBar messageBarType={MessageBarType.error} onDismiss={this._clearError}>
                {this.state.error}
            </MessageBar>;
        }

        return <Grid className="signup">
            <GridRow>
                {error}
            </GridRow>

            <GridRow>
                <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                    <Test />

                    <p>
                        {__("Register a new account. It is completely free.1")}
                    </p>

                    <Form
                        name="signup"
                        onSubmit={(formState: IForm) => {
                            return getClient(AccountClient).register({
                                userName: formState.fields["username"].value as string,
                                password: formState.fields["password"].value as string,
                                confirmPassword: formState.fields["passwordconfirm"].value as string,
                                email: formState.fields["email"].value as string,
                                language: "en", // TODO: CS
                                callbackUrl: "" // TODO
                            });
                        } }
                        onSubmitSuccess={this._onSubmitSucess}
                        onSubmitFailed={this._onSubmitFail}
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

    private _onSubmitFail = (error: ErrorResponse) => {
        this.setState({
            error: error.error
        });
    }
}

export default connect(state => ({}), {})(SignupComponent);
