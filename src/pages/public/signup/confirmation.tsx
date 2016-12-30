import * as React from "react";
import { connect } from "react-redux";

import { IImmutable } from "immuts";

import { AccountClient, ErrorResponse } from "../../../external/imperaClients";

import { signup } from "../../../common/session/session.actions";
import { resetForm, changeField } from "../../../common/forms/forms.actions";
import { IForms, IForm } from "../../../common/forms/forms.reducer";

import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Grid, GridRow, GridColumn } from "../../../components/layout";

import Form from "../../../common/forms/form";
import { ControlledCheckBox, ControlledTextField } from "../../../common/forms/inputs";

export default class SignupConfirmation extends React.Component<{}, void> {
    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="ms-u-sm12">
                    <h1>Success</h1>

                    <p>
                        {__("Your account has been successfully registered. You will receive an email with a confirmation code, please follow the instructions in there.")}
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}