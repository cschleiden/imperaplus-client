import * as React from "react";

import { Grid, GridColumn, GridRow } from "../../../components/layout";

export default class SignupConfirmation extends React.Component<{}, void> {
    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <h1>
                        {__("Registration successful")}
                    </h1>

                    <p>
                        {__("Your account has been successfully registered. You will receive an email with a confirmation code, please follow the instructions in there.")}
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}