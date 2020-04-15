import * as React from "react";
import { Grid, GridColumn, GridRow } from "../components/layout";
import __ from "../i18n/i18n";
import { AppNextPage } from "../store";

const Activated: AppNextPage = () => {
    return (
        <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <p>
                        {__(
                            "Your account has been successfully activated. You can login now."
                        )}
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>
    );
};

export default Activated;
