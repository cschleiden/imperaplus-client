import "./loading.scss";

import * as React from "react";
import { Spinner, SpinnerSize } from "./spinner";

export class Loading extends React.Component {
    public render(): JSX.Element {
        return <div className="loading">
            <div className="loading-spinner">
                <Spinner className="center-block" size={SpinnerSize.Large} />
            </div>
            {__("Loading")}
        </div>;
    }
}