import * as React from "react";

import "./playerOutcome.scss";

import { PlayerOutcome } from "../../../external/imperaClients";
import { css } from "../../../lib/css";

export const PlayerOutcomeDisplay: React.StatelessComponent<{
    outcome: PlayerOutcome;
}> = (props: { outcome: PlayerOutcome }): JSX.Element => {
    const { outcome } = props;

    let icon: string;
    let className: string;
    let label: string;

    switch (outcome) {
        case PlayerOutcome.None:
            icon = "circle-o";
            className = "player-outcome-none";
            label = __("Active");
            break;

        case PlayerOutcome.Won:
            icon = "check-circle";
            className = "player-outcome-won";
            label = __("Won");
            break;

        case PlayerOutcome.Defeated:
            icon = "minus-circle";
            className = "player-outcome-defeated";
            label = __("Defeated");
            break;

        case PlayerOutcome.Surrendered:
            icon = "times-circle";
            className = "player-outcome-surrendered";
            label = __("Surrendered");
            break;

        case PlayerOutcome.Timeout:
            icon = "times-circle";
            className = "player-outcome-timeout";
            label = __("Timeout");
            break;
    }

    return (
        <span title={label} className={css("player-outcome", className)}>
            <i className={css("fa", "fa-" + icon)} aria-hidden={true} />
        </span>
    );
};
