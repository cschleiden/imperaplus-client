import * as React from "react";
import __ from "../../i18n/i18n";
import style from "./loading.module.scss";
import { Spinner, SpinnerSize } from "./spinner";

interface ILoadingProps {
    size?: SpinnerSize;
}

export class Loading extends React.Component<ILoadingProps> {
    public render(): JSX.Element {
        const { size = SpinnerSize.Large } = this.props;

        return (
            <div className={style.loading}>
                <div className={style.loadingSpinner}>
                    <Spinner className="center-block" size={size} />
                </div>
                {__("Loading")}
            </div>
        );
    }
}
