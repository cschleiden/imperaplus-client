import * as React from "react";

/** Page title */
export const Title = (props: React.Props<{}>): JSX.Element => {
    return (
        <h1 className="">
            {props.children}
        </h1>
    );
};

export const Section = (props: { additionalContent?: JSX.Element } & React.Props<{}>): JSX.Element => {
    return (
        <h2 className="headline">
            <span>{props.children}</span>
            {props.additionalContent}
        </h2>
    );
};

export const SubSection = (props: React.Props<{}>): JSX.Element => {
    return (
        <h3 className="headline">
            <span>{props.children}</span>
        </h3>
    );
};