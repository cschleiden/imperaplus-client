import * as React from "react";


export function format(format: string, ...formatArgs: (JSX.Element | string | number)[]): JSX.Element {
    const elements = format.split(/({\d+})/g).map((match: string, index: number) => {
        if (match.substr(0, 1) === "{") {
            const idx = parseInt(match.replace("{", "").replace("}", ""), 10);

            if (formatArgs[idx] !== undefined) {
                return formatArgs[idx];
            }
        }

        return <span key={index}>{match}</span>;
    });

    return <span>
        {elements}
    </span>;
};