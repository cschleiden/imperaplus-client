import * as React from "react";
import { GameSummary } from "../../../external/imperaClients";
import { Link } from "react-router";

export interface IGameLinkListProps {
    games: GameSummary[];
}

export class GameLinkList extends React.Component<IGameLinkListProps> {
    public render(): JSX.Element {
        const { games } = this.props;

        return (
            <ul className="list-unstyled">
                {games.map(game => (
                    <li key={game.id}>
                        <Link to={`/play/${game.id}`}>
                            {game.id} {game.name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }
}
