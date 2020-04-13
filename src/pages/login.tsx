import * as React from "react";
import { Grid, GridColumn, GridRow } from "../components/layout";
import { ProgressButton } from "../components/ui/progressButton";
import { LinkString } from "../components/ui/strLink";
import { baseUri } from "../configuration";
import __ from "../i18n/i18n";
import Form, { IFormState } from "../lib/domain/shared/forms/form";
import { ControlledTextField } from "../lib/domain/shared/forms/inputs";
import { doLogin } from "../lib/domain/shared/session/session.actions";
import { AppNextPage } from "../store";

const _formValid = (formState: IFormState): boolean => {
    return (
        formState.getFieldValue("username") &&
        formState.getFieldValue("password")
    );
};

const Page: AppNextPage = () => (
    <Grid className="login">
        <GridRow>
            <GridColumn className="col-md-push-3 col-md-6 col-xs-12">
                <p>{__("Sign in using your Impera account...")}</p>

                <Form
                    name="login"
                    onSubmit={async (formState, dispatch, getState, extra) => {
                        await doLogin(dispatch, getState, extra, {
                            username: formState.getFieldValue("username"),
                            password: formState.getFieldValue("password"),
                        });
                    }}
                    component={({ isPending, formState }) => (
                        <div className="form">
                            <ControlledTextField
                                label={__("Username")}
                                placeholder={__("Enter username")}
                                fieldName="username"
                                required={true}
                                initialValue={
                                    baseUri.indexOf("localhost") != -1
                                        ? "digitald"
                                        : undefined
                                }
                            />
                            <ControlledTextField
                                label={__("Password")}
                                placeholder={__("Enter password")}
                                type="password"
                                fieldName="password"
                                required={true}
                                initialValue={
                                    baseUri.indexOf("localhost") != -1
                                        ? "impera1234"
                                        : undefined
                                }
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
        </GridRow>

        <GridRow className="text-center">
            <GridColumn className="col-xs-12">
                {LinkString({
                    link: __(
                        "[Reset](/reset) your password or [create](/signup) a new account."
                    ),
                })}
            </GridColumn>
        </GridRow>
    </Grid>
);

Page.getTitle = () => __("Login");

export default Page;
