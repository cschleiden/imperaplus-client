import * as React from "react";
import { connect } from "react-redux";
import { Link, IndexLink } from "react-router";

import { logout } from "../../common/session/session.actions";

export const GameNavigation = ({ dispatch }): JSX.Element => {
    return <ul className="nav">
        <li>
            <IndexLink to="/game" activeClassName="active">{__("Start")}</IndexLink>
        </li>
        <li>
            <Link to="/game/games" activeClassName="active">{__("Games")}</Link>
            <ul className="nav-dropdown">
                <li>
                    <IndexLink to="/game/games" activeClassName="active">{__("My Games")}</IndexLink>
                </li>
                <li>
                    <Link to="/game/games/create" activeClassName="active">{__("Create Fun Game")}</Link>
                </li>
                <li>
                    <Link to="/game/games/join" activeClassName="active">{__("Join Fun Game")}</Link>
                </li>
                <li>
                    <Link to="/game/games/ladders" activeClassName="active">{__("Ladders")}</Link>
                </li>
                <li>
                    <Link to="/game/games/tournaments" activeClassName="active">{__("Tournaments")}</Link>
                </li>
            </ul>
        </li>
        <li>
            <Link to="/game/alliance" activeClassName="active">{__("Alliance")}</Link>
            <ul className="nav-dropdown">
                <li>
                    <Link to="/game/alliance/create" activeClassName="active">{__("Create")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/join" activeClassName="active">{__("Join")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/admin" activeClassName="active">{__("Admin")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/info" activeClassName="active">{__("Information")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/forum" activeClassName="active">{__("Forum")}</Link>
                </li>
            </ul>
        </li>
        <li>
            <Link to="/game/messages" activeClassName="active">
                <i className="ms-Icon ms-Icon--Mail" aria-hidden="true"></i>
            </Link>
        </li>
        <li>
            <Link to="/game/profile" activeClassName="active">
                <i className="ms-Icon ms-Icon--Contact" aria-hidden="true"></i>
            </Link>
            <ul className="nav-dropdown">
                <li>
                    <Link to="/game/profile" activeClassName="active">{__("Profile")}</Link>
                </li>
                <li>
                    <a href="#" onClick={((e) => {
                        dispatch(logout(null));

                        e.preventDefault();
                        return false;
                    })}>{__("Logout")}</a>
                </li>
            </ul>
        </li>
    </ul>;
};

export default connect()(GameNavigation);