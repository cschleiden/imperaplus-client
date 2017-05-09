import * as React from "react";

// import { JoinList } from "../../components/ui/alliance/joinList";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";

// import { refreshAlliance, join } from "../games/games.actions";
import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";

export interface IJoinAllianceProps {
    refreshAlliance: () => void;
    join: () => void;

    // alliances: GameSummary[];
}

export class JoinAllianceComponent extends React.Component<IJoinAllianceProps, void> {
    public render(): JSX.Element {
        let alliances: JSX.Element[];

        return <GridColumn className="col-xs-12">
            <div className="inProgress">
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    /* const gamesMap = state.games.data.games;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]); */

    return {
    };
}, (dispatch) => ({
    /* refreshAlliance: () => dispatch(refreshAlliance(null)),
    join: () => dispatch(join(null)) */
}))(JoinAllianceComponent);