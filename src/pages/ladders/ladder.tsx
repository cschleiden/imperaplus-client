import * as React from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { GridColumn } from "../../components/layout/index";
import { HumanDate } from "../../components/ui/humanDate";
import { Loading } from "../../components/ui/loading";
import { Title } from "../../components/ui/typography";
import { Ladder } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { open } from "./ladders.actions";

interface ILadderProps {
    params?: {
        id: string;
    };

    ladder: Ladder;

    open: (id: string) => void;
}

class LadderComponent extends React.Component<ILadderProps, {}> {
    componentWillMount() {
        this.props.open(this.props.params.id);
    }

    render() {
        const { ladder } = this.props;

        if (!ladder) {
            return <Loading />;
        }

        const { standings } = ladder;

        return (
            <GridColumn className="col-xs-12">
                <Title>{ladder.name}</Title>

                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>

                            <th className="text-center">
                                {__("Games Played")}
                            </th>
                            <th className="text-center">{__("Games Won")}</th>
                            <th className="text-center">{__("Games Lost")}</th>

                            <th className="text-right">{__("Last Game")}</th>

                            <th className="text-right">{__("Rating")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings &&
                            standings.map(s => (
                                <tr key={s.userId}>
                                    <td>{s.position}</td>

                                    <td>{s.userName}</td>

                                    <td className="text-center">
                                        {s.gamesPlayed}
                                    </td>
                                    <td className="text-center">
                                        {s.gamesWon}
                                    </td>
                                    <td className="text-center">
                                        {s.gamesLost}
                                    </td>

                                    <td className="text-right">
                                        {HumanDate(s.lastGame)}
                                    </td>

                                    <td className="text-right">
                                        {Math.round(s.rating)}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </GridColumn>
        );
    }
}

export default connect(
    (state: IState) => ({
        ladder: state.ladders.ladder
    }),
    dispatch => ({
        open: (id: string) => {
            dispatch(open(id));
        }
    })
)(LadderComponent);
