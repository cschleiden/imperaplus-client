import * as React from "react";
import { connect } from "react-redux";
import { activate } from "../../../common/session/session.actions";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { Spinner, SpinnerSize } from "../../../components/ui/spinner";
import { Title } from "../../../components/ui/typography";

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
                    <Title>
                        {__("Activating account")}
                    </Title>

                    <Spinner className="center-block" size={SpinnerSize.Large} />
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