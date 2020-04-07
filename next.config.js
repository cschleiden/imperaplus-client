const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({ 
  webpack(config, _) {
    config.devtool = 'eval-source-map';
    return config;
  }
});