import * as React from "react";
import { Button } from "react-bootstrap";
import { css } from "../../lib/utils/css";

export interface IToggleButtonProps {
    initialIsToggled: boolean;

    onToggle?: (isToggled: boolean) => void;

    className?: string;
}

export interface IToggleButtonState {
    isToggled: boolean;
}

export class ToggleButton extends React.Component<
    IToggleButtonProps,
    IToggleButtonState
> {
    constructor(props: IToggleButtonProps) {
        super(props);

        this.state = {
            isToggled: props.initialIsToggled,
        };
    }

    render() {
        return (
            <Button
                className={css(this.props.className, {
                    active: this.state.isToggled,
                })}
                onClick={this._onToggle}
            >
                {this.props.children}
            </Button>
        );
    }

    private _onToggle = () => {
        this.setState(
            {
                isToggled: !this.state.isToggled,
            },
            () => {
                if (this.props.onToggle) {
                    this.props.onToggle(this.state.isToggled);
                }
            }
        );
    };
}
