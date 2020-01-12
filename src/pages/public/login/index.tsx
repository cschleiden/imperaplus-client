import * as React from "react";
import { DispatchProp, connect } from "react-redux";
import Form, { IFormState } from "../../../common/forms/form";
import { ControlledTextField } from "../../../common/forms/inputs";
import { login } from "../../../common/session/session.actions";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { ProgressButton } from "../../../components/ui/progressButton";
import LinkString from "../../../components/ui/strLink";
import "./login.scss";

const _formValid = (formState): boolean => {
    return (
        formState.getFieldValue("username") &&
        formState.getFieldValue("password")
    );
};

class LoginComponent extends React.Component<DispatchProp<any>> {
    public render() {
        return (
            <Grid className="login">
                <GridRow>
                    <GridColumn className="col-md-6 col-xs-12 col-border-right">
                        <p>{__("Sign in using your Impera account...")}</p>

                        <Form
                            name="login"
                            onSubmit={(formState: IFormState, options) => {
                                return login(
                                    {
                                        username: formState.getFieldValue(
                                            "username"
                                        ),
                                        password: formState.getFieldValue(
                                            "password"
                                        )
                                    },
                                    options
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

                                    <div className="ms-u-textAlignRight">
                                        <ProgressButton
                                            type="submit"
                                            disabled={!_formValid(formState)}
                                            isActive={isPending}
                                            bsStyle="primary"
                                        >
                                            {__("Login")}
                                        </ProgressButton>
                                    </div>
                                </div>
                            )}
                        />
                    </GridColumn>
                    <GridColumn className="col-md-6 col-xs-12 external">
                        <p>{__("...or with an external account.")}</p>

                        <ul className="list-unstyled">
                            {/*<li>
                            <Button block bsStyle="primary">Facebook</Button>
                        </li>
                        <li>
                            <Button block bsStyle="primary">Microsoft</Button>
                        </li>*/}
                            <li>{__("Coming soon..")}</li>
                        </ul>
                    </GridColumn>
                </GridRow>

                <GridRow className="text-center">
                    <GridColumn className="col-xs-12">
                        {LinkString({
                            link: __(
                                "[Reset](/reset) your password or [create](/signup) a new account."
                            )
                        })}
                    </GridColumn>
                </GridRow>
            </Grid>
        );
    }
}

export default connect()(LoginComponent);
