import * as React from "react";
import { connect } from "react-redux";
import __ from "../../i18n/i18n";
import { logout } from "../../lib/domain/shared/session/session.slice";
import { IState } from "../../reducers";
import { AppDispatch } from "../../store";
import ActiveLink from "../ui/activeLink";

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
                <ActiveLink href="/game" activeClassName="active">
                    <a>{__("News")}</a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink
                    href="/game/games"
                    activeClassName="active"
                    indexRoute={true}
                >
                    <a>
                        {__("Games")}
                        {gameCount > 0 && <span>&nbsp;({gameCount})</span>}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                    </a>
                </ActiveLink>
                <ul className="nav-dropdown">
                    <li>
                        <ActiveLink href="/game/games" activeClassName="active">
                            <a>{__("My Games")}</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink
                            href="/game/games/create"
                            activeClassName="active"
                        >
                            <a>{__("Create Fun Game")}</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink
                            href="/game/games/join"
                            activeClassName="active"
                        >
                            <a>{__("Join Fun Game")}</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink
                            href="/game/ladders"
                            activeClassName="active"
                        >
                            <a>{__("Ladders")}</a>
                        </ActiveLink>
                    </li>
                    {/* <li>
                        <ActiveLink
                            href="/game/tournaments"
                            activeClassName="active"
                        >
                            <a>{__("Tournaments")}</a>
                        </ActiveLink>
                    </li> */}
                </ul>
            </li>
            <li>
                <ActiveLink
                    href="/game/alliances"
                    activeClassName="active"
                    indexRoute={true}
                >
                    <a>
                        {__("Alliance")}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                    </a>
                </ActiveLink>
                <ul className="nav-dropdown">
                    <li>
                        <ActiveLink
                            href="/game/alliances"
                            activeClassName="active"
                        >
                            <a>{__("Alliances")}</a>
                        </ActiveLink>
                    </li>
                    {!memberOfAlliance && (
                        <li>
                            <ActiveLink
                                href="/game/alliances/create"
                                activeClassName="active"
                            >
                                <a>{__("Create alliance")}</a>
                            </ActiveLink>
                        </li>
                    )}
                    {memberOfAlliance && (
                        <li>
                            <ActiveLink
                                as={`/game/alliances/${allianceId}`}
                                href={`/game/alliances/[allianceId]`}
                                activeClassName="active"
                            >
                                <a>{__("Your alliance")}</a>
                            </ActiveLink>
                        </li>
                    )}
                </ul>
            </li>
            <li>
                <ActiveLink
                    href="/game/messages"
                    activeClassName="active"
                    indexRoute={true}
                >
                    <a>
                        <i className="fa fa-envelope" aria-hidden="true" />
                        <span className="visible-xs-inline">
                            &nbsp;{__("Messages")}
                        </span>
                        {messageCount > 0 && (
                            <span>&nbsp;({messageCount})</span>
                        )}
                    </a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink href="/game/profile" activeClassName="active">
                    <a>
                        <i className="fa fa-user" aria-hidden="true" />
                        <span className="visible-xs-inline">
                            &nbsp;{__("Account")}
                        </span>
                    </a>
                </ActiveLink>
                <ul className="nav-dropdown">
                    <li>
                        <ActiveLink
                            href="/game/profile"
                            activeClassName="active"
                        >
                            <a>{userName}</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                logout();

                                e.preventDefault();
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
    (dispatch: AppDispatch) => ({
        logout: () => {
            dispatch(logout());
        },
    })
)(GameNavigation);
