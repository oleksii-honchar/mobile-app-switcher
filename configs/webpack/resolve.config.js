const path = require('path')

console.log('[config:webpack:snippet] Resolve loaded');

function resolve(dir) {
  return path.join(__dirname, '../..', dir)
}

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.html', '.ts', '.tsx', '.mjs'],
    modules: [
      'src',
      'node_modules',
    ],
    alias: {
      '@components': resolve('src/components'),
      '@containers': resolve('src/containers'),
      '@contexts': resolve('src/reducers'),
      '@logger': resolve('src/utils/logger.js'),
      '@pages': resolve('src/pages'),
      '@providers': resolve('src/providers'),
      '@reducers': resolve('src/reducers'),
      '@utils': resolve('src/utils'),
    }
  }
}