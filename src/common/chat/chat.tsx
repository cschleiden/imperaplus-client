import * as React from "react";
import { Button, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { ChannelInformation } from "../../external/chatModel";
import { autobind } from "../../lib/autobind";
import { IState } from "../../reducers";
import { close, message, showHide, switchChannel } from "./chat.actions";
import "./chat.scss";

interface IChatProps {
    isVisible: boolean;
    isActive: boolean;
    channels: ChannelInformation[];
    activeChannel: string;
    unreadCount: number;

    showHide: (show: boolean) => void;
    close: () => void;
    send: (msg: string) => void;
    switchChannel: (id: string) => void;
}

interface IChatState {
    msg: string;
}

export class Chat extends React.Component<IChatProps, IChatState> {
    private _content: HTMLDivElement;
    private _resolveContent = (elem: HTMLDivElement) => (this._content = elem);

    constructor(props, context) {
        super(props, context);

        this.state = {
            msg: "",
        };
    }

    public render(): JSX.Element {
        if (!this.props.isActive) {
            return (
                <div className="chat-button">
                    <Button onClick={this._onShow}>{__("Open chat")}</Button>
                </div>
            );
        } else {
            // Chat is active
            const activeChannel = this.props.channels.filter(
                (c) => c.identifier === this.props.activeChannel
            )[0];

            if (this.props.isVisible) {
                // Show chat window
                return (
                    <div className="chat-window">
                        <div className="chat-header">
                            <div>
                                <ul>
                                    {(this.props.channels &&
                                        this.props.channels.map((c) => (
                                            <li
                                                key={c.identifier}
                                                className={
                                                    this.props.activeChannel ===
                                                        c.identifier &&
                                                    "selected"
                                                }
                                            >
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this._switchChannel(
                                                            c.identifier
                                                        );
                                                        return false;
                                                    }}
                                                >
                                                    {c.title}
                                                </a>
                                            </li>
                                        ))) ||
                                        []}
                                </ul>
                            </div>

                            <div className="chat-actions">
                                <Button
                                    onClick={this._onHide}
                                    title={__("Hide")}
                                >
                                    <span className="glyphicon glyphicon-menu-down" />
                                </Button>
                                <Button
                                    onClick={this._onClose}
                                    title={__("Close")}
                                >
                                    <span className="glyphicon glyphicon-remove" />
                                </Button>
                            </div>
                        </div>

                        <div className="chat-content">
                            <div
                                className="chat-content-messages"
                                ref={this._resolveContent}
                            >
                                <ul>
                                    {activeChannel.messages.map((msg, i) => (
                                        <li
                                            key={`${
                                                msg.userName
                                            }-${msg.dateTime.toISOString()}-${i}`}
                                        >
                                            [
                                            <span className="chat-date">
                                                {(msg.dateTime &&
                                                    msg.dateTime.toLocaleString()) ||
                                                    i}
                                            </span>
                                            ]&nbsp;
                                            <span className="chat-user">
                                                {msg.userName}
                                            </span>
                                            :&nbsp;
                                            <span className="chat-message">
                                                {msg.text}
                                            </span>
                                        </li>
                                    ))}

                                    <li className="last-element" />
                                </ul>
                            </div>

                            <div className="chat-content-users">
                                <ul>
                                    {activeChannel.users.map((u) => (
                                        <li key={u.name}>{u.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="chat-input">
                            <form onSubmit={this._onSend}>
                                <FormControl
                                    {...({
                                        autoComplete: "new-password",
                                    } as any)}
                                    placeholder={__("Enter your message...")}
                                    value={this.state.msg}
                                    onChange={this._onChange}
                                />
                                <Button
                                    disabled={!this._isValid()}
                                    type="submit"
                                >
                                    {__("Send")}
                                </Button>
                            </form>
                        </div>
                    </div>
                );
            } else {
                const unreadCount = this.props.unreadCount;

                return (
                    <div className="chat-button">
                        <Button onClick={this._onShow}>
                            {unreadCount > 0 ? (
                                unreadCount
                            ) : (
                                <i
                                    className="fa fa-envelope-o"
                                    aria-hidden="true"
                                />
                            )}
                        </Button>
                    </div>
                );
            }
        }
    }

    public componentDidUpdate() {
        if (this._content) {
            this._content.scrollTop = this._content.scrollHeight;
        }
    }

    private _onChange = (event) => {
        this.setState({
            msg: event.target.value,
        });
    };

    private _isValid() {
        return this.state.msg !== "";
    }

    private _onShow = () => {
        this.props.showHide(true);
    };

    private _onHide = () => {
        this.props.showHide(false);
    };

    private _onClose = () => {
        this.props.close();
    };

    private _switchChannel = (channelId: string) => {
        this.props.switchChannel(channelId);
    };

    @autobind
    private _onSend(ev: React.FormEvent<HTMLFormElement>) {
        ev.stopPropagation();
        ev.preventDefault();

        this.props.send(this.state.msg);

        this.setState({
            msg: "",
        });
    }
}

export default connect(
    (state: IState) => {
        const chat = state.chat;

        return {
            isVisible: chat.isVisible,
            isActive: chat.isActive,
            channels: chat.channels,
            activeChannel: chat.activeChannelId,
            unreadCount: chat.unreadCount,
        };
    },
    (dispatch) => ({
        showHide: (show: boolean) => {
            dispatch(showHide(show));
        },
        close: () => {
            dispatch(close());
        },
        send: (msg: string) => {
            dispatch(message(msg));
        },
        switchChannel: (id: string): void => {
            dispatch(switchChannel(id));
        },
    })
)(Chat);
