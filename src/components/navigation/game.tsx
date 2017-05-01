import * as React from "react";
import { connect } from "react-redux";
import { Link, IndexLink } from "react-router";

import { logout } from "../../common/session/session.actions";
import { IState } from "../../reducers";

export const GameNavigation = ({ dispatch, userName }): JSX.Element => {
    return <ul className="nav">
        <li>
            <IndexLink to="/game" activeClassName="active">{__("News")}</IndexLink>
        </li>
        <li>
            <Link to="/game/games" activeClassName="active">
                {__("Games")}
                <i className="fa fa-angle-down" aria-hidden="true" />
            </Link>
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
                    <Link to="/game/tournaments" activeClassName="active">{__("Tournaments")}</Link>
                </li>
            </ul>
        </li>
        <li>
            <Link to="/game/alliance" activeClassName="active">
                {__("Alliance")}
                <i className="fa fa-angle-down" aria-hidden="true" />
            </Link>
            <ul className="nav-dropdown">
                <li>
                    <Link to="/game/alliance/create" activeClassName="active">{__("Create alliance")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/join" activeClassName="active">{__("Join alliance")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/admin" activeClassName="active">{__("Admin")}</Link>
                </li>
                <li>
                    <Link to="/game/alliance/info" activeClassName="active">{__("Information")}</Link>
                </li>
            </ul>
        </li>
        <li>
            <Link to="/game/messages/message" activeClassName="active">
                <i className="fa fa-envelope" aria-hidden="true" />
                <span className="visible-xs-inline">&nbsp;{__("Messages")}</span>
            </Link>
        </li>
        <li>
            <Link to="/game/profile" activeClassName="active">
                <i className="fa fa-user" aria-hidden="true" />
                <span className="visible-xs-inline">&nbsp;{__("Account")}</span>
            </Link>
            <ul className="nav-dropdown">
                <li className="text-center">
                    {userName}
                </li>
                <li>
                    <Link to="/game/profile/profile" activeClassName="active">{__("Profile")}</Link>
                </li>
                <li>
                    <a href="http://impera.ruesken.de/" target="_blank">{__("Forum")}</a>
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

export default connect((state: IState) => ({
    userName: state.session.data.userInfo.userName
}))(GameNavigation);