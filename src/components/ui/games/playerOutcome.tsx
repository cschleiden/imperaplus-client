import * as React from "react";
import { PlayerOutcome } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { css } from "../../../lib/utils/css";
import style from "./playerOutcome.module.scss";

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
            className = style.none;
            label = __("Active");
            break;

        case PlayerOutcome.Won:
            icon = "check-circle";
            className = "won";
            label = __("Won");
            break;

        case PlayerOutcome.Defeated:
            icon = "minus-circle";
            className = style.defeated;
            label = __("Defeated");
            break;

        case PlayerOutcome.Surrendered:
            icon = "times-circle";
            className = style.surrendered;
            label = __("Surrendered");
            break;

        case PlayerOutcome.Timeout:
            icon = "times-circle";
            className = style.timeout;
            label = __("Timeout");
            break;
    }

    return (
        <span title={label} className={css("player-outcome", className)}>
            <i className={css("fa", "fa-" + icon)} aria-hidden={true} />
        </span>
    );
};
