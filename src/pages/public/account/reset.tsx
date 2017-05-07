import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Form from "../../../common/forms/form";
import { ControlledTextField } from "../../../common/forms/inputs";
import { resetTrigger } from "../../../common/session/session.actions";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Title } from "../../../components/ui/typography";
import { setDocumentTitle } from "../../../lib/title";

export default class ResetComponent extends React.Component<void, void> {
    public componentDidMount() {
        setDocumentTitle(__("Reset password"));
    }

    public render(): JSX.Element {
        return <Grid className="recover">
            <GridRow>
                <GridColumn className="col-xs-12">
                    <Title>
                        {__("Reset password")}
                    </Title>

                    <Form
                        name="recover"
                        onSubmit={((formState, options) => {
                            return resetTrigger({
                                username: formState.getFieldValue("username"),
                                email: formState.getFieldValue("email")
                            }, options);
                        })}
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

                                <div className="pull-right">
                                    <ProgressButton
                                        type="submit"
                                        disabled={!this._formValid(formState)}
                                        isActive={isPending}
                                        bsStyle="primary">
                                        {__("Recover")}
                                    </ProgressButton>
                                </div>
                            </div>)} />
                </GridColumn>
            </GridRow>
        </Grid>;
    }

    private _formValid(formState): boolean {
        return formState.getFieldValue("username")
            && formState.getFieldValue("email");
    }
}