console.log('[config:webpack:snippet] React loaded');

module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
  }
};
