import * as React from "react";

import Link from "next/link";

/**
 * Supports links in the form of [text](target)
 */
export const LinkString = (props: { link: string }): JSX.Element => {
    const splitRegex = /(\[[^\]]+\]\([^\)]+\))/g;
    const segmentRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;

    if (!props.link) {
        return null;
    }

    let segments = props.link.split(splitRegex);

    let children: JSX.Element[] = segments.map((segment, idx) => {
        if (segment.match(segmentRegex)) {
            // It's a link, split into text and target
            let matches = segment.split(segmentRegex);
            return (
                <Link href={matches[2]} key={idx}>
                    <a>{matches[1]}</a>
                </Link>
            );
        }

        return <span key={idx}>{segment}</span>;
    });

    return <span>{children}</span>;
};
