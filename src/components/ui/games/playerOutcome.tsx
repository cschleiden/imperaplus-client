import * as React from "react";

import "./playerOutcome.scss";

import { css } from "../../../lib/css";
import { PlayerOutcome } from "../../../external/imperaClients";

export const PlayerOutcomeDisplay: React.StatelessComponent<{ outcome: PlayerOutcome }> = (props: { outcome: PlayerOutcome }): JSX.Element => {
    const { outcome} = props;

    let icon: string;
    let className: string;
    let label: string;

    switch (outcome) {
        case PlayerOutcome.None:
            icon = "CircleFill";
            className = "player-outcome-none";
            label = __("Active");
            break;

        case PlayerOutcome.Won:
            icon = "SkypeCircleCheck";
            className = "player-outcome-won";
            label = __("Won");
            break;

        case PlayerOutcome.Defeated:
            icon = "SkypeCircleMinus";
            className = "player-outcome-defeated";
            label = __("Defeated");
            break;

        case PlayerOutcome.Surrendered:
            icon = "SkypeCircleMinus";
            className = "player-outcome-surrendered";
            label = __("Surrendered");
            break;

        case PlayerOutcome.Timeout:
            icon = "SkypeCircleClock";
            className = "player-outcome-timeout";
            label = __("Timeout");
            break;
    }

    return <span title={label} className={css("player-outcome", className)}>
        <i className={css("ms-Icon", "ms-Icon--" + icon)} aria-hidden={true} />
    </span>;
};