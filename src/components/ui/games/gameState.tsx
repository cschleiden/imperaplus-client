import * as React from "react";

import "./playerOutcome.scss";

import { GameState } from "../../../external/imperaClients";
import { css } from "../../../lib/css";

export const GameStateDisplay: React.StatelessComponent<{ gameState: GameState }> = (props: { gameState: GameState }): JSX.Element => {
    const { gameState } = props;

    let icon: string;
    let className: string;
    let label: string;

    switch (gameState) {
        case GameState.Active:
            label = __("Active");
            icon = "circle";
            className = "game-state-active";
            break;

        case GameState.Open:
            label = __("Open");
            icon = "circle-o";
            className = "game-state-open";
            break;

        case GameState.Ended:
            label = __("Ended");
            icon = "dot-circle-o";
            className = "game-state-ended";
            break;
    }

    return <span title={label} className={css("player-outcome", className)}>
        <i className={css("fa", "fa-" + icon)} aria-hidden={true} />
    </span>;
};