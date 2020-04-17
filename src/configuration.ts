// Tokens will be replaced by build process for specific environments
const config = {
    baseUri: "#{BaseUri}#",
    imageBaseUri: "#{ImageBaseUri}#",
};

function getToken(name: string, defaultValue: string): string {
    const value: string = config[name];

    if (!value || value.startsWith("#")) {
        return defaultValue;
    }

    return value;
}

// Local
// export const baseUri = getToken("baseUri", "https://localhost:5001");

// Development
// export const baseUri = getToken("baseUri", "https://dev.imperaonline.de");

// Production
export const baseUri = getToken("baseUri", "https://www.imperaonline.de");

export const imageBaseUri = getToken(
    "imageBaseUri",
    "https://static.imperaonline.de/maps/"
);
