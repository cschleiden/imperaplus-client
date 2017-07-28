import * as React from "react";

// import { Create } from "../../components/ui/alliance/information";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";

import { IState } from "../../reducers";

export interface IAllianceInfoProps {
    refresh: () => void;
}

export class AllianceInfoComponent extends React.Component<IAllianceInfoProps> {
    public render(): JSX.Element {
        let alliances: JSX.Element[];

        return <GridColumn className="col-xs-12">
            <div className="inProgress">
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    return {
    };
}, (dispatch) => ({
}))(AllianceInfoComponent);