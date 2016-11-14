import * as React from "react";

export const Grid = (props): JSX.Element => {
    return <div className={`ms-Grid ${props.className || ""}`}>{props.children}</div>;
};

export const GridRow = (props): JSX.Element => {
    return <div className={`ms-Grid-row ${props.className || ""}`}>{props.children}</div>;
};

export const GridColumn = (props): JSX.Element => {
    return <div className={`ms-Grid-col ${props.className || ""}`}>{props.children}</div>;
};