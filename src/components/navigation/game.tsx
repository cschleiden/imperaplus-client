import * as React from "react";
import { connect } from "react-redux";
import { IndexLink, Link } from "react-router";
import { logout } from "../../common/session/session.actions";
import { IState } from "../../reducers";

interface IGameNavigation {
    userName: string;

    gameCount: number;

    messageCount: number;

    memberOfAlliance: boolean;

    allianceAdmin: boolean;

    allianceId: string;

    logout: () => void;
}

const GameNavigation = (props: IGameNavigation): JSX.Element => {
    const {
        userName,
        gameCount,
        messageCount,
        logout,
        memberOfAlliance,
        allianceId,
    } = props;

    return (
        <ul className="nav">
            <li>
                <IndexLink to="/game" activeClassName="active">
                    {__("News")}
                </IndexLink>
            </li>
            <li>
                <Link to="/game/games" activeClassName="active">
                    {__("Games")}
                    {gameCount > 0 && <span>&nbsp;({gameCount})</span>}
                    <i className="fa fa-angle-down" aria-hidden="true" />
                </Link>
                <ul className="nav-dropdown">
                    <li>
                        <IndexLink to="/game/games" activeClassName="active">
                            {__("My Games")}
                        </IndexLink>
                    </li>
                    <li>
                        <Link to="/game/games/create" activeClassName="active">
                            {__("Create Fun Game")}
                        </Link>
                    </li>
                    <li>
                        <Link to="/game/games/join" activeClassName="active">
                            {__("Join Fun Game")}
                        </Link>
                    </li>
                    <li>
                        <Link to="/game/ladders" activeClassName="active">
                            {__("Ladders")}
                        </Link>
                    </li>
                    <li>
                        <Link to="/game/tournaments" activeClassName="active">
                            {__("Tournaments")}
                        </Link>
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
                        <IndexLink
                            to="/game/alliances"
                            activeClassName="active"
                        >
                            {__("Alliances")}
                        </IndexLink>
                    </li>
                    {!memberOfAlliance && (
                        <li>
                            <Link
                                to="/game/alliances/create"
                                activeClassName="active"
                            >
                                {__("Create alliance")}
                            </Link>
                        </li>
                    )}
                    {memberOfAlliance && (
                        <li>
                            <Link
                                to={`/game/alliances/${allianceId}`}
                                activeClassName="active"
                            >
                                {__("Your alliance")}
                            </Link>
                        </li>
                    )}
                </ul>
            </li>
            <li>
                <Link to="/game/messages" activeClassName="active">
                    <i className="fa fa-envelope" aria-hidden="true" />
                    <span className="visible-xs-inline">
                        &nbsp;{__("Messages")}
                    </span>
                    {messageCount > 0 && <span>&nbsp;({messageCount})</span>}
                </Link>
            </li>
            <li>
                <Link to="/game/profile" activeClassName="active">
                    <i className="fa fa-user" aria-hidden="true" />
                    <span className="visible-xs-inline">
                        &nbsp;{__("Account")}
                    </span>
                </Link>
                <ul className="nav-dropdown">
                    <li>
                        <Link to="/game/profile" activeClassName="active">
                            {userName}
                        </Link>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={e => {
                                logout();

                                e.preventDefault();
                                return false;
                            }}
                        >
                            {__("Logout")}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    );
};

export default connect(
    (state: IState) => {
        const session = state.session;
        const gameCount =
            (session &&
                session.notifications &&
                session.notifications.numberOfGames) ||
            0;
        const messageCount =
            (session &&
                session.notifications &&
                session.notifications.numberOfMessages) ||
            0;
        const allianceId = session.userInfo && session.userInfo.allianceId;
        const memberOfAlliance =
            session.userInfo && !!session.userInfo.allianceId;
        const allianceAdmin =
            memberOfAlliance && session.userInfo.allianceAdmin;

        return {
            userName: session && session.userInfo && session.userInfo.userName,
            gameCount,
            messageCount,
            memberOfAlliance,
            allianceAdmin,
            allianceId,
        };
    },
    dispatch => ({
        logout: () => {
            dispatch(logout(null));
        },
    })
)(GameNavigation);
