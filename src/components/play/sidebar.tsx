import * as React from "react";
import { connect } from "react-redux";
import { Game, GameSummary } from "../../external/imperaClients";
import { Title } from "react-bootstrap/lib/Modal";
import { SubSection } from "../ui/typography";
import __ from "../../i18n/i18n";
import { GameStats } from "./gameStats";
import { GameLinkList } from "./gameLinkList";
import { IState } from "../../reducers";
import GameChat from "./gameChat";
import GameHistory from "./gameHistory";

interface ISidebarProps {
    game: Game;
    otherGames: GameSummary[];
}

class Sidebar extends React.Component<ISidebarProps> {
    render(): JSX.Element {
        const { game, otherGames } = this.props;

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
                <GameLinkList games={otherGames} />
            </div>
        );
    }
}

export default connect((state: IState) => ({
    game: state.play.game,
    otherGames: state.play.otherGames,
}))(Sidebar);
