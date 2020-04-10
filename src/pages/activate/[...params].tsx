import * as React from "react";
import { Grid } from "react-bootstrap";
import { GridColumn, GridRow } from "../../components/layout";
import { Spinner, SpinnerSize } from "../../components/ui/spinner";
import { activate } from "../../lib/domain/shared/session/session.slice";
import { AppNextPage } from "../../store";

const ActivateComponent: AppNextPage = () => {
    return (
        <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <Spinner
                        className="center-block"
                        size={SpinnerSize.Large}
                    />
                </GridColumn>
            </GridRow>
        </Grid>
    );
};

ActivateComponent.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(
        activate({
            userId: ctx.query["params"][0] as string,
            code: ctx.query["params"][1] as string,
        })
    );
};
