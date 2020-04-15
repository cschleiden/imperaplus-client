import * as React from "react";
import __ from "../../i18n/i18n";
import ActiveLink from "../ui/activeLink";

export default (): JSX.Element => {
    return (
        <ul className="nav">
            <li>
                <ActiveLink href="/" activeClassName="active">
                    <a>{__("Home")}</a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink href="/signup" activeClassName="active">
                    <a>{__("Signup")}</a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink href="/login" activeClassName="active">
                    <a>{__("Login")}</a>
                </ActiveLink>
            </li>
        </ul>
    );
};
