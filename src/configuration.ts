// TODO: CS: Retrieve from config
const config = {
    "baseUri": "#{BaseUri}#",
    "imageBaseUri": "#{ImageBaseUri}#"
}

function getToken(name: string, defaultValue: string): string {
    const value: string = config[name];

    if (!value || value.startsWith("#")) {
        return defaultValue;
    }

    return value;
}

export const baseUri = getToken("baseUri", "http://localhost:57676/");
export const imageBaseUri = getToken("imageBaseUri", "https://imperaplus.blob.core.windows.net/maps/");