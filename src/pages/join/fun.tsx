import * as React from "react";

import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { GameList } from "../../components/ui/games/gameList";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";

import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";
import { refreshFun } from "../games/games.actions";

export interface IFunGamesProps {
    refreshFun: () => void;

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
            fun = [<GameList games={this.props.funGames} key="fun" />];
        }

        return <GridColumn className="col-xs-12">
            <div>
                <div className="pull-right">
                    <ButtonGroup>
                        <Button key="refresh" onClick={this.props.refreshFun} title={__("Refresh")}><span className="glyphicon glyphicon-refresh" /></Button>
                    </ButtonGroup>
                </div>
                {fun}
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
    refreshFun: () => dispatch(refreshFun(null))
}))(FunGamesComponent);
