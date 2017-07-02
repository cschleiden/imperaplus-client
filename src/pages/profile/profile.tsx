import * as React from "react";

import { connect } from "react-redux";
import Form, { IFormState } from "../../common/forms/form";
import { ControlledCheckBox, ControlledTextField } from "../../common/forms/inputs";
import { changePassword } from "../../common/session/session.actions";
import { GridColumn } from "../../components/layout";
import { ProgressButton } from "../../components/ui/progressButton";
import { Section, SubSection, Title } from "../../components/ui/typography";
import { IState } from "../../reducers";

export interface IProfileProps {
    refresh: () => void;
}

export class ProfileComponent extends React.Component<IProfileProps, void> {
    public render(): JSX.Element {
        return <GridColumn className="col-xs-12">
            <p className="lead"><span>{__("Here you can manage your profile and settings")}</span></p>

            {/*
            <h2 className="headline"><span>{__("Associated Logins")}</span></h2>
            */}

            <SubSection>{__("Change Password")}</SubSection>

            <Form
                name="account-change-password"
                onSubmit={(formState: IFormState, options) => {
                    return changePassword({
                        oldPassword: formState.getFieldValue<string>("oldPassword"),
                        password: formState.getFieldValue<string>("password"),
                        passwordConfirmation: formState.getFieldValue<string>("passwordConfirmation")
                    }, options);
                }}
                component={(({ isPending, submit, formState }) => (
                    <div>
                        <ControlledTextField
                            type="password"
                            label={__("Old Password")}
                            fieldName="oldPassword" />

                        <ControlledTextField
                            type="password"
                            label={__("Password")}
                            fieldName="password" />

                        <ControlledTextField
                            type="password"
                            label={__("Password confirmation")}
                            fieldName="passwordConfirmation" />

                        <ProgressButton
                            type="submit"
                            bsStyle="primary"
                            disabled={!this._changePasswordFormValid(formState)}
                            isActive={isPending}>
                            {__("Change password")}
                        </ProgressButton>
                    </div>
                ))} />

            <SubSection>{__("Delete Account")}</SubSection>

            <p>
                <span>{__("Here you can delete your account. Otherwise, if you do not login for three months, your account will be automatically deleted.")}</span>
            </p>

            <div className="tag-box-v3">
                <strong>
                    {__("Note")}:
                </strong>
                <span>{__("After deletion, your username will be locked for one month in order to prevent other players to pose as you.")}</span>
            </div>

            <Form
                name="account-delete"
                onSubmit={(formState: IFormState, options) => {
                    return null;
                    /* return deleteAccount({
                     name: formState.getFieldValue("confirmDelete")
                     }, options); */
                }}
                component={(({ isPending, submit, formState }) => (
                    <div>
                        <ControlledCheckBox
                            label={__("Yes, I would really like to delete my Impera account")}
                            placeholder={__("Yes, I would really like to delete my Impera account")}
                            fieldName="confirmDelete"
                            required={true} />

                        <ProgressButton
                            type="submit"
                            bsStyle="primary"
                            disabled={!this._changePasswordFormValid(formState)}
                            isActive={isPending}>
                            {__("Delete Account")}
                        </ProgressButton>
                    </div>
                ))} />
        </GridColumn >;
    }

    private _changePasswordFormValid(formState: IFormState): boolean {
        const oldPassword = formState.getFieldValue("oldPassword") || "";
        const password = formState.getFieldValue("password") || "";

        return oldPassword.trim() !== ""
            && password.trim() !== ""
            && password === formState.getFieldValue("passwordConfirmation");
    }
}

export default connect((state: IState) => {
    return {
    };
}, (dispatch) => ({
}))(ProfileComponent);