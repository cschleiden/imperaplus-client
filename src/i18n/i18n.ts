import de from "../../loc/de.json";

export default function __(key: string) {
    if (getLanguage() == "en") {
        // default language
        return key;
    }

    // only other supported language
    return de[key] || key;
}

export function getLanguage(): string {
    return languageProvider?.() || "en";
}

let languageProvider: () => string | undefined;

export function setLanguageProvider(provider: () => string) {
    languageProvider = provider;
}
