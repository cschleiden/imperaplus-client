import "./login.scss";

import * as React from "react";
import { connect } from "react-redux";

import { login } from "../../../common/session/session.actions";

import Form from "../../../common/forms/form";
import { IForm } from "../../../common/forms/forms.reducer";

import { ControlledCheckBox, ControlledTextField } from "../../../common/forms/inputs";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

export const LoginComponent = (props) => {
    return <Grid className="login">
        <GridRow>
            <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                <p>
                    {__("Sign in using your Impera account...")}
                </p>

                <Form
                    name="login"
                    onSubmit={((formState: IForm, options) => {
                        return login({
                            username: formState.fields["username"].value as string,
                            password: formState.fields["password"].value as string
                        }, options);
                    })}
                    component={(({ isPending, submit, formState }) => (
                        <div className="form">
                            <ControlledTextField
                                label={__("Username")}
                                placeholder={__("Enter username")}
                                fieldName="username"
                                required={true} />
                            <ControlledTextField
                                label={__("Password")}
                                placeholder={__("Enter password")} type="password"
                                fieldName="password"
                                required={true} />

                            <div className="ms-u-textAlignRight">
                                <ProgressButton
                                    buttonType={ButtonType.primary}
                                    isActive={isPending}>
                                    {__("Login")}
                                </ProgressButton>
                            </div>
                        </div>
                    ))} />
            </GridColumn>
            <GridColumn className="ms-u-md6 ms-u-sm12 external">
                <p>
                    ...or with an external account.
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
};

export default connect()(LoginComponent);