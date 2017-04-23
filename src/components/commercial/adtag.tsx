import * as React from "react";
import { GridRow, GridColumn } from "../layout";

/* STD AdTag */
export const adTag = (props: React.Props<{}>): JSX.Element => {
    return <GridColumn className="col-xs-12 content-adslot">
        <div className="container">
            <div style={{width: "728px", height: "90px", margin: "auto", left: 0, right: 0, background: "lightgray"}}></div>
        </div>
    </GridColumn>;
};

export default adTag;