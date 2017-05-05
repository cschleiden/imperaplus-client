import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { recover } from "../../../common/session/session.actions";

import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

import Form from "../../../common/forms/form";
import { ControlledTextField } from "../../../common/forms/inputs";
import { setDocumentTitle } from "../../../lib/title";

interface IRecoverProps {
}

export class RecoverComponent extends React.Component<IRecoverProps, void> {
    public componentDidMount() {
        setDocumentTitle(__("Recover account"));
    }

    public render(): JSX.Element {
        return <Grid className="recover">
            <GridRow>
                <GridColumn className="col-xs-12">
                    <p>
                        {__("Recover your password.")}
                    </p>

                    <Form
                        name="recover"
                        onSubmit={((formState, options) => {
                            return recover({
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

export default connect(state => ({}), {})(RecoverComponent);