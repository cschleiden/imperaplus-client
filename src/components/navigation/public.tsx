import * as React from "react";
import { IndexLink, Link } from "react-router";

export default (): JSX.Element => {
    return (
        <ul className="nav">
            <li>
                <IndexLink to="/" activeClassName="active">{__("Home")}</IndexLink>
            </li>
            <li>
                <Link to="/signup" activeClassName="active">{__("Signup")}</Link>
            </li>
            <li>
                <Link to="/login" activeClassName="active">{__("Login")}</Link>
            </li>
        </ul>
    );
};