import "./sidebar.scss";

import * as React from "react";
import { connect } from "react-redux";
import { SubSection } from "../../../components/ui/typography";
import { Game } from "../../../external/imperaClients";
import { IState } from "../../../reducers";
import { game } from "../reducer/play.selectors";
import GameChat from "./gameChat";
import GameHistory from "./gameHistory";
import { GameStats } from "./gameStats";

interface ISidebarProps {
    game: Game;
}

class Sidebar extends React.Component<ISidebarProps> {
    render(): JSX.Element {
        const { game } = this.props;

        return <div className="play-sidebar">
            <GameChat />
            
            <GameHistory />

            <SubSection>{__("Stats")}</SubSection>
            <GameStats game={game} />

            <SubSection>{__("Other Games")}</SubSection>
        </div>;
    }
}

export default connect((state: IState) => ({
    game: game(state.play)
}), (dispatch) => ({
}))(Sidebar);