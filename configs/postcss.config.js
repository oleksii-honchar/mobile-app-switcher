console.log('[config:post-css] config loaded')

module.exports = ({ file, options, env }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
    'cssnano': env === 'production' ? options.cssnano : false
  },
});
