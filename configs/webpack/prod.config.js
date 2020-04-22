const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

console.log('[config:webpack:snippet] Production loaded');

module.exports = {
  mode: process.env.NODE_ENV
};
