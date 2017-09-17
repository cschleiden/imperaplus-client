import "./loading.scss";

import * as React from "react";
import { Spinner, SpinnerSize } from "./spinner";

interface ILoadingProps {
    size?: SpinnerSize;
}

export class Loading extends React.Component<ILoadingProps> {
    public render(): JSX.Element {
        const {
            size = SpinnerSize.Large
        } = this.props;

        return <div className="loading">
            <div className="loading-spinner">
                <Spinner className="center-block" size={size} />
            </div>
            {__("Loading")}
        </div>;
    }
}