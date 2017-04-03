import * as React from "react";

import "./spinner.scss";
import { css } from "../../lib/css";

export const Spinner = (props: { className?: string; }): JSX.Element => {
    return <div className={css("spinner", props.className)}>
        &nbsp;
    </div>;
};