import * as React from "react";
import __ from "../i18n/i18n";

export default class ResetTriggeredComponent extends React.Component {
    public render() {
        return (
            <p>
                {__(
                    "We have sent an email with a confirmation code to your registered email address. Please follow the instructions in the email to reset your password."
                )}
            </p>
        );
    }
}
