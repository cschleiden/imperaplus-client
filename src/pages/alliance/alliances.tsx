import * as React from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { GridColumn } from "../../components/layout";
import { AllianceSummary } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { refresh } from "./alliances.actions";
import { Link } from "react-router";
import { Loading } from "../../components/ui/loading";

export interface IAllianceAdminProps {
    alliances: AllianceSummary[];

    refresh: () => void;
}

export class AllianceAdminComponent extends React.Component<IAllianceAdminProps> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        const { alliances } = this.props;

        if (!alliances) {
            return <Loading />;
        }

        return (
            <GridColumn className="col-xs-12">
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>
                                {__("Name")}
                            </th>
                            <th className="text-center">
                                {__("Members")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            alliances.map(alliance =>
                                <tr key={alliance.id}>
                                    <td>
                                        <Link to={`/game/alliances/${alliance.id}`}>
                                            {alliance.name}
                                        </Link>
                                    </td>
                                    <td className="text-center">
                                        {alliance.numberOfMembers}
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    const s = state.alliances;

    return {
        alliances: s.alliances
    };
}, (dispatch) => ({
    refresh: () => { dispatch(refresh(null)); },
}))(AllianceAdminComponent);