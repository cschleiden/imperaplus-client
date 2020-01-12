export namespace TokenProvider {
    export let tokenRetriever: () => string = null;

    export function getToken(): string {
        return (tokenRetriever && tokenRetriever()) || null;
    }
}
