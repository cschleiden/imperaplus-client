import * as React from "react";
import { Grid, GridColumn, GridRow } from "../components/layout";
import __ from "../i18n/i18n";

export default class ResetTriggeredComponent extends React.Component {
    public render() {
        return (
            <Grid>
                <GridRow>
                    <GridColumn className="col-xs-12">
                        <p>
                            {__(
                                "We have sent an email with a confirmation code to your registered email address. Please follow the instructions in the email to reset your password."
                            )}
                        </p>
                    </GridColumn>
                </GridRow>
            </Grid>
        );
    }
}
