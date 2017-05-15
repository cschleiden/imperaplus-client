import * as React from "react";
import { autobind } from "../../lib/autobind";
import { HumanCountdown } from "./humanDate";


export interface ITimerProps {
    startInMs: number;
}

export interface ITimerState {
    timeLeft: number;
}

export class Timer extends React.Component<ITimerProps, ITimerState> {
    private _handle: number;

    constructor(props: ITimerProps) {
        super(props);

        this.state = {
            timeLeft: props.startInMs
        };
    }

    public render() {
        const { timeLeft } = this.state;

        return <span>{HumanCountdown(timeLeft / 1000)}</span>;
    }

    public componentDidMount() {
        this._handle = setInterval(this._timerHandler, 1000);
    }

    public componentWillMount() {
        if (this._handle) {
            clearInterval(this._handle);
            this._handle = null;
        }
    }

    @autobind
    private _timerHandler() {
        this.setState({
            timeLeft: this.state.timeLeft - 1000
        });
    }
}