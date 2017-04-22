import * as React from "react";

import { connect } from "react-redux";
import { GridColumn } from "../../components/layout";
import { Title } from "../../components/ui/typography";
import Form, { IFormState } from "../../common/forms/form";
import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";
import { ProgressButton } from "../../components/ui/progressButton";
import { ControlledCheckBox } from "../../common/forms/inputs";

export interface IProfileProps {
    refresh: () => void;
}

export class ProfileComponent extends React.Component<IProfileProps, void> {
    public componentDidMount() {
        // this.props.refresh();

        setDocumentTitle(__("Your profile"));
    }

    public render(): JSX.Element {
        let profile: JSX.Element = null;
        let a = "";

        if (a !== "Loggedin by foreig account") {
            profile = <div><h2 className="headline"><span>{__("Set Password")}</span></h2>
                <p>{ /* Show only if external account and no password set, yet */ }</p></div>
        } else {
            profile = <div><h2 className="headline"><span>{__("Change Password")}</span></h2>
                <p>{ /* Show only password set */ }</p></div>
        }

        return <GridColumn className="col-xs-12">
            <Title>{__("Your profile")}</Title>
            <p className="lead"><span>{__("Here you can manage your profile and settings")}</span></p>

            {profile}

            <h2 className="headline"><span>{__("Associated Logins")}</span></h2>

            <p>{ /* Show list of logins which are associated, local as well as external */ }</p>
            <p>{ /* Show list of external logins which are not yet associated */ }</p>

            <h2 className="headline"><span>{__("Change Profile Data")}</span></h2>

            <p>Email etc.</p>

            <h2 className="headline"><span>{__("Remove Account")}</span></h2>

            <p><span>{__("If you do not want to play Impera anymore, you can delete your account here. Otherwise, if you do not login for three months, your account will be automatically deleted.")}</span></p>

            <div className="tag-box-v3">
                <p><strong><span>{__("Note")}: </span></strong><span>{__("After deletion, your username will be locked for one month in order to prevent new accounts to pose as you.")}</span></p>
            </div>

            <Form
                name="account-delete"
                onSubmit={(formState: IFormState, options) => {

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
                            disabled={!this._formValid(formState)}
                            isActive={isPending}>
                            {__("Delete Account")}
                        </ProgressButton>
                    </div>
                ))} />
        </GridColumn>;
    }
    private _formValid(formState: IFormState): boolean {
        return formState.getFieldValue("confirmDelete");
    }

}

export default connect((state: IState) => {
    return {
    };
}, (dispatch) => ({
}))(ProfileComponent);