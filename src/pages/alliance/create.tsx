import * as React from "react";

import { connect } from "react-redux";
import { GameSummary, GameType } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
// import { Create } from "../../components/ui/alliance/create";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";

export interface ICreateAllianceProps {
    refresh: () => void;
}

export class CreateAllianceComponent extends React.Component<ICreateAllianceProps, void> {
    public componentDidMount() {
        // this.props.refresh();

        setDocumentTitle(__("Create Alliance"));
    }

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
}))(CreateAllianceComponent);