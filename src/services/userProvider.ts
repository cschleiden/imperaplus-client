export namespace UserProvider {
    export const getUserId = (): string => {
        return userProvider();
    };

    export var userProvider: () => string = null;
}