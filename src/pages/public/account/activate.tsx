import * as React from "react";
import { connect } from "react-redux";

import { Grid, GridRow, GridColumn } from "../../../components/layout";
import { activate } from "../../../common/session/session.actions";

interface IActivateProps {
    params: {
        userId: string;
        code: string;
    };

    dispatch: Function;
}

class ActivateComponent extends React.Component<IActivateProps, void> {
    public componentDidMount() {
        const { params } = this.props;

        // TODO: CS: Show indicator while activating
        this.props.dispatch(activate({
            userId: params.userId,
            code: params.code
        }));
    }

    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <h1>
                        {__("Activate account")}
                    </h1>
                    <p>
                        {__("Your account has been successfully activated.")}
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}

export default connect(state => ({}), {

})(ActivateComponent);