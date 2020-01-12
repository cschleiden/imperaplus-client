import * as React from "react";

export default (props): JSX.Element => {
    return React.Children.only(props.children);
};
