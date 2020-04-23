console.log('[config:eslint] config loaded');

module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true
  },
  "globals": {
    "$p": true,
    "FskRefresh": true,
    "localStorage": true,
    "location": true,
    "module": false,
    "PARSELY": true,
    "sessionStorage": true,
    "window": true,
    "__SERVER__": false,
    "__BROWSER__": false
  },
  "extends": ["eslint:recommended", "react-app", "prettier"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "array-callback-return": 0,
    "comma-dangle": 0,
    "default-case": 0,
    "jsx-a11y/anchor-has-content": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "no-case-declarations": 0,
    "no-console": 0,
    "no-empty": 0,
    "no-extra-boolean-cast": 0,
    "no-irregular-whitespace": 0,
    "no-multi-str": 0,
    "no-unused-vars": 1,
    "no-use-before-define": 1,
    "no-useless-escape": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/no-danger-with-children": 0,
    "react/no-unknown-property": 1
  }
};
