import * as React from "react";

import { Slider } from "./slider";
import { setDocumentTitle } from "../../../lib/title";

export default class Home extends React.Component<{}, void> {
    public componentDidMount() {
        setDocumentTitle(__(""));
    }

    public render() {
        return <div>
            <Slider background="/assets/slider/slider.gif" slides={[{
                headLines: [__("Conquer"), __("the world")],
                bodyLines: [__("Fight"), __("on more than"), __("40 maps")],
                img: "/assets/slider/map.png"
            }]} />
        </div>;
    }
}