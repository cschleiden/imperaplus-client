import {
    makeImmutable,
    push,
} from "../../../src/common/forms/node_modules/immuts";
import { ChannelInformation, Message } from "../../external/chatModel";
import { IAction } from "../../lib/utils/action";
import reducerMap from "../../lib/utils/reducerMap";
import {
    CLOSE,
    IStartPayload,
    IUserEventPayload,
    JOIN,
    LEAVE,
    RECEIVE_MESSAGE,
    SHOW_HIDE,
    START,
    SWITCH_CHANNEL,
} from "./chat.actions";

const initialState = makeImmutable({
    isVisible: false,
    isActive: false,
    activeChannelId: null as string,
    channels: [] as ChannelInformation[],
    unreadCount: null as number,
});

export type IChatState = typeof initialState;

const showHide = (state: IChatState, action: ActionPayload<boolean>) => {
    const isVisible = action.payload;
    return state.__set(x => x, {
        isVisible: isVisible,
        unreadCount: null as number,
    });
};

const close = (state: IChatState, action: ActionPayload<void>) => {
    return initialState;
};

const switchChannel = (state: IChatState, action: ActionPayload<string>) => {
    return state.__set(x => x.activeChannelId, action.payload);
};

const start = (state: IChatState, action: ActionPayload<IStartPayload>) => {
    return state
        .__set(x => x.isActive, true)
        .__set(x => x.channels, action.payload.channels)
        .__set(
            x => x.activeChannelId,
            action.payload.channels &&
                action.payload.channels.length &&
                action.payload.channels[0].identifier
        );
};

const receiveMessage = (state: IChatState, action: ActionPayload<Message>) => {
    const message = action.payload;

    const channels = state.channels;
    let matchingChannels = channels.filter(
        (c: ChannelInformation) => c.identifier === message.channelIdentifier
    );
    if (!matchingChannels.length) {
        return;
    }

    const matchingChannel = matchingChannels[0];
    const idx = state.channels.indexOf(matchingChannel);

    return state
        .__set(
            x => x.channels[idx].messages,
            x => push(x, message)
        )
        .__set(
            x => x.unreadCount,
            !state.isVisible ? (state.unreadCount || 0) + 1 : null
        );
};

const join = (state: IChatState, action: ActionPayload<IUserEventPayload>) => {
    const channelIdx = getChannelIdxById(
        state.channels,
        action.payload.channelId
    );

    return state.__set(
        x => x.channels[channelIdx].users,
        x =>
            x.concat([
                {
                    name: action.payload.userName,
                    type: 0,
                },
            ])
    );
};

const leave = (state: IChatState, action: ActionPayload<IUserEventPayload>) => {
    const channelIdx = getChannelIdxById(
        state.channels,
        action.payload.channelId
    );

    return state.__set(
        x => x.channels[channelIdx].users,
        x => x.filter(u => u.name !== action.payload.userName)
    );
};

export const chat = <TPayload>(
    state = initialState,
    action?: ActionPayload<TPayload>
) => {
    return reducerMap(action, state, {
        [SHOW_HIDE]: showHide,
        [CLOSE]: close,
        [SWITCH_CHANNEL]: switchChannel,
        [START]: start,
        [RECEIVE_MESSAGE]: receiveMessage,
        [JOIN]: join,
        [LEAVE]: leave,
    });
};

function getChannelIdxById(
    channels: ChannelInformation[],
    channelId: string
): number {
    let matchingChannels = channels.filter(
        (c: ChannelInformation) => c.identifier === channelId
    );
    if (!matchingChannels.length) {
        throw new Error("No matching channel found");
    }

    const matchingChannel = matchingChannels[0];
    return channels.indexOf(matchingChannel);
}
