import React from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import { GameChatMessage } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { gameChatSendMessage } from "../../lib/domain/game/play/play.slice";
import { css } from "../../lib/utils/css";
import { IState } from "../../reducers";
import { AppDispatch } from "../../store";
import { HumanDate } from "../ui/humanDate";
import style from "./gameChat.module.scss";

interface IGameChatTabProps {
    messages: GameChatMessage[];
    isPending: boolean;

    onSend: (text: string) => void;
}

interface IGameChatTabState {
    value: string;
}

class GameChatTab extends React.Component<
    IGameChatTabProps,
    IGameChatTabState
> {
    private _resolveListElement = (element: HTMLDivElement) =>
        (this._element = element);
    private _element: HTMLDivElement;

    private _resolveInputElement = (element: HTMLInputElement) =>
        (this._inputElement = element);
    private _inputElement: HTMLInputElement;

    constructor(props: IGameChatTabProps, context: any) {
        super(props, context);

        this.state = {
            value: "",
        };
    }

    componentDidUpdate() {
        if (this._element) {
            this._element.scrollTop = this._element.scrollHeight;
        }

        if (this._inputElement) {
            this._inputElement.focus();
        }
    }

    render() {
        const { messages, isPending } = this.props;

        return (
            <div>
                <div
                    className={style.gameChatList}
                    ref={this._resolveListElement}
                >
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>
                                <div>
                                    <strong className={style.gameChatUser}>
                                        {(message.user && message.user.name) ||
                                            __("[Deleted]")}
                                    </strong>
                                    <span>{message.text}</span>
                                </div>
                                <div className={style.gameChatDate}>
                                    {HumanDate(message.dateTime)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <form className="form-inline" onSubmit={this._onSubmit}>
                    <div className={style.gameChatInputGroup}>
                        <input
                            className={css("form-control", style.gameChatInput)}
                            disabled={isPending}
                            type="text"
                            value={this.state.value}
                            onChange={this._onChange}
                            ref={this._resolveInputElement}
                        />
                        <Button
                            className={style.gameChatButton}
                            disabled={isPending}
                            onClick={this._send}
                        >
                            {__("Send")}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    private _onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.stopPropagation();
        ev.preventDefault();

        this._send();
    };

    private _onChange = (ev: React.FormEvent<HTMLInputElement>) => {
        const value = (ev.target as any).value;

        this.setState({
            value,
        });
    };

    private _send = () => {
        if (this.state.value?.trim() !== "") {
            this.props.onSend(this.state.value);
        }

        this.setState({
            value: "",
        });
    };
}

interface IGameChatProps {
    publicMessages: GameChatMessage[];
    teamMessages: GameChatMessage[];

    isPending: boolean;
    teamGame: boolean;

    send: (message: string, isPublic: boolean) => void;
}

class GameChat extends React.Component<IGameChatProps> {
    render() {
        const {
            publicMessages,
            teamMessages,
            isPending,
            teamGame,
        } = this.props;

        if (!teamGame) {
            return (
                <GameChatTab
                    onSend={this._onSendPublic}
                    messages={publicMessages}
                    isPending={isPending}
                />
            );
        }

        return (
            <Tabs
                id="game-chat"
                defaultActiveKey={1}
                className={style.gameChat}
            >
                <Tab eventKey={1} title={__("All")}>
                    <GameChatTab
                        onSend={this._onSendPublic}
                        messages={publicMessages}
                        isPending={isPending}
                    />
                </Tab>

                <Tab eventKey={2} title={__("Team")}>
                    <GameChatTab
                        onSend={this._onSend}
                        messages={teamMessages}
                        isPending={isPending}
                    />
                </Tab>
            </Tabs>
        );
    }

    private _onSend = (message: string) => {
        this._send(message, false);
    };

    private _onSendPublic = (message: string) => {
        this._send(message, true);
    };

    private _send = (message: string, isPublic: boolean) => {
        this.props.send(message, isPublic);
    };
}

export default connect(
    (state: IState) => {
        const gameChat = state.play.gameChat;

        return {
            publicMessages: gameChat.all,
            teamMessages: gameChat.team,
            isPending: gameChat.isPending,
            teamGame: state.play.game?.options?.numberOfPlayersPerTeam > 1,
        };
    },
    (dispatch: AppDispatch) => ({
        send: (message: string, isPublic: boolean) => {
            dispatch(gameChatSendMessage({ message, isPublic }));
        },
    })
)(GameChat);
