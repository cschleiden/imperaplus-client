import * as React from "react";

/**
 * Base layout for 'play' pages
 */
export default (props): JSX.Element => {
    return React.Children.only(props.children);
};