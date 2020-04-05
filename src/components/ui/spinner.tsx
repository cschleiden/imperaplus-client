import * as React from "react";
import { css } from "../../lib/utils/css";
import style from "./spinner.module.scss";

export enum SpinnerSize {
    Default,
    Large,
}

export const Spinner = (props: {
    size?: SpinnerSize;
    className?: string;
}): JSX.Element => {
    return (
        <div
            className={css(
                style.spinner,
                {
                    large: props.size === SpinnerSize.Large,
                },
                props.className
            )}
        >
            &nbsp;
        </div>
    );
};
