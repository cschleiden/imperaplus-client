import * as React from "react";

export default (props): JSX.Element => {
    return <div>
        Play!
        {props.children}
    </div>;
};