
import { getCachedClient } from "../../clients/clientFactory";
import { MapClient, CountryTemplate, MapTemplate } from "../../external/imperaClients";
import { imageBaseUri } from "../../configuration";

export function getMapTemplate(name: string): Promise<MapTemplateCacheEntry> {
    if (mapTemplateCache[name]) {
        return mapTemplateCache[name];
    }

    return getCachedClient(MapClient).getMapTemplate(name).then(mapTemplate => {
        mapTemplateCache[name] = Promise.resolve(new MapTemplateCacheEntry(mapTemplate));

        return mapTemplateCache[name];
    });
}

export class MapTemplateCacheEntry {
    private _countries: { [id: string]: CountryTemplate } = {};
    private _connections: { [id: string]: { [id: string]: boolean } } = {};

    constructor(public mapTemplate: MapTemplate) {
        for (let country of mapTemplate.countries) {
            this._countries[country.identifier] = country;
        }

        for (let connection of mapTemplate.connections) {
            if (this._connections[connection.origin]) {
                this._connections[connection.origin][connection.destination] = true;
            } else {
                this._connections[connection.origin] = { [connection.destination]: true };
            }
        }
    }

    get countries(): CountryTemplate[] {
        return this.mapTemplate.countries;
    }

    get image(): string {
        return `${imageBaseUri}${this.mapTemplate.image}`;
    }

    country(identifier: string): CountryTemplate {
        return this._countries[identifier];
    }

    areConnected(origin: string, destination: string) {
        const conn = this._connections[origin];
        return conn && conn[destination];
    }

    connections(identifier: string): string[] {
        return Object.keys(this._connections[identifier]);
    }
}

const mapTemplateCache: { [name: string]: Promise<MapTemplateCacheEntry> } = {};
