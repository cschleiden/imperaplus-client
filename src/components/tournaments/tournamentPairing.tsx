import * as React from "react";
import { connect } from "react-redux";
import { GameSummary } from "../../external/imperaClients";
import { loadPairingGames } from "../../lib/domain/game/tournaments.slice";
import { IState } from "../../reducers";
import { AppDispatch } from "../../store";
import { GridColumn } from "../layout";
import GameDetails from "../ui/games/gameDetail";

export interface ITournamentPairingProps {
    params: {
        id: string;
    };

    loadPairing: (id: string) => void;

    games: GameSummary[];
}

export class TournamentPairingComponent extends React.Component<
    ITournamentPairingProps
> {
    public componentDidMount() {
        this.props.loadPairing(this.props.params.id);
    }

    public render(): JSX.Element {
        const { games } = this.props;

        return (
            <GridColumn className="col-xs-12">
                {games.map((game) => (
                    <GameDetails key={game.id} game={game} />
                ))}
            </GridColumn>
        );
    }
}

export default connect(
    (state: IState) => {
        const games = state.tournaments.pairingGames;

        return {
            games,
        };
    },
    (dispatch: AppDispatch) => ({
        loadPairing: (id: string) => {
            dispatch(loadPairingGames(id));
        },
    })
)(TournamentPairingComponent);
