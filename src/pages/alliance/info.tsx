import * as React from "react";

import { connect } from "react-redux";
import { GameSummary, GameType } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
// import { Create } from "../../components/ui/alliance/information";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { setDocumentTitle } from "../../lib/title";

export interface IAllianceInfoProps {
    refresh: () => void;
}

export class AllianceInfoComponent extends React.Component<IAllianceInfoProps, void> {
    public componentDidMount() {
        // this.props.refresh();

        setDocumentTitle(__("Information about alliances"));
    }

    public render(): JSX.Element {
        let alliances: JSX.Element[];

        return <GridColumn className="col-xs-12">
            <Title>{__("Information about alliances")}</Title>
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