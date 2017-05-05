import * as React from "react";
import { connect } from "react-redux";

import { Grid, GridRow, GridColumn } from "../../../components/layout";

export default class ActivatedComponent extends React.Component<void, void> {
    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <h1>
                        {__("Activated account")}
                    </h1>
                    <p>
                        {__("Your account has been successfully activated. You can login now.")}
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}