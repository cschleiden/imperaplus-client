module.exports = {
    input: ["src/**/*.{ts,tsx}"],
    output: "./",
    options: {
        func: {
            list: ["__"],
            extensions: [".ts", ".tsx"],
        },
        defaultLng: "en",
        lngs: ["de"],
        resource: {
            loadPath: "loc/{{lng}}.json",
            savePath: "loc/{{lng}}.json",
            jsonIndent: 2,
            lineEnding: "\n",
        },
        sort: true,
        trans: false,
        keySeparator: false,
        nsSeparator: false,
        removeUnusedKeys: true,
    },
};