import "./progressButton.scss";

import * as React from "react";

import { Button, ButtonProps } from "react-bootstrap";
import { css } from "../../lib/css";

export interface IProgressButtonProps extends ButtonProps {
    isActive?: boolean;
}

export const ProgressButton = (props: IProgressButtonProps) => {
    const className = css(props.className, "progress-button", {
        "progress-button-active": props.isActive
    });

    return <Button {...props} className={className} disabled={props.disabled || props.isActive} />;
};