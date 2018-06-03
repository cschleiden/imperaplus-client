import * as React from "react";

/**
 * Base layout for all public pages
 */
export default (props): JSX.Element => {
    return React.Children.only(props.children);
};