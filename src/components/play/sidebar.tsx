import * as React from "react";
import { Title } from "react-bootstrap/lib/Modal";
import __ from "../../i18n/i18n";
import { useAppSelector } from "../../store";
import { SubSection } from "../ui/typography";
import GameChat from "./gameChat";
import GameHistory from "./gameHistory";
import { GameLinkList } from "./gameLinkList";
import { GameStats } from "./gameStats";

const Sidebar: React.FC = () => {
    const { game, otherGames } = useAppSelector((s) => ({
        game: s.play.game,
        otherGames: s.play.otherGames,
    }));

    return (
        <div className="play-sidebar">
            <Title>
                {game.id} - {game.name}
            </Title>

            <GameChat />

            <GameHistory />

            <SubSection>{__("Stats")}</SubSection>
            <GameStats game={game} />

            <SubSection>{__("Other Games")}</SubSection>
            <GameLinkList game={game} games={otherGames} />
        </div>
    );
};

export default Sidebar;
