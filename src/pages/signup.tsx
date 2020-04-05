import Router from "next/router";
import * as React from "react";
import { ControlLabel } from "react-bootstrap";
import { Grid, GridColumn, GridRow } from "../components/layout";
import { ProgressButton } from "../components/ui/progressButton";
import { LinkString } from "../components/ui/strLink";
import { baseUri } from "../configuration";
import { FixedAccountClient } from "../external/accountClient";
import __ from "../i18n/i18n";
import Form, { IFormState } from "../lib/domain/shared/forms/form";
import {
    ControlledCheckBox,
    ControlledDropdown,
    ControlledTextField,
} from "../lib/domain/shared/forms/inputs";
import {
    MessageType,
    showMessage,
} from "../lib/domain/shared/message/message.slice";
import { IState } from "../reducers";
import { getTokenProvider } from "../services/tokenProvider";
import { AppDispatch, AppNextPage, ThunkExtra } from "../store";

function range(start: number, count: number) {
    return Array.apply(0, Array(count)).map(function(element, index) {
        return index + start;
    });
}

function isFormValid(formState: IFormState): boolean {
    return (
        formState.getFieldValue("username") &&
        formState.getFieldValue("password") &&
        formState.getFieldValue("passwordconfirm") &&
        formState.getFieldValue("password") !== "" &&
        formState.getFieldValue("password") ===
            formState.getFieldValue("passwordconfirm") &&
        formState.getFieldValue("day") > 0 &&
        formState.getFieldValue("month") > 0 &&
        formState.getFieldValue("year") &&
        formState.getFieldValue("accepttos", false)
    );
}

const Page: AppNextPage = () => {
    if (process.browser) {
        if (document.cookie.indexOf("age_block=") !== -1) {
            return (
                <Grid className="signup">
                    <GridRow>
                        <GridColumn className="col-xs-12">
                            {__(
                                "You have to be 13 years or older to play Impera."
                            )}
                        </GridColumn>
                    </GridRow>
                </Grid>
            );
        }
    }

    return (
        <Grid className="signup">
            <GridRow>
                <GridColumn className="col-md-6 col-xs-12">
                    <p>
                        {__("Register a new account. It is completely free.")}
                    </p>

                    <Form
                        name="signup"
                        onSubmit={async (
                            formState: IFormState,
                            dispatch: AppDispatch,
                            getState: () => IState,
                            extra: ThunkExtra
                        ) => {
                            const input = {
                                username: formState.getFieldValue("username"),
                                password: formState.getFieldValue("password"),
                                passwordConfirm: formState.getFieldValue(
                                    "passwordconfirm"
                                ),
                                email: formState.getFieldValue("email"),
                                day: formState.getFieldValue("day"),
                                month: formState.getFieldValue("month"),
                                year: formState.getFieldValue("year"),
                            };

                            const birthdate = new Date(
                                input.year,
                                input.month,
                                input.day
                            );
                            const ageDiffMs = Date.now() - birthdate.getTime();
                            const ageDate = new Date(ageDiffMs);
                            const age = Math.abs(
                                ageDate.getUTCFullYear() - 1970
                            );

                            if (age < 13) {
                                Router.push("/");

                                // TODO: CS: keepMessage

                                dispatch(
                                    showMessage({
                                        message: __(
                                            "You have to be 13 years or older to play Impera."
                                        ),
                                        type: MessageType.error,
                                    })
                                );

                                // Set cookie
                                document.cookie = `age_block=${input.username};path=/`;

                                return;
                            }

                            extra
                                .getCachedClient(
                                    getTokenProvider(getState),
                                    FixedAccountClient
                                )
                                .register({
                                    userName: input.username,
                                    password: input.password,
                                    confirmPassword: input.passwordConfirm,
                                    email: input.email,
                                    language:
                                        getState().session.language || "en",
                                    callbackUrl: `${baseUri}activate/userId/code`,
                                });

                            Router.push("/signup/confirmation");
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
                                    label={__("Email")}
                                    placeholder={__("Enter email")}
                                    fieldName="email"
                                    required={true}
                                />
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
                                            form.getFieldValue("password") !==
                                            value
                                        ) {
                                            return __("Passwords do not match");
                                        }
                                    }}
                                    required={true}
                                />

                                <div className="form-inline">
                                    <div className="form-group">
                                        <ControlLabel>
                                            {__("Date of birth")}
                                        </ControlLabel>
                                        <div>
                                            <ControlledDropdown fieldName="day">
                                                <option value="" />
                                                {range(1, 31).map(x => (
                                                    <option value={x} key={x}>
                                                        {x}
                                                    </option>
                                                ))}
                                            </ControlledDropdown>
                                            <ControlledDropdown fieldName="month">
                                                <option value="" />
                                                {range(1, 12).map(x => (
                                                    <option value={x} key={x}>
                                                        {x}
                                                    </option>
                                                ))}
                                            </ControlledDropdown>
                                            <ControlledDropdown fieldName="year">
                                                <option value="" />
                                                {range(
                                                    new Date().getFullYear() -
                                                        85,
                                                    85
                                                ).map(x => (
                                                    <option value={x} key={x}>
                                                        {x}
                                                    </option>
                                                ))}
                                            </ControlledDropdown>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-inline">
                                    <div className="form-group tos">
                                        <ControlledCheckBox fieldName="accepttos" />

                                        <LinkString
                                            link={__(
                                                "By selecting you agree to our [Terms of Service](/tos) and [Privacy Policy](/privacy)."
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <ProgressButton
                                        type="submit"
                                        disabled={!isFormValid(formState)}
                                        isActive={isPending}
                                        bsStyle="primary"
                                    >
                                        {__("Register")}
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
};

Page.getTitle = () => __("Signup");

export default Page;
