import Link from "next/link";
import * as React from "react";
import { Table } from "react-bootstrap";
import { GridColumn } from "../../../components/layout";
import { Loading } from "../../../components/ui/loading";
import __ from "../../../i18n/i18n";
import { fetchAll } from "../../../lib/domain/game/alliances.slice";
import { IState } from "../../../reducers";
import { AppNextPage } from "../../../store";

function selector(state: IState) {
    return {
        isLoading: state.alliances.isLoading,
        alliances: state.alliances.alliances,
    };
}

const Alliances: AppNextPage<ReturnType<typeof selector>> = ({
    alliances,
    isLoading,
}) => {
    if (isLoading) {
        return <Loading />;
    }

    return (
        <GridColumn className="col-xs-12">
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>{__("Name")}</th>
                        <th className="text-center">{__("Members")}</th>
                    </tr>
                </thead>
                <tbody>
                    {alliances.map((alliance) => (
                        <tr key={alliance.id}>
                            <td>
                                <Link
                                    as={`/game/alliances/${alliance.id}`}
                                    href="/game/alliances/[allianceId]"
                                >
                                    {alliance.name}
                                </Link>
                            </td>
                            <td className="text-center">
                                {alliance.numberOfMembers}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </GridColumn>
    );
};

Alliances.getTitle = () => __("Alliances");
Alliances.needsLogin = true;
Alliances.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(fetchAll());
    return selector(ctx.store.getState());
};

export default Alliances;
