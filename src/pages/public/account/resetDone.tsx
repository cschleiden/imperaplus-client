import * as React from "react";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import LinkStr from "../../../components/ui/strLink";
import { setDocumentTitle } from "../../../lib/title";

export default class ResetDoneComponent extends React.Component<void, void> {
    public componentDidMount() {
        setDocumentTitle(__("Reset password"));
    }

    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <h1>
                        {__("Reset password")}
                    </h1>
                    <p>
                        <LinkStr link={__("Your password has been reset. You can [login](/login) now.")} />
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}