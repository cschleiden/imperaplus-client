import * as React from "react";

import { connect } from "react-redux";
import { GameSummary, GameType } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
import { GameList } from "../../components/ui/games/gameList";
import { Button, ButtonGroup } from "react-bootstrap";

import { IState } from "../../reducers";
import { refreshFun, join } from "../games/games.actions";
import { setDocumentTitle } from "../../lib/title";

export interface ITournamentGamesProps {
    refreshFun: () => void;
    join: () => void;

    tournamentGames: GameSummary[];
}

export class TournamentsComponent extends React.Component<ITournamentGamesProps, void> {
    public componentDidMount() {
        this.props.refreshFun();

        setDocumentTitle(__("Tournaments"));
    }

    public render(): JSX.Element {
        let tournaments: JSX.Element[];

        if (this.props.tournamentGames.length > 0) {
            tournaments = [<GameList games={this.props.tournamentGames} key="tournaments" />];
        }

        return <GridColumn className="col-xs-12">
            <Title>{__("Tournaments")}</Title>
            <div>
                <div className="pull-right">
                    <ButtonGroup>
                        <Button key="refresh" onClick={this.props.refreshFun} title={__("Refresh")}><span className="glyphicon glyphicon-refresh" /></Button>
                    </ButtonGroup>
                </div>

                {tournaments}
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => {
    const gamesMap = state.games.data.games;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]);

    return {
        tournamentGames: games.filter(g => g.type === GameType.Tournament)
    };
}, (dispatch) => ({
    refreshFun: () => dispatch(refreshFun(null)),
    join: () => dispatch(join(null))
}))(TournamentsComponent);
