import * as React from "react";

import { Link, IndexLink } from "react-router";

export default (): JSX.Element => {
    return <ul className="nav">
        <li>
            <IndexLink to="/game/start" activeClassName="active">Start</IndexLink>
        </li>
        <li>
            <Link to="/signup" activeClassName="active">Games</Link>
            <ul className="nav-dropdown">
                <li>
                    <Link to="/signup" activeClassName="active">My</Link>
                </li>
                <li>
                    <Link to="/signup" activeClassName="active">Create</Link>
                </li>
            </ul>
        </li>
        <li>
            <Link to="/login" activeClassName="active">Logout</Link>
        </li>
    </ul>;
};