import { IImmutable, makeImmutable, push } from "immuts";
import { ChannelInformation, Message } from "../../external/chatModel";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import {
    CLOSE, IStartPayload, IUserEventPayload, JOIN, LEAVE, RECEIVE_MESSAGE, SHOW_HIDE, START,
    SWITCH_CHANNEL
} from "./chat.actions";

const initialState = makeImmutable({
    isVisible: false,
    isActive: false,
    activeChannelId: null as string,
    channels: [] as ChannelInformation[],
    unreadCount: null as number
});

export type IChatState = typeof initialState;

const showHide = (state: IChatState, action: IAction<boolean>) => {
    const isVisible = action.payload;
    return state.__set(x => x, {
        isVisible: isVisible,
        unreadCount: null as number
    });
};

const close = (state: IChatState, action: IAction<void>) => {
    return initialState;
};

const switchChannel = (state: IChatState, action: IAction<string>) => {
    return state.__set(x => x.activeChannelId, action.payload);
};

const start = (state: IChatState, action: IAction<IStartPayload>) => {
    return state.__set(x => x, {
        isActive: true,
        channels: action.payload.channels,
        activeChannelId: action.payload.channels && action.payload.channels.length && action.payload.channels[0].identifier
    });
};

const receiveMessage = (state: IChatState, action: IAction<Message>) => {
    const message = action.payload;

    const channels = state.channels;
    let matchingChannels = channels.filter((c: ChannelInformation) => c.identifier === message.channelIdentifier);
    if (!matchingChannels.length) {
        return;
    }

    const matchingChannel = matchingChannels[0];
    const idx = state.channels.indexOf(matchingChannel);

    return state
        .__set(x => x.channels[idx].messages, x => push(x, message))
        .__set(x => x.unreadCount, !state.isVisible ? (state.unreadCount || 0) + 1 : null);
};

const join = (state: IChatState, action: IAction<IUserEventPayload>) => {
    const channelIdx = getChannelIdxById(state.channels, action.payload.channelId);
    const channel = state.channels[channelIdx];

    return state.__set(x => x.channels[channelIdx], {
        users: channel.users.concat([{
            name: action.payload.userName,
            type: 0
        }])
    });
};

const leave = (state: IChatState, action: IAction<IUserEventPayload>) => {
    const channelIdx = getChannelIdxById(state.channels, action.payload.channelId);
    const channel = state.channels[channelIdx];

    return state.__set(x => x.channels[channelIdx], {
        users: channel.users.filter(u => u.name !== action.payload.userName)
    });
};

export const chat = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [SHOW_HIDE]: showHide,
        [CLOSE]: close,
        [SWITCH_CHANNEL]: switchChannel,
        [START]: start,
        [RECEIVE_MESSAGE]: receiveMessage,
        [JOIN]: join,
        [LEAVE]: leave
    });
};

function getChannelIdxById(channels: ChannelInformation[], channelId: string): number {
    let matchingChannels = channels.filter((c: ChannelInformation) => c.identifier === channelId);
    if (!matchingChannels.length) {
        throw new Error("No matching channel found");
    }

    const matchingChannel = matchingChannels[0];
    return channels.indexOf(matchingChannel);
}