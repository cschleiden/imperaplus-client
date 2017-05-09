import * as React from "react";

import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { GameList } from "../../components/ui/games/gameList";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";

import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";
import { hideAll, refresh } from "./games.actions";

export interface IMyGamesProps {
    refresh: () => void;
    hideAll: () => void;

    funGames: GameSummary[];
    rankingGames: GameSummary[];
    tournamentGames: GameSummary[];
}

export class MyGamesComponent extends React.Component<IMyGamesProps, void> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        let fun: JSX.Element[];
        let ranking: JSX.Element[];
        let tournament: JSX.Element[];

        if (this.props.funGames.length > 0) {
            fun = [<Section key="fun-title">{__("Fun")}</Section>,
            <GameList games={this.props.funGames} key="fun" />];
        }

        if (this.props.rankingGames.length > 0) {
            ranking = [<Section key="ranking-title">{__("Ranking")}</Section>,
            <GameList games={this.props.rankingGames} key="ranking" />];
        }

        if (this.props.tournamentGames.length > 0) {
            tournament = [<Section key="tournaments-title">{__("Tournaments")}</Section>,
            <GameList games={this.props.tournamentGames} key="tournaments" />];
        }

        return <GridColumn className="col-xs-12">
            <div>
                <div className="pull-right">
                    <ButtonGroup>
                        <Button key="refresh" onClick={this.props.refresh} title={__("Refresh")}><span className="glyphicon glyphicon-refresh" /></Button>
                        <Button key="hideAll" onClick={this.props.hideAll} title={__("Hide completed games")}><span className="glyphicon glyphicon-eye-close" /></Button>
                    </ButtonGroup>
                </div>

                {fun}
                {ranking}
                {tournament}
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    const gamesMap = state.games.data.games;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]);

    return {
        funGames: games.filter(g => g.type === GameType.Fun),
        rankingGames: games.filter(g => g.type === GameType.Ranking),
        tournamentGames: games.filter(g => g.type === GameType.Tournament)
    };
}, (dispatch) => ({
    refresh: () => dispatch(refresh(null)),
    hideAll: () => dispatch(hideAll(null))
}))(MyGamesComponent);