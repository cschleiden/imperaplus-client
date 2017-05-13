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

// export const baseUri = getToken("baseUri", "http://localhost:57676/");
export const baseUri = getToken("baseUri", "https://dev.imperaonline.de/");
export const imageBaseUri = getToken("imageBaseUri", "https://static.imperaonline.de/maps/");