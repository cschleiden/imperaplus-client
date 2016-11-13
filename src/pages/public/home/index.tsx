import * as React from "react";

import { Slider } from "./slider";

export default (): JSX.Element => {
    return <div>
        <Slider background="/assets/slider/slider.gif" slides={[{
            headLines: ["Conquer", "the world"],
            bodyLines: ["Fight", "on more than", "40 maps"],
            img: "/assets/slider/map.png"
        }]} />
    </div>;
};