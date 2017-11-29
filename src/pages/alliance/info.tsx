import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType, Alliance } from "../../external/imperaClients";

import { IState } from "../../reducers";

export interface IAllianceInfoProps {
    params?: {
        id: string;
    };

    // refresh: () => void;
}

export class AllianceInfoComponent extends React.Component<IAllianceInfoProps> {
    componentWillMount() {
        // this.props.open(this.props.params.id);
    }

    render(): JSX.Element {
        let alliance: Alliance;

        return (
            <GridColumn className="col-xs-12">
                <Title>{alliance.name}</Title>
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    return {
    };
}, (dispatch) => ({
}))(AllianceInfoComponent);