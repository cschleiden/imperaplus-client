export let onUnauthorized: () => Promise<() => string> | undefined;

export const setOnUnauthorized = (callback: () => Promise<() => string>) => {
    onUnauthorized = callback;
};
