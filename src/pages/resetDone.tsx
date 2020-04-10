import * as React from "react";
import { Grid, GridColumn, GridRow } from "../components/layout";
import { LinkString } from "../components/ui/strLink";
import __ from "../i18n/i18n";

const ResetDone = () => {
    return (
        <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <p>
                        <LinkString
                            link={__(
                                "Your password has been reset. You can [login](/login) now."
                            )}
                        />
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>
    );
};

export default ResetDone;
