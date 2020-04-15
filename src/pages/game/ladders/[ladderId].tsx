import * as React from "react";
import { Table } from "react-bootstrap";
import { Title } from "react-bootstrap/lib/Modal";
import { HumanDate } from "../../../components/ui/humanDate";
import { Loading } from "../../../components/ui/loading";
import __ from "../../../i18n/i18n";
import { fetch } from "../../../lib/domain/game/ladders.slice";
import { IState } from "../../../reducers";
import { AppNextPage, useAppSelector } from "../../../store";

function selector(state: IState) {
    return {
        ladder: state.ladders.ladder,
    };
}

const LadderComponent: AppNextPage = () => {
    const { ladder } = useAppSelector(selector);

    if (!ladder) {
        return <Loading />;
    }

    const { standings } = ladder;

    return (
        <>
            {" "}
            <Title>{ladder.name}</Title>
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>

                        <th className="text-center">{__("Games Played")}</th>
                        <th className="text-center">{__("Games Won")}</th>
                        <th className="text-center">{__("Games Lost")}</th>

                        <th className="text-right">{__("Last Game")}</th>

                        <th className="text-right">{__("Rating")}</th>
                    </tr>
                </thead>
                <tbody>
                    {standings &&
                        standings.map((s) => (
                            <tr key={s.userId}>
                                <td>{s.position}</td>

                                <td>{s.userName}</td>

                                <td className="text-center">{s.gamesPlayed}</td>
                                <td className="text-center">{s.gamesWon}</td>
                                <td className="text-center">{s.gamesLost}</td>

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
        </>
    );
};

LadderComponent.needsLogin = true;
// TODO
LadderComponent.getTitle = () => __("Ladder");
LadderComponent.getInitialProps = async (context) => {
    const ladderId = context.query["ladderId"] as string;

    await context.store.dispatch(fetch(ladderId));

    return {};
};

export default LadderComponent;
