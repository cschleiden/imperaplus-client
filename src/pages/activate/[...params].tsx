import * as React from "react";
import { useDispatch } from "react-redux";
import { GridColumn, GridRow } from "../../components/layout";
import { Spinner, SpinnerSize } from "../../components/ui/spinner";
import { activate } from "../../lib/domain/shared/session/session.slice";
import { isSSR } from "../../lib/utils/isSSR";
import { AppDispatch, AppNextPage } from "../../store";

const Activating: AppNextPage<{ userId: string; code: string }> = ({
    userId,
    code,
}) => {
    if (!isSSR()) {
        const dispatch = useDispatch<AppDispatch>();
        dispatch(activate({ userId, code }));
    }

    return (
        <GridRow>
            <GridColumn className="col-xs-12 col-md-6 col-md-push-3">
                <Spinner className="center-block" size={SpinnerSize.Large} />
            </GridColumn>
        </GridRow>
    );
};

Activating.getTitle = () => __("Activating Account");
Activating.getInitialProps = async (ctx) => {
    return {
        userId: ctx.query["params"][0] as string,
        code: ctx.query["params"][1] as string,
    };
};

export default Activating;
