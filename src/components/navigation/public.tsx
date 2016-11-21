import * as React from "react";

import { Link, IndexLink } from "react-router";

export default (): JSX.Element => {
    return <ul className="nav">
        <li>
            <IndexLink to="/" activeClassName="active">Home</IndexLink>
        </li>
        <li>
            <Link to="/signup" activeClassName="active">Signup</Link>
        </li>
        <li>
            <Link to="/login" activeClassName="active">Login</Link>
        </li>
    </ul>;
};