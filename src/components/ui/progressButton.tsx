import "./progressButton.scss";

import * as React from "react";

import { Button, ButtonType, IButtonProps, IButtonState } from "office-ui-fabric-react/lib/Button";

export interface IProgressButtonProps extends IButtonProps {
    isActive?: boolean;
}

export class ProgressButton extends Button {
    public props: IProgressButtonProps;

    constructor(props: IProgressButtonProps) {
        super(props);
    }

    public render(): JSX.Element {
        let className = this.props.className || "";
        className = " progress-button";        

        if (this.props.isActive) {
            className += " progress-button-active";
        }

        return <Button {...this.props} className={className} disabled={this.props.isActive} />;
    }
}