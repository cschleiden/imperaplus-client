module.exports = {
    experimental: {
        outputStandalone: true,
    },
    publicRuntimeConfig: {
        baseUri: process.env.BASE_URI,
        useSecureCookies: true,
    }
};
