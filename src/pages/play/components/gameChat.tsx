import "./gameChat.scss";

import * as React from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import { HumanDate } from "../../../components/ui/humanDate";
import { GameChatMessage } from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { IState } from "../../../reducers";
import { gameChatSendMessage } from "../play.actions";

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
                <div className="game-chat-list" ref={this._resolveListElement}>
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>
                                <div>
                                    <strong className="game-chat-user">
                                        {message.user.name}
                                    </strong>
                                    <span className="game-chat-message">
                                        {message.text}
                                    </span>
                                </div>
                                <div className="game-chat-date">
                                    {HumanDate(message.dateTime)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <form className="form-inline" onSubmit={this._onSubmit}>
                    <div className="input-group">
                        <input
                            className="form-control game-chat-input"
                            disabled={isPending}
                            type="text"
                            value={this.state.value}
                            onChange={this._onChange}
                            ref={this._resolveInputElement}
                        />
                        <Button
                            className="game-chat-button"
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

    @autobind
    private _onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.stopPropagation();
        ev.preventDefault();

        this._send();
    }

    @autobind
    private _onChange(ev: React.FormEvent<HTMLInputElement>) {
        const value = (ev.target as any).value;

        this.setState({
            value,
        });
    }

    @autobind
    private _send() {
        this.props.onSend(this.state.value);

        this.setState({
            value: "",
        });
    }
}

interface IGameChatProps {
    publicMessages: GameChatMessage[];
    teamMessages: GameChatMessage[];

    isPending: boolean;

    send: (message: string, isPublic: boolean) => void;
}

class GameChat extends React.Component<IGameChatProps> {
    render() {
        const { publicMessages, teamMessages, isPending } = this.props;

        return (
            <Tabs id="game-chat" defaultActiveKey={1} className="game-chat">
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

    @autobind
    private _onSend(message: string) {
        this._send(message, false);
    }

    @autobind
    private _onSendPublic(message: string) {
        this._send(message, true);
    }

    private _send(message: string, isPublic: boolean) {
        this.props.send(message, isPublic);
    }
}

export default connect(
    (state: IState) => {
        const gameChat = state.play.gameChat;

        return {
            publicMessages: gameChat.all,
            teamMessages: gameChat.team,
            isPending: gameChat.isPending,
        };
    },
    (dispatch) => ({
        send: (message: string, isPublic: boolean) => {
            dispatch(gameChatSendMessage({ message, isPublic }));
        },
    })
)(GameChat);
