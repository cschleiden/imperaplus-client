import * as React from "react";
import { connect } from "react-redux";
import { Game } from "../../../external/imperaClients";
import { IState } from "../../../reducers";

enum ActionState {
    Place,
    ActionDefault,
    ActionOriginSelected,
    ActionDestinationSelected
}

enum MapState {
    DisplayOnly,
    Place,
    Move,
    Attack,
    History
}

enum MouseState {
    Default,
    ActionDragger
}

namespace KeyBindings {
    const ABORT = 27; // Escape

    const INCREASE_UNITCOUNT = 38; // Cursor up
    const DECREASE_UNITCOUNT = 40; // Cursor down
    const SUBMIT_ACTION = 13; // Enter
}

interface IMapProps {
    game: Game;

    // switchGame: (gameId: number) => void;
}

class Map extends React.Component<IMapProps, void> {
    render(): JSX.Element {
        return <div className="map">
            <img />
        </div>;
    }
}

export default connect((state: IState) => ({
    game: state.play.data.game
}), (dispatch) => ({
}))(Map);