// import * as Actions from "./chat.actions";
// import { chat, IChatState } from "./chat.reducer";

// const channelId = "123";
// const testUser = "testUser";

// describe("Chat:reducer", () => {
//     let state: IChatState = chat();

//     it("Opening resets unread count", () => {
//         let s = state.__set(x => x.unreadCount, 42);

//         s = chat(s, {
//             type: Actions.SHOW_HIDE,
//             payload: true
//         });

//         expect(s.isVisible).toBe(true);
//         expect(s.unreadCount).toBeNull();
//     });

//     const channelState = state.__set(x => x, {
//         channels: [{
//             identifier: channelId,
//             title: "Channel",
//             messages: [],
//             users: [],
//             persistant: false
//         }],
//         isVisible: true,
//         isActive: true
//     } as any);

//     it("Joining user is added to channel", () => {
//         let s = chat(channelState, Actions.join(channelId, testUser));

//         expect(s.channels[0].users.map(u => u.name)).toContain(testUser);
//     });

//     it("Leaving user is removed from channel", () => {
//         let joinedState = channelState.__set(x => x.channels[0].users, [{
//             name: testUser,
//             type: 0
//         }]);

//         let s = chat(joinedState, Actions.leave(channelId, testUser));

//         expect(s.channels[0].users.map(u => u.name)).not.toContain(testUser);
//     });
// });
