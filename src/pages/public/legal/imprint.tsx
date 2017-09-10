import * as React from "react";

import { Grid, GridColumn, GridRow } from "../../../components/layout";

export default (() =>
    <Grid>
        <GridRow>
            <GridColumn className="col-xs-12">
                <h1>
                    {__("Imprint")}
                </h1>

                <p>
                    {__("Impera is a non-commercial, private hobby project run by: ")}
                </p>

                <p>
                    Christopher Schleiden<br />
                    <br />
                    6672 161st Ave SE Unit A<br />
                    WA, 98006, Bellevue<br />
                    USA<br />
                    <br />
                    +1 206 861 9203<br />
                    <br />
                    info@imperaonline.de
                </p>
            </GridColumn>
        </GridRow>
    </Grid>
) as React.StatelessComponent<void>;