import "./progressButton.scss";

import * as React from "react";

import { Button, ButtonProps } from "react-bootstrap";

export interface IProgressButtonProps extends ButtonProps {
    isActive?: boolean;
}

export const ProgressButton = (props: IProgressButtonProps) => {
    let className = props.className || "";
    className = " progress-button";

    if (props.isActive) {
        className += " progress-button-active";
    }

    return <Button {...props} className={className} disabled={props.disabled || props.isActive} />;
};