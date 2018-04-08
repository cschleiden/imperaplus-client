import * as React from "react";

// import { JoinList } from "../../components/ui/alliance/joinList";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";
import { IState } from "../../reducers";

export interface IJoinAllianceProps {
    refreshAlliance: () => void;
    join: () => void;

    // alliances: GameSummary[];
}

export class JoinAllianceComponent extends React.Component<IJoinAllianceProps> {
    public render(): JSX.Element {
        let alliances: JSX.Element[];

        return (
            <GridColumn className="col-xs-12">
                <div className="inProgress">
                </div>
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    /* const gamesMap = state.gamesgames;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]); */

    return {
    };
}, (dispatch) => ({
    /* refreshAlliance: () => dispatch(refreshAlliance(null)),
    join: () => dispatch(join(null)) */
}))(JoinAllianceComponent);