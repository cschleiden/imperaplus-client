import * as React from "react";

import { css } from "../../lib/utils/css";

export const GridContainer = (props): JSX.Element => {
    return (
        <div className={css("container", props.className)}>
            {props.children}
        </div>
    );
};

export const Grid = (props): JSX.Element => {
    return <div className={css(props.className)}>{props.children}</div>;
};

export const GridRow = (props): JSX.Element => {
    return <div className={css("row", props.className)}>{props.children}</div>;
};

export const GridColumn = (props): JSX.Element => {
    return <div className={css("col", props.className)}>{props.children}</div>;
};
