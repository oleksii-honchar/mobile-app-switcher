console.log('[config:eslint] config loaded');

module.exports = {
  "presets": [
    [
      "@babel/env",
      {
        "ignoreBrowserslistConfig": true,
        "modules": false,
        "targets": ["last 2 versions", "ie >= 11"],
        "corejs": 3,
        "useBuiltIns": "usage"
      }
    ],
    "@babel/react",
    "@babel/typescript"
  ],
  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/syntax-dynamic-import",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-transform-destructuring",
    "@babel/proposal-object-rest-spread",
    "lodash"
  ],
  "env": {
    "test": {
      "presets": [
        "@babel/env"
      ],
      "plugins": [
        "@babel/syntax-dynamic-import"
      ]
    }
  }
}
