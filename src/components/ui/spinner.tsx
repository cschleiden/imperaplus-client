import * as React from "react";

import { css } from "../../lib/css";
import "./spinner.scss";

export enum SpinnerSize {
    Default,
    Large
}

export const Spinner = (props: {
    size?: SpinnerSize;
    className?: string;
}): JSX.Element => {
    return <div className={css("spinner", {
        "large": props.size === SpinnerSize.Large
    }, props.className)}>
        &nbsp;
    </div>;
};