module.exports = { 
  webpack(config, _) {
    config.devtool = 'eval-source-map';
    return config;
  }
};