import * as React from "react";

import { css } from "../../lib/css";
import "./spinner.scss";

export const Spinner = (props: { className?: string; }): JSX.Element => {
    return <div className={css("spinner", props.className)}>
        &nbsp;
    </div>;
};