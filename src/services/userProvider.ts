import { store } from "../store";

export const getUserId = (): string => {
    const userInfo = store.getState().session.userInfo;
    return userInfo && userInfo.userId;
};

export const isAdmin = () => boolean => {
    const userInfo = store.getState().session.userInfo;
    return (
        userInfo &&
        userInfo.roles &&
        userInfo.roles.some(x => x.toLowerCase() === "admin")
    );
};
