import * as React from "react";
import { ProgressButton } from "../../components/ui/progressButton";
import { SubSection } from "../../components/ui/typography";
import __ from "../../i18n/i18n";
import Form, { IFormState } from "../../lib/domain/shared/forms/form";
import {
    ControlledCheckBox,
    ControlledTextField,
} from "../../lib/domain/shared/forms/inputs";
import {
    changePassword,
    deleteAccount,
} from "../../lib/domain/shared/session/session.slice";
import { AppNextPage } from "../../store";

function _changePasswordFormValid(formState: IFormState): boolean {
    const oldPassword = formState.getFieldValue("oldPassword") || "";
    const password = formState.getFieldValue("password") || "";

    return (
        oldPassword.trim() !== "" &&
        password.trim() !== "" &&
        password === formState.getFieldValue("passwordConfirmation")
    );
}

function _deleteAccountFormValid(formState: IFormState): boolean {
    const password = formState.getFieldValue("password") || "";

    return (
        password.trim() !== "" &&
        formState.getFieldValue("confirmDelete", false)
    );
}

const Profile: AppNextPage = () => {
    return (
        <>
            <p>{__("Here you can manage your profile and settings")}</p>

            {/*
            <h2 className="headline"><span>{__("Associated Logins")}</span></h2>
            */}

            <SubSection>{__("Change Password")}</SubSection>

            <Form
                name="account-change-password"
                onSubmit={async (formState: IFormState, dispatch) => {
                    await dispatch(
                        changePassword({
                            oldPassword:
                                formState.getFieldValue<string>("oldPassword"),
                            password:
                                formState.getFieldValue<string>("password"),
                            passwordConfirmation:
                                formState.getFieldValue<string>(
                                    "passwordConfirmation"
                                ),
                        })
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
                            disabled={!_changePasswordFormValid(formState)}
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
                onSubmit={async (formState, dispatch) => {
                    await dispatch(
                        deleteAccount(
                            formState.getFieldValue<string>("password")
                        )
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
                            disabled={!_deleteAccountFormValid(formState)}
                            isActive={isPending}
                        >
                            {__("Delete Account")}
                        </ProgressButton>
                    </div>
                )}
            />
        </>
    );
};

Profile.getTitle = () => __("Profile");
Profile.needsLogin = true;

export default Profile;
