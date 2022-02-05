import Head from "next/head";
import React from "react";
import { baseUri } from "../../configuration";
import { useAppSelector } from "../../store";

export default () => {
    const isAdmin = useAppSelector((s) =>
        s.session?.userInfo?.roles?.some((r) => r.toLowerCase() == "admin")
    );

    const [attributes, setAttributes] = React.useState<
        { [name: string]: string } | undefined
    >(undefined);

    React.useEffect(() => {
        if (!isAdmin) {
            return;
        }

        const x = async () => {
            const resp = await fetch(`${baseUri}/api/mini-profiler-includes`);
            const content = await resp.text();

            var parser = new DOMParser();
            var doc = parser.parseFromString(content, "text/html");
            var scriptParsed = doc.querySelector("script");
            if (!scriptParsed) {
                return;
            }

            const a: { [name: string]: string } = {};
            for (var i = 0; i < scriptParsed.attributes.length; i++) {
                var attribute = scriptParsed.attributes[i];

                if (attribute.name == "src" || attribute.name == "data-path") {
                    a[attribute.name] = `${baseUri}${attribute.value}`;
                } else {
                    a[attribute.name] = attribute.value;
                }
            }
            setAttributes(a);

            console.log(a);
        };

        x();
    }, [isAdmin]);

    if (isAdmin && !!attributes) {
        return (
            <Head>
                <script {...attributes} />
            </Head>
        );
    }

    return null;
};
