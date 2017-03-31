import * as React from "react";

import { connect } from "react-redux";
import { GameSummary, GameType } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
import { JoinList } from "../../components/ui/games/joinList";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { refreshFun, join } from "../games/games.actions";
import { setDocumentTitle } from "../../lib/title";

export interface IFunGamesProps {
    refreshFun: () => void;
    join: () => void;

    funGames: GameSummary[];
}

export class FunGamesComponent extends React.Component<IFunGamesProps, void> {
    public componentDidMount() {
        this.props.refreshFun();

        setDocumentTitle(__("Open FunGames"));
    }

    public render(): JSX.Element {
        let fun: JSX.Element[];

        if (this.props.funGames.length > 0) {
            fun = [<Section key="fun-title">{__("Fun")}</Section>,
            <JoinList games={this.props.funGames} key="fun" />];
        }

        return <GridColumn className="col-xs-12">
            <Title>{__("Open FunGames")}</Title>
            <div>
                Das ist die Tournaments Page
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    const gamesMap = state.games.data.games;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]);

    return {
        funGames: games.filter(g => g.type === GameType.Fun)
    };
}, (dispatch) => ({
    refreshFun: () => dispatch(refreshFun(null)),
    join: () => dispatch(join(null))
}))(FunGamesComponent);