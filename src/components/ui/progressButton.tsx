import "./progressButton.scss";

import * as React from "react";

import { Button, ButtonProps } from "react-bootstrap";
import { css } from "../../lib/css";

export interface IProgressButtonProps extends ButtonProps {
    isActive?: boolean;
}

export const ProgressButton = (props: IProgressButtonProps) => {
    const { isActive, className, disabled, ...buttonProps } = props;

    return <Button {...buttonProps} className={css(className, "progress-button", {
        "progress-button-active": isActive
    })} disabled={disabled || isActive} />;
};