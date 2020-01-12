import * as React from "react";

import { connect } from "react-redux";
import Form, { IFormState } from "../../common/forms/form";
import {
    ControlledCheckBox,
    ControlledTextField
} from "../../common/forms/inputs";
import {
    changePassword,
    deleteAccount
} from "../../common/session/session.actions";
import { GridColumn } from "../../components/layout";
import { ProgressButton } from "../../components/ui/progressButton";
import { SubSection } from "../../components/ui/typography";

export interface IProfileProps {
    refresh: () => void;
}

export class ProfileComponent extends React.Component<IProfileProps> {
    public render(): JSX.Element {
        return (
            <GridColumn className="col-xs-12">
                <p>{__("Here you can manage your profile and settings")}</p>

                {/*
            <h2 className="headline"><span>{__("Associated Logins")}</span></h2>
            */}

                <SubSection>{__("Change Password")}</SubSection>

                <Form
                    name="account-change-password"
                    onSubmit={(formState: IFormState, options) => {
                        return changePassword(
                            {
                                oldPassword: formState.getFieldValue<string>(
                                    "oldPassword"
                                ),
                                password: formState.getFieldValue<string>(
                                    "password"
                                ),
                                passwordConfirmation: formState.getFieldValue<
                                    string
                                >("passwordConfirmation")
                            },
                            options
                        );
                    }}
                    component={({ isPending, formState }) => (
                        <div>
                            <ControlledTextField
                                type="password"
                                label={__("Old Password")}
                                fieldName="oldPassword"
                            />

                            <ControlledTextField
                                type="password"
                                label={__("Password")}
                                fieldName="password"
                            />

                            <ControlledTextField
                                type="password"
                                label={__("Password confirmation")}
                                fieldName="passwordConfirmation"
                            />

                            <ProgressButton
                                type="submit"
                                bsStyle="primary"
                                disabled={
                                    !this._changePasswordFormValid(formState)
                                }
                                isActive={isPending}
                            >
                                {__("Change password")}
                            </ProgressButton>
                        </div>
                    )}
                />

                <SubSection>{__("Delete Account")}</SubSection>

                <p>
                    <span>
                        {__(
                            "Here you can delete your account. Otherwise, if you do not login for three months, your account will be automatically deleted."
                        )}
                    </span>
                </p>

                <div className="tag-box-v3">
                    <strong>{__("Warning")}:&nbsp;</strong>
                    <span>{__("This action cannot be undone.")}</span>
                </div>

                <Form
                    name="account-delete"
                    onSubmit={(formState: IFormState, options) => {
                        return deleteAccount(
                            formState.getFieldValue<string>("password"),
                            options
                        );
                    }}
                    component={({ isPending, formState }) => (
                        <div>
                            <ControlledTextField
                                type="password"
                                label={__("Password")}
                                fieldName="password"
                            />

                            <ControlledCheckBox
                                label={__(
                                    "Yes, I really want to delete my Impera account"
                                )}
                                fieldName="confirmDelete"
                                required={true}
                            />

                            <ProgressButton
                                type="submit"
                                bsStyle="primary"
                                disabled={
                                    !this._deleteAccountFormValid(formState)
                                }
                                isActive={isPending}
                            >
                                {__("Delete Account")}
                            </ProgressButton>
                        </div>
                    )}
                />
            </GridColumn>
        );
    }

    private _changePasswordFormValid(formState: IFormState): boolean {
        const oldPassword = formState.getFieldValue("oldPassword") || "";
        const password = formState.getFieldValue("password") || "";

        return (
            oldPassword.trim() !== "" &&
            password.trim() !== "" &&
            password === formState.getFieldValue("passwordConfirmation")
        );
    }

    private _deleteAccountFormValid(formState: IFormState): boolean {
        const password = formState.getFieldValue("password") || "";

        return (
            password.trim() !== "" &&
            formState.getFieldValue("confirmDelete", false)
        );
    }
}

export default connect(
    () => {
        return {};
    },
    () => ({})
)(ProfileComponent);
