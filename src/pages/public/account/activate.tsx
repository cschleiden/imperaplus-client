import * as React from "react";
import { connect } from "react-redux";

import { Grid, GridRow, GridColumn } from "../../../components/layout";
import { activate } from "../../../common/session/session.actions";
import { Spinner } from "../../../components/ui/spinner";

interface IActivateProps {
    params: {
        userId: string;
        code: string;
    };

    activate: (userId: string, code: string) => void;
}

class ActivateComponent extends React.Component<IActivateProps, void> {
    public componentDidMount() {
        const { params } = this.props;

        this.props.activate(params.userId, params.code);
    }

    public render() {
        return <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    <h1>
                        {__("Activating account")}
                    </h1>
                    
                    <Spinner className="center-block" />
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}

export default connect(state => ({

}), (dispatch) => ({
    activate: (userId: string, code: string) => {
        dispatch(activate({
            userId: userId,
            code: code
        }));
    }
}))(ActivateComponent);