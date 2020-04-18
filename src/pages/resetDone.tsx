import * as React from "react";
import { LinkString } from "../components/ui/strLink";
import __ from "../i18n/i18n";

const ResetDone = () => {
    return (
        <p>
            <LinkString
                link={__(
                    "Your password has been reset. You can [login](/login) now."
                )}
            />
        </p>
    );
};

export default ResetDone;
