import * as React from "react";

// import { Admin } from "../../components/ui/alliance/admin";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";

import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";

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