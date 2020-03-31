import * as React from "react";
import { connect } from "react-redux";
import { GridColumn } from "../../components/layout";
import { IState } from "../../reducers";

export interface IJoinAllianceProps {
    refreshAlliance: () => void;
    join: () => void;

    // alliances: GameSummary[];
}

export class JoinAllianceComponent extends React.Component<IJoinAllianceProps> {
    public render(): JSX.Element {
        // let alliances: JSX.Element[];

        return (
            <GridColumn className="col-xs-12">
                <div className="inProgress" />
            </GridColumn>
        );
    }
}

export default connect(
    (state: IState) => {
        /* const gamesMap = state.gamesgames;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]); */

        return {};
    },
    (dispatch) => ({
        /* refreshAlliance: () => dispatch(refreshAlliance(null)),
    join: () => dispatch(join(null)) */
    })
)(JoinAllianceComponent);
