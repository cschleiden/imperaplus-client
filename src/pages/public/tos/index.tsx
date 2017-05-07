import * as React from "react";

import { Grid, GridColumn, GridRow } from "../../../components/layout";

export default (() =>
    <Grid>
        <GridRow>
            <GridColumn className="col-xs-12">
                <h1>
                    {__("Terms of service")}
                </h1>
                <p>
                    {__("move here..")}
                </p>
            </GridColumn>
        </GridRow>
    </Grid>
) as React.StatelessComponent<void>;