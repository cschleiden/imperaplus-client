import * as React from "react";
import { Grid, GridColumn, GridRow } from "../components/layout";
import __ from "../i18n/i18n";
import { AppNextPage } from "../store";

const Page: AppNextPage = () => (
    <Grid>
        <GridRow>
            <GridColumn className="col-xs-12">
                <p>
                    {__(
                        "Impera is a non-commercial, private hobby project run by: "
                    )}
                </p>

                <p>
                    Christopher Schleiden
                    <br />
                    <br />
                    6672 161st Ave SE Unit A<br />
                    WA, 98006, Bellevue
                    <br />
                    USA
                    <br />
                    <br />
                    +1 206 861 9203
                    <br />
                    <br />
                    info @imperaonline.de
                </p>
            </GridColumn>
        </GridRow>
    </Grid>
);

Page.getTitle = () => __("Imprint");

export default Page;
