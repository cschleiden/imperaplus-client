import * as React from "react";
import GameDetails from "../../../../components/ui/games/gameDetail";
import { GameSummary } from "../../../../external/imperaClients";
import { loadPairingGames } from "../../../../lib/domain/game/tournaments.slice";
import { AppNextPage } from "../../../../store";

const TournamentPairing: AppNextPage<{ games: GameSummary[] }> = ({
    games,
}) => {
    return (
        <>
            {games.map((game) => (
                <GameDetails key={game.id} game={game} />
            ))}
        </>
    );
};

TournamentPairing.needsLogin = true;
TournamentPairing.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(
        loadPairingGames(ctx.query["pairingId"] as string)
    );

    return {
        games: ctx.store.getState().tournaments.pairingGames,
    };
};

export default TournamentPairing;
