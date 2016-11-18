import "./progressButton.scss";

import * as React from "react";

import { Button, ButtonType, IButtonProps, IButtonState } from "office-ui-fabric-react/lib/Button";

export interface IProgressButtonProps extends IButtonProps {
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