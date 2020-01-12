export let onUnauthorized: () => Promise<any>;

export const setOnUnauthorized = (callback: () => Promise<any>) => {
    onUnauthorized = callback;
};
