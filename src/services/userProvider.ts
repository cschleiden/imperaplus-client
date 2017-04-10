export namespace UserProvider {
    export let userProvider: () => string = null;

    export const getUserId = (): string => {
        return userProvider();
    };
}