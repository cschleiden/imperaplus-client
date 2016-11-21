import * as React from "react";
import { connect } from "react-redux";
import { Link, IndexLink } from "react-router";

import { logout } from "../../actions/session";

export const GameNavigation = ({ dispatch }): JSX.Element => {
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
            <a href="#" onClick={((e) => {
                dispatch(logout(null));

                e.preventDefault();
                return false;
            })}>Logout</a>
        </li>
    </ul>;
};

export default connect()(GameNavigation);