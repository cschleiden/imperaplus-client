import * as React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { css } from "../../lib/utils/css";
import style from "./progressButton.module.scss";

export interface IProgressButtonProps extends ButtonProps {
    isActive?: boolean;
}

export const ProgressButton = (props: IProgressButtonProps) => {
    const { isActive, className, disabled, ...buttonProps } = props;

    return (
        <Button
            {...buttonProps}
            className={css(className, style.progressButton, {
                [style.progressButtonActive]: isActive,
            })}
            disabled={disabled || isActive}
        />
    );
};

export interface ISimpleProgressButtonState {
    isActive: boolean;
}

/**
 * Simple progress button that starts showing progress when clicked
 */
export class SimpleProgressButton extends React.Component<
    ButtonProps,
    ISimpleProgressButtonState
> {
    constructor(props: ButtonProps) {
        super(props);

        this.state = {
            isActive: false,
        };
    }

    public render() {
        return (
            <ProgressButton
                {...this.props}
                onClick={this._onClick}
                isActive={this.state.isActive}
            />
        );
    }

    private _onClick = (event) => {
        const { onClick } = this.props;

        this.setState({
            isActive: true,
        });

        if (onClick) {
            onClick(event);
        }
    };
}

export interface IPromiseProgressButtonProps extends IProgressButtonProps {
    promise: Promise<any>;
}

export const PromiseProgressButton = (props: IPromiseProgressButtonProps) => {
    const { promise, ...buttonProps } = props;

    return <ProgressButton {...buttonProps} />;
};
