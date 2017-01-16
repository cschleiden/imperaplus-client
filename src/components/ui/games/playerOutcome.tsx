import * as React from "react";

import "./playerOutcome.scss";

import { PlayerSummaryOutcome, PlayerOutcome } from "../../../external/imperaClients";
import { css } from "office-ui-fabric-react/lib/utilities";

export const PlayerOutcomeDisplay: React.StatelessComponent<{ outcome: PlayerSummaryOutcome | PlayerOutcome }> = (props: { outcome: PlayerSummaryOutcome | PlayerOutcome }): JSX.Element => {
    const { outcome} = props;

    let icon: string;
    let className: string;
    let label: string;

    switch (outcome) {
        case PlayerOutcome.None:
        case PlayerSummaryOutcome.None:
            icon = "CircleFill";
            className = "player-outcome-none";
            label = __("Active");
            break;

        case PlayerOutcome.Won:
        case PlayerSummaryOutcome.Won:
            icon = "SkypeCircleCheck";
            className = "player-outcome-won";
            label = __("Won");
            break;

        case PlayerOutcome.Defeated:
        case PlayerSummaryOutcome.Defeated:
            icon = "SkypeCircleMinus";
            className = "player-outcome-defeated";
            label = __("Defeated");
            break;

        case PlayerOutcome.Surrendered:
        case PlayerSummaryOutcome.Surrendered:
            icon = "SkypeCircleMinus";
            className = "player-outcome-surrendered";
            label = __("Surrendered");
            break;

        case PlayerOutcome.Timeout:
        case PlayerSummaryOutcome.Timeout:
            icon = "SkypeCircleClock";
            className = "player-outcome-timeout";
            label = __("Timeout");
            break;
    }

    return <span title={label} className={css("player-outcome", className)}>
        <i className={css("ms-Icon", "ms-" + icon)} />
    </span>;
};