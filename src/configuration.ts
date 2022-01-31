import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
export const baseUri = publicRuntimeConfig.baseUri;
export const imageBaseUri = "https://static.imperaonline.de/maps/";
export const useSecureCookies: boolean = publicRuntimeConfig.useSecureCookies;
