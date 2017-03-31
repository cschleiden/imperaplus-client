import * as React from "react";

import { connect } from "react-redux";
import { GameSummary, GameType } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
// import { Admin } from "../../components/ui/alliance/admin";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";

export interface IAllianceAdminProps {
}

export class AllianceAdminComponent extends React.Component<IAllianceAdminProps, void> {
    public componentDidMount() {
        // this.props.refresh();

        setDocumentTitle(__("Alliance Admin"));
    }

    public render(): JSX.Element {
        let alliances: JSX.Element[];

        return <GridColumn className="col-xs-12">
            <Title>{__("Alliance Admin")}</Title>
            <div className="inProgress">
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    return {
    };
}, (dispatch) => ({
}))(AllianceAdminComponent);