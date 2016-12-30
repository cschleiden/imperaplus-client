'use strict';

process.env.TEST = true;

module.exports = (config) => {
  config.set({
    frameworks: [
      "jasmine", "karma-typescript"
    ],

    files: [
      "test/i18n.ts",
      "node_modules/jquery/dist/jquery.js",
      { pattern: "src/**/*.ts" }
    ],

    preprocessors: {
      "**/*.ts": [
        "karma-typescript"
      ],
      "**/*.tsx": [
        "karma-typescript"
      ]
    },

    reporters: ["spec"],

    port: 9999,
    colors: true,
    autoWatch: true,
    browsers: ["Chrome"], // Alternatively: 'PhantomJS'
    captureTimeout: 6000,

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    }
  });
};