import * as React from "react";

import { Grid, GridColumn, GridRow } from "../../../components/layout";

declare var language: string;

const tos = {
    "de": () => <div>
        <p>
            German test
        </p>
    </div>,

    "en": () => <div>
        <p>
            english test
        </p>
    </div>
};

export default (() =>
    <Grid>
        <GridRow>
            <GridColumn className="col-xs-12">
                <h1>
                    {__("Terms of service")}
                </h1>
                {tos[language]()}
            </GridColumn>
        </GridRow>
    </Grid>
) as React.StatelessComponent<void>;