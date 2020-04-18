import * as React from "react";
import __ from "../i18n/i18n";
import { AppNextPage } from "../store";

const Activated: AppNextPage = () => {
    return (
        <p>
            {__(
                "Your account has been successfully activated. You can login now."
            )}
        </p>
    );
};

Activated.getTitle = () => __("Account Activated");

export default Activated;
