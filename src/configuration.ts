// Tokens will be replaced by build process for specific environments
const config = {
    baseUri: "#{BaseUri}#",
    imageBaseUri: "#{ImageBaseUri}#",
    useSecureCookies: "#{SecureCookies}#",
};

function getToken(name: string, defaultValue: string): string {
    const value: string = config[name];

    if (!value || value.startsWith("#")) {
        return defaultValue;
    }

    return value;
}
// Production
export const baseUri = getToken("baseUri", "https://www.imperaonline.de");
export const imageBaseUri = getToken(
    "imageBaseUri",
    "https://static.imperaonline.de/maps/"
);
export const useSecureCookies =
    getToken("useSecureCookies", "false") !== "false";
