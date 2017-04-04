import "./sidebar.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Game } from "../../../external/imperaClients";
import { IState } from "../../../reducers";
import { Section, SubSection } from "../../../components/ui/typography";
import { Tabs } from "react-bootstrap";
import GameChat from "./gameChat";
import GameHistory from "./gameHistory";
import { GameStats } from "./stats";

interface ISidebarProps {
    game: Game;
}

class Sidebar extends React.Component<ISidebarProps, void> {
    render(): JSX.Element {
        const { game } = this.props;

        return <div className="play-sidebar">
            <GameChat />

            <SubSection>{__("History")}</SubSection>
            <GameHistory />

            <SubSection>{__("Stats")}</SubSection>
            <GameStats game={game} />

            <SubSection>{__("Other Games")}</SubSection>
        </div>;
    }
}

export default connect((state: IState, props: ISidebarProps) => ({
}), (dispatch) => ({
}))(Sidebar);