export let onUnauthorized: () => Promise<() => string>;

export const setOnUnauthorized = (callback: () => Promise<() => string>) => {
    onUnauthorized = callback;
};
