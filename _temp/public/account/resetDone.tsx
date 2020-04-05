import * as React from "react";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import LinkStr from "../../../components/ui/strLink";

export default class ResetDoneComponent extends React.Component {
    public render() {
        return (
            <Grid>
                <GridRow>
                    <GridColumn className="col-xs-12">
                        <p>
                            <LinkStr
                                link={__(
                                    "Your password has been reset. You can [login](/login) now."
                                )}
                            />
                        </p>
                    </GridColumn>
                </GridRow>
            </Grid>
        );
    }
}
