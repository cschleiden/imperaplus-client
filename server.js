const s = _interopRequireDefault(require("next/dist/server/lib/start-server"));
s.default({ dir: "." }, process.env.PORT || 3000)
    .then(async (app) => {
        console.log("Ready!");
        await app.prepare();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
