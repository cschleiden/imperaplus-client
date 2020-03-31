export const log = (msg: string): void => {
    if (window.console) {
        // tslint:disable-next-line:no-console
        window.console.log(msg);
    }
};
