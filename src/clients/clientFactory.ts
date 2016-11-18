import { AccountClient } from "../external/imperaClients";

// TODO: CS: Retrieve from config
const baseUri = "http://localhost:57676/";

const clientCache: [any, any][] = [];

export function getClient<TClient>(clientType: new (baseUri: string) => TClient): TClient {
    for (let [cacheClientType, cachedInstance] of clientCache) {
        if (cacheClientType === clientType) {
            return cachedInstance;
        }
    }

    let instance = new clientType(baseUri);
    clientCache.push([clientType, instance]);
    return instance;
}