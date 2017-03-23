import "./sidebar.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Game } from "../../../external/imperaClients";
import { IState } from "../../../reducers";
import { Section, SubSection } from "../../../components/ui/typography";
import { Tabs } from "react-bootstrap";

interface ISidebarProps {
}

class Sidebar extends React.Component<ISidebarProps, void> {
    render(): JSX.Element {
        return <div className="play-sidebar">
            <Tabs>
            </Tabs>

            <SubSection>{__("History")}</SubSection>
            <SubSection>{__("Other Games")}</SubSection>
        </div>;
    }
}

export default connect((state: IState) => ({
}), (dispatch) => ({
}))(Sidebar);