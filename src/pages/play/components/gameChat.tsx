import "./gameChat.scss";

import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";

export class GameChat extends React.Component<void, void> {
    render() {
        return <Tabs defaultActiveKey={1} className="game-chat">
            <Tab eventKey={1} title={__("All")}>
            </Tab>

            <Tab eventKey={2} title={__("Team")}>
            </Tab>
        </Tabs>;
    }
}