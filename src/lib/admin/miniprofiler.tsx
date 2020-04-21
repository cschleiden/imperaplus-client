import Head from "next/head";
import { baseUri } from "../../configuration";
import { useAppSelector } from "../../store";

export default () => {
    const isAdmin = useAppSelector((s) =>
        s.session?.userInfo?.roles?.some((r) => r.toLowerCase() == "admin")
    );

    if (isAdmin) {
        return (
            <Head>
                <script
                    id="mini-profiler"
                    src={`${baseUri}/api/admin/profiler/includes.min.js`}
                    {...{
                        "data-path": baseUri + "/api/admin/profiler/",
                        "data-position": "right",
                        "data-authorized": "true",
                        "data-controls": "true",
                        "data-ids": "00000000-0000-0000-0000-000000000000",
                        "data-max-traces": 10,
                        "data-start-hidden": false,
                        "data-toggle-shortcut": "Alt+P",
                    }}
                />
            </Head>
        );
    }

    return null;
};
