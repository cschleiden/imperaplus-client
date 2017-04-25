import * as React from "react";
import { GridRow, GridColumn } from "../layout";

/* STD AdTag */
export const adTag = (props: React.Props<{}>): JSX.Element => {
    return <GridColumn className="col-xs-12">
        <div className="ads" style={{ background: "grey", width: "728px", height: "90px" }} />
    </GridColumn>;
};

export default adTag;
