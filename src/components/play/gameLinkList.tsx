import Link from "next/link";
import * as React from "react";
import { Game, GameSummary } from "../../external/imperaClients";

export interface IGameLinkListProps {
    game: Game;
    games: GameSummary[];
}

export const GameLinkList: React.FC<IGameLinkListProps> = (props) => {
    const { games, game } = props;

    return (
        <ul className="list-unstyled">
            {games
                .filter((g) => g.id !== game.id)
                .map((game) => (
                    <li key={game.id}>
                        <Link
                            as={`/game/play/${game.id}`}
                            href="/game/play/[...gameId]"
                        >
                            <a>{`${game.id} ${game.name}`}</a>
                        </Link>
                    </li>
                ))}
        </ul>
    );
};
