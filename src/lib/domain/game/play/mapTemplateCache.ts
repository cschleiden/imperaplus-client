import { createClient } from "../../../../clients/clientFactory";
import { imageBaseUri } from "../../../../configuration";
import {
    Continent,
    CountryTemplate,
    MapTemplate,
} from "../../../../external/imperaClients";
import { MapClient } from "../../../../external/MapClient";

export function getCachedMapTemplate(
    mapTemplateName: string
): MapTemplateCacheEntry {
    const mapTemplate = mapTemplateCache[mapTemplateName];
    if (!mapTemplate) {
        throw new Error("Could not find map template in cache.");
    }

    return mapTemplate;
}

export async function fetchMapTemplate(
    token: string,
    name: string
): Promise<MapTemplateCacheEntry> {
    if (!mapTemplateCache[name]) {
        const mapTemplate = await createClient(token, MapClient).getMapTemplate(
            name
        );

        mapTemplateCache[name] = preprocessMapTemplate(mapTemplate);
    }

    return mapTemplateCache[name];
}

export interface MapTemplateCacheEntry extends MapTemplate {
    _continentsByCountryIdentifier: {
        [countryIdentifier: string]: Continent;
    };
    _countries: { [id: string]: CountryTemplate };
    _connections: { [id: string]: { [id: string]: boolean } };
}

function preprocessMapTemplate(mapTemplate: MapTemplate) {
    const mapTemplateEntry = {
        ...mapTemplate,
        _connections: {},
        _continentsByCountryIdentifier: {},
        _countries: {},
    };

    for (let country of mapTemplate.countries) {
        mapTemplateEntry._countries[country.identifier] = country;
    }

    for (let connection of mapTemplate.connections) {
        if (mapTemplateEntry._connections[connection.origin]) {
            mapTemplateEntry._connections[connection.origin][
                connection.destination
            ] = true;
        } else {
            mapTemplateEntry._connections[connection.origin] = {
                [connection.destination]: true,
            };
        }
    }

    let continentId = 0;
    for (const continent of mapTemplate.continents) {
        // Fix continent ids
        continent.id = continentId++;

        for (const country of continent.countries) {
            mapTemplateEntry._continentsByCountryIdentifier[country] =
                continent;
        }
    }

    return mapTemplateEntry;
}

export function mapImage(mapTemplateEntry: MapTemplateCacheEntry): string {
    return `${imageBaseUri}${mapTemplateEntry.image}`;
}

export function country(
    mapTemplateEntry: MapTemplateCacheEntry,
    identifier: string
): CountryTemplate {
    return mapTemplateEntry._countries[identifier];
}

export function continent(
    mapTemplateEntry: MapTemplateCacheEntry,
    identifier: string
): Readonly<Continent> {
    return mapTemplateEntry._continentsByCountryIdentifier[identifier];
}

export function areConnected(
    mapTemplateEntry: MapTemplateCacheEntry,
    origin: string,
    destination: string
) {
    const conn = mapTemplateEntry._connections[origin];
    return conn && conn[destination];
}

export function connections(
    mapTemplateEntry: MapTemplateCacheEntry,
    identifier: string
): string[] {
    return Object.keys(mapTemplateEntry._connections[identifier]);
}

const mapTemplateCache: { [name: string]: MapTemplateCacheEntry } = {};
