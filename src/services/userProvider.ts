export namespace UserProvider {
    export let userProvider: () => string = null;
    export let isAdminProvider: () => boolean = null;

    export const getUserId = (): string => {
        return userProvider();
    };

    export const isAdmin = () => (boolean) => {
        return isAdminProvider();
    };
}
