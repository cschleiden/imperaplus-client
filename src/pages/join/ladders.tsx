import * as React from "react";

import { connect } from "react-redux";
import { GameSummary, GameType } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
import { Ladders } from "../../components/ui/games/ladders";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { refresh, join } from "./ladders.actions";
import { setDocumentTitle } from "../../lib/title";

export interface IRankingGamesProps {
    refresh: () => void;
    join: () => void;

    rankingGames: GameSummary[];
}

export class RankingGamesComponent extends React.Component<IRankingGamesProps, void> {
    public componentDidMount() {
        this.props.refresh();

        setDocumentTitle(__("Join Ladder"));
    }

    public render(): JSX.Element {
        let ranking: JSX.Element[];

        if (this.props.rankingGames.length > 0) {
            ranking = [<Section key="fun-title">{__("Ladder")}</Section>,
            <Ladders games={this.props.rankingGames} key="fun" />];
        }

        return <GridColumn className="col-xs-12">
            <Title>{__("Join Ladder")}</Title>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    const gamesMap = state.games.data.games;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]);

    return {
        rankingGames: games.filter(g => g.type === GameType.Ranking)
    };
}, (dispatch) => ({
    refresh: () => dispatch(refresh(null)),
    join: () => dispatch(join(null))
}))(RankingGamesComponent);