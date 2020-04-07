import * as React from "react";
import Link from "next/link";
import { GameSummary } from "../../external/imperaClients";

export interface IGameLinkListProps {
    games: GameSummary[];
}

export class GameLinkList extends React.Component<IGameLinkListProps> {
    public render(): JSX.Element {
        const { games } = this.props;

        return (
            <ul className="list-unstyled">
                {games.map((game) => (
                    <li key={game.id}>
                        <Link
                            as={`/game/play/${game.id}`}
                            href="/game/play/[...gameId]"
                        >
                            {game.id} {game.name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }
}
