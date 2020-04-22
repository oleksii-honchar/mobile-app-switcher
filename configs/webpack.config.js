const webpackMerge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// Short usage reference
// `NODE_ENV` = development | test | production
// `LOG_LEVEL` = error | warn | info | debug
const generateIndexHtml = require('./webpack/libs/generateIndexHtml');
const pkg = require('../package.json');

const moduleCfg = require('./webpack/module.config');
const baseCfg = require('./webpack/base.config');
const prodCfg = require('./webpack/prod.config');
const resolveCfg = require('./webpack/resolve.config');
const externalsCfg = require('./webpack/externals.config');

console.log(`[config:webpack] "${pkg.name}" config composition started`);

module.exports = (env) => {
  env = env ? env : {};
  env.BUILD_ANALYZE = env.BUILD_ANALYZE ? env.BUILD_ANALYZE : null;

  console.log(`[config:webpack] "${process.env.NODE_ENV}" mode used...`);

  generateIndexHtml(env);

  const envES2015 = { ...env, TS_TARGET: 'es5'};
  const envES2020 = { ...env, TS_TARGET: 'es20'};

  let configs = [ baseCfg(envES2015), baseCfg(envES2020) ];
  configs[0] = webpackMerge(configs[0], moduleCfg(envES2015));
  configs[1] = webpackMerge(configs[1], moduleCfg(envES2020));

  configs = configs.map((cfg) => webpackMerge(cfg, externalsCfg));
  configs = configs.map((cfg) => webpackMerge(cfg, resolveCfg));

  // include core-js for es2015
  configs[0].entry.app = [require.resolve('core-js/stable'), configs[0].entry.app[0]]

  if (env.BUILD_ANALYZE === 'true') {
    console.log('[config:webpack] bundle analyzer included');

    configs[0] = webpackMerge(configs[0], {
      plugins: [ new BundleAnalyzerPlugin() ]
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    configs = configs.map((cfg) => webpackMerge(cfg, {
      devtool: 'inline-source-map',
    }));

    console.log('[config:webpack] config composition completed');

    return configs;
  }

  configs = configs.map((cfg) => webpackMerge(cfg, prodCfg));

  console.log('[config:webpack] config composition completed');
  return configs;
}
