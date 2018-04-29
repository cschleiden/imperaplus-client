import * as React from "react";
import { connect } from "react-redux";
import { GridColumn } from "../../components/layout";
import GameDetails from "../../components/ui/games/gameDetail";
import { GameSummary } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { loadPairingGames } from "../tournaments/tournaments.actions";

export interface ITournamentPairingProps {
    params: {
        id: string;
    };

    loadPairing: (id: string) => void;

    games: GameSummary[];
}

export class TournamentPairingComponent extends React.Component<ITournamentPairingProps> {
    public componentDidMount() {
        this.props.loadPairing(this.props.params.id);
    }

    public render(): JSX.Element {
        const { games } = this.props;

        return (
            <GridColumn className="col-xs-12">
                {
                    games.map(game => (
                        <GameDetails key={game.id} game={game} />
                    ))
                }
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    const games = state.tournaments.pairingGames;

    return {
        games
    };
}, (dispatch) => ({
    loadPairing: (id: string) => { dispatch(loadPairingGames({ pairingId: id })); }
}))(TournamentPairingComponent);
