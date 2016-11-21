export namespace TokenProvider {
    export var tokenRetriever: () => string = null;

    export function getToken(): string {
        return tokenRetriever && tokenRetriever() || null;
    }
}