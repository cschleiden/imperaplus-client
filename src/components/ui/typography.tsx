import * as React from "react";

/** Page title */
export const Title = (props: React.Props<{}>): JSX.Element => {
    return <h1 className="ms-font-su">
        {props.children}
    </h1>;
};

export const Section = (props: React.Props<{}>): JSX.Element => {
    return <h2 className="ms-font-xxl headline">
        <span>{props.children}</span>
    </h2>;
};