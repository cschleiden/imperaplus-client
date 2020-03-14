import "./sidebar.scss";

import * as React from "react";
import { connect } from "react-redux";
import { SubSection, Title } from "../../../components/ui/typography";
import { Game, GameSummary } from "../../../external/imperaClients";
import { IState } from "../../../reducers";
import { game as gameSelector } from "../reducer/play.selectors";
import GameChat from "./gameChat";
import GameHistory from "./gameHistory";
import { GameStats } from "./gameStats";
import { GameLinkList } from "./gameLinkList";

interface ISidebarProps {
    game: Game;
    otherGames: GameSummary[];
}

class Sidebar extends React.Component<ISidebarProps> {
    render(): JSX.Element {
        const { game, otherGames } = this.props;
        const realOtherGames = otherGames.filter((g) => g.id !== game.id);

        return (
            <div className="play-sidebar">
                <Title>{game.id} - {game.name}</Title>

                <GameChat />

                <GameHistory />

                <SubSection>{__("Stats")}</SubSection>
                <GameStats game={game} />

                <SubSection>{__("Other Games")}</SubSection>
                <GameLinkList games={realOtherGames} />
            </div>
        );
    }
}

export default connect((state: IState) => ({
    game: gameSelector(state.play),
    otherGames: state.play.otherGames
}), (dispatch) => ({
}))(Sidebar);