"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// MobileApplicationSwitcher - vanilla one (file) version
// use https://babeljs.io/repl#?browsers=defaults&build=&builtIns=false&spec=false&loose=false
// to transpile to es5
//----------------------------------------------------------------------------
//----------------------- UTILS
//----------------------------------------------------------------------------

/**
 * String.prototype.startsWith() polyfill
 */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.slice(pos || 0, search.length) === search;
  };
}

function getMasEl() {
  var masEl = document.getElementById('o-mas-vanilla');
  if (!!masEl) return masEl;
  masEl = document.createElement('div');
  masEl.id = 'o-mas-vanilla';
  document.body.appendChild(masEl);
  return masEl;
}

function removeMasEl() {
  var oMasEl = document.getElementById('o-mas-vanilla');
  !!oMasEl && oMasEl.parentNode.removeChild(oMasEl);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function onDocReady(fn) {
  // see if DOM is already available
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function pushLog(data) {
  var bodyLogEl = document.getElementsByClassName('o-mas-body-log')[0];
  if (!bodyLogEl) return;
  var logEl = document.createElement('span');
  logEl.className = 'o-log-item';
  logEl.innerText = data;
  bodyLogEl.appendChild(logEl);
} // emulation of literal ``


function l(literalStr) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (isEmptyObject(params)) return literalStr;
  var res = literalStr;

  for (var key in params) {
    res = res.replace('${' + key + '}', params[key]);
  }

  return res;
} // simplified version of hooks to keep logic similar to react version


function useState(name) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var value = initialValue;

  var setValue = function setValue(newValue) {
    value = newValue;
    var msg = 'mas:' + JSON.stringify({
      name: name,
      value: value
    });
    window.postMessage(msg, '*');
  };

  return [function () {
    return value;
  }, setValue];
}

function useEffect(callback) {
  var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  function checkIfMasMessage(message, callback, dependencies) {
    if (typeof message.data !== 'string') return;
    if (!message.data.startsWith('mas:')) return;
    var strData = message.data.replace('mas:', '');
    var data = null;

    try {
      data = JSON.parse(strData);
    } catch (e) {
      console.error(e);
      return;
    } // <empty> case - trigger every time


    if (dependencies === null) return callback(); // [<name>] trigger if watched value changed

    if (Array.isArray(dependencies) && dependencies.indexOf(data.name) >= 0) return callback();
  } // [] trigger once


  if (Array.isArray(dependencies) && dependencies.length === 0) return callback();
  window.addEventListener('message', function (msg) {
    return checkIfMasMessage(msg, callback, dependencies);
  }, false);
}

function classNames(baseNames) {
  var conditionalNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (isEmptyObject(conditionalNames)) return baseNames;
  var res = baseNames;

  for (var key in conditionalNames) {
    if (conditionalNames[key]) res += ' ' + key;
  }

  return res;
}

var Cookies = {
  get: function get(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();else return "";
  },
  set: function set(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  remove: function remove(cname) {
    Cookies.set(cname, '', -1);
  }
}; //----------------------------------------------------------------------------
//----------------------- VIEWPORT-SIZE
//----------------------------------------------------------------------------
// sources from https://github.com/jarvys/viewportSize

var isBrowser = typeof window !== 'undefined';

function getSize(Name) {
  var size;
  var name = Name.toLowerCase();
  var document = window.document;
  var documentElement = document.documentElement;

  if (window['inner' + Name] === undefined) {
    // IE6 & IE7 don't have window.innerWidth or innerHeight
    size = documentElement['client' + Name];
  } else if (window['inner' + Name] !== documentElement['client' + Name]) {
    // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy
    // Insert markup to test if a media query will match document.doumentElement["client" + Name]
    var bodyElement = document.createElement('body');
    bodyElement.id = 'vpw-test-b';
    bodyElement.style.cssText = 'overflow:scroll';
    var divElement = document.createElement('div');
    divElement.id = 'vpw-test-d';
    divElement.style.cssText = 'position:absolute;top:-1000px'; // Getting specific on the CSS selector so it won't get overridden easily

    divElement.innerHTML = '<style>@media(' + name + ':' + documentElement['client' + Name] + 'px){body#vpw-test-b div#vpw-test-d{' + name + ':7px!important}}</style>';
    bodyElement.appendChild(divElement);
    documentElement.insertBefore(bodyElement, document.head);

    if (divElement['offset' + Name] === 7) {
      // Media query matches document.documentElement["client" + Name]
      size = documentElement['client' + Name];
    } else {
      // Media query didn't match, use window["inner" + Name]
      size = window['inner' + Name];
    } // Cleanup


    documentElement.removeChild(bodyElement);
  } else {
    // Default to use window["inner" + Name]
    size = window['inner' + Name];
  }

  return size;
}

function getHeight() {
  var _ref;

  return (_ref = isBrowser && getSize('Height')) !== null && _ref !== void 0 ? _ref : null;
}

function getWidth() {
  var _ref2;

  return (_ref2 = isBrowser && getSize('Width')) !== null && _ref2 !== void 0 ? _ref2 : null;
} //----------------------------------------------------------------------------
//----------------------- USER-AGENT-UTILS
//----------------------------------------------------------------------------


var getUserAgent = function getUserAgent() {
  var _navigator, _navigator2, _window;

  return ((_navigator = navigator) === null || _navigator === void 0 ? void 0 : _navigator.userAgent) || ((_navigator2 = navigator) === null || _navigator2 === void 0 ? void 0 : _navigator2.vendor) || ((_window = window) === null || _window === void 0 ? void 0 : _window.opera);
};

function isAndroid() {
  var userAgentRegExp = /Android/i;
  return userAgentRegExp.test(getUserAgent());
}

function isIos() {
  var userAgentRegExp = /iPhone|iPad|iPod/i;
  return userAgentRegExp.test(getUserAgent());
}

function isWindows() {
  return navigator.userAgent.match(/IEMobile/i);
}
/**
 * @method isMobile
 * @description define user agent for server and browser
 * @param {string} userAgent - used for server-side. If empty - browser user-agent used
 */


function isMobile() {
  var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var isMobileAgent = null;
  var userAgentRegExp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  if (userAgent) {
    isMobileAgent = userAgentRegExp.test(userAgent);
    return isMobileAgent;
  }

  userAgent = getUserAgent();
  isMobileAgent = userAgentRegExp.test(userAgent);
  var isLessThan768px = getWidth() <= 768;
  return isMobileAgent || isLessThan768px;
}

function getPlatformName() {
  var defaultName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'unknown';
  var platformName = defaultName;

  if (isIos()) {
    platformName = 'ios';
  } else if (isAndroid()) {
    platformName = 'android';
  } else if (isWindows()) {
    platformName = 'windows';
  }

  return platformName;
}

function isFacebookApp() {
  var userAgentRegExp = /FB(AN|AV|BV)/i;
  return userAgentRegExp.test(getUserAgent());
}

var userAgentUtils = {
  isIos: isIos,
  isMobile: isMobile,
  isAndroid: isAndroid,
  isFacebookApp: isFacebookApp,
  getUserAgent: getUserAgent,
  getPlatformName: getPlatformName
}; //----------------------------------------------------------------------------
//----------------------- DEEP-LINK-UTILS
//----------------------------------------------------------------------------

function generateChromeDeepLink(platform, href) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var appHref = href.replace(/https?\:\/\//, '');

  var genOptions = _objectSpread({
    omitExecutionCode: false
  }, options);

  var link = null;
  var deepLink = null;

  var makeExecutable = function makeExecutable(href) {
    return "javascript:window.open('".concat(href, "', '_system')");
  };

  switch (platform) {
    case 'android':
      link = "intent:".concat(appHref, "#Intent;scheme=http;package=com.android.chrome;end");
      break;

    case 'ios':
      link = "googlechrome://".concat(appHref);
      break;

    default:
      throw new Error("generateChromeDeepLink() \"".concat(platform, "\" is not supported!"));
  }

  if (genOptions.omitExecutionCode) return link;
  deepLink = makeExecutable(link);
  return deepLink;
}

function generateApplicationDeepLink(platform, appName, href) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var link = null;

  switch (appName) {
    case 'chrome':
      link = generateChromeDeepLink(platform, href, options);
      break;

    default:
      throw new Error("generateApplicationDeepLink() \"".concat(appName, "\" is not supported!"));
  }

  return link;
} //----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------


function initMobileApplicationSwitcher() {
  var logHeader = '[MobileAppSwitcher(vo)] ';
  var TIMEOUT_TO_SHOW = 1000;
  var COOKIE_TTL = 1; // 1d

  var MAS_DEFAULT_CHOICE_COOKIE = 'MAS-defaultChoice';

  var _useState = useState('isReadyToRender', false),
    _useState2 = _slicedToArray(_useState, 2),
    isReadyToRender = _useState2[0],
    setIsReadyToRender = _useState2[1];

  var _useState3 = useState('isClosed', false),
    _useState4 = _slicedToArray(_useState3, 2),
    isClosed = _useState4[0],
    setIsClosed = _useState4[1];

  var _useState5 = useState('isPopupClosed', false),
    _useState6 = _slicedToArray(_useState5, 2),
    isPopupClosed = _useState6[0],
    setIsPopupClosed = _useState6[1];

  var _useState7 = useState('isAlertClosed', true),
    _useState8 = _slicedToArray(_useState7, 2),
    isAlertClosed = _useState8[0],
    setIsAlertClosed = _useState8[1];

  var _useState9 = useState('isDefaultChoiceAlertClosed', true),
    _useState10 = _slicedToArray(_useState9, 2),
    isDefaultChoiceAlertClosed = _useState10[0],
    setIsDefaultChoiceAlertClosed = _useState10[1];

  var _useState11 = useState('deepLinkChrome', ''),
    _useState12 = _slicedToArray(_useState11, 2),
    deepLinkChrome = _useState12[0],
    setDeepLinkChrome = _useState12[1];

  var _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    deepLinkDefaultChoice = _useState14[0],
    setDeepLinkDefaultChoice = _useState14[1];

  var _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    defaultChoice = _useState16[0],
    setDefaultChoice = _useState16[1];

  var _useState17 = useState('masHtmlStr', ''),
    _useState18 = _slicedToArray(_useState17, 2),
    masHtmlStr = _useState18[0],
    setMasHtmlStr = _useState18[1];

  function checkForCookieReset() {
    var _window$location$sear, _window$location;

    var currLogHeader = logHeader + ' checkForCookieReset()';
    var toReset = (_window$location$sear = !!((_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.search.match(/toResetMasCookie/i))) !== null && _window$location$sear !== void 0 ? _window$location$sear : false;

    if (toReset) {
      pushLog("".concat(currLogHeader, " gonna reset \"").concat(MAS_DEFAULT_CHOICE_COOKIE, "\" cookie"));
      Cookies.remove(MAS_DEFAULT_CHOICE_COOKIE);
    }
  }

  function isNeedToShow() {
    var currLogHeader = logHeader + ' isNeedToShow()';
    var toShow = userAgentUtils.isMobile() && userAgentUtils.isFacebookApp();
    if (toShow) return toShow; // force to show by query params isFbApp

    var fbAppCookie = !!Cookies.get('isFacebookApp');
    pushLog("".concat(currLogHeader, " fbAppCookie = ").concat(fbAppCookie));

    if (!fbAppCookie && typeof window !== 'undefined') {
      var _window$location$sear2, _window$location2;

      toShow = (_window$location$sear2 = !!((_window$location2 = window.location) === null || _window$location2 === void 0 ? void 0 : _window$location2.search.match(/isFacebookApp/i))) !== null && _window$location$sear2 !== void 0 ? _window$location$sear2 : false;
      if (!toShow) return false;
      Cookies.set('toShow', 'true', COOKIE_TTL);
    }

    return toShow;
  }

  function rememberUserChoice(appName) {
    var currLogHeader = logHeader + ' rememberUserChoice()';
    pushLog("".concat(currLogHeader, " gonna set \"").concat(appName, "\" as default choice"));
    Cookies.set('MAS-defaultChoice', appName, COOKIE_TTL);
  }

  function handleCloseOverlayClick(event) {
    event.stopPropagation();
    setIsClosed(true);
    rememberUserChoice('facebook');
  }

  function handleDefaultChoice(platformName, defaultChoice, href) {
    var currLogHeader = logHeader + ' handleDefaultChoice() ';
    pushLog("".concat(currLogHeader, " - ").concat(defaultChoice));
    var link = generateApplicationDeepLink(platformName, defaultChoice, href, {
      omitExecutionCode: true
    });
    setIsPopupClosed(true);
    setIsDefaultChoiceAlertClosed(false);
    setDeepLinkDefaultChoice(link);
    setDefaultChoice(defaultChoice);
  }

  function handleDefaultChoiceBtnClick(event) {
    event.stopPropagation();
    openAppDeepLink(deepLinkDefaultChoice());
  }

  function handleError() {
    rememberUserChoice('facebook'); // close popup and show alert

    setIsPopupClosed(true);
    setIsAlertClosed(false);
    setIsDefaultChoiceAlertClosed(true);
  }

  function openAppDeepLink(appDeepLink) {
    var currLogHeader = logHeader + ' openAppDeepLink() ';
    pushLog("".concat(currLogHeader, " ").concat(appDeepLink));
    var wnd = null;

    try {
      wnd = window.open(appDeepLink, '_system');
    } catch (e) {
      console.error(e);
      pushLog("".concat(currLogHeader, " catch: error opening link"));
      handleError();
    } finally {
      if (!wnd) {
        pushLog("".concat(currLogHeader, " finally: error opening link"));
        handleError();
      } else {
        setIsClosed(true); // all good - just close MAS
      }
    }
  }

  function handleChromeAppBtnClick(event) {
    event.stopPropagation();
    rememberUserChoice('chrome');
    openAppDeepLink(deepLinkChrome());
  }

  function handleAlertBtnClick(event) {
    event.stopPropagation();
    rememberUserChoice('facebook');
    handleCloseOverlayClick(event);
  }

  window.masHandleCloseOverlayClick = handleCloseOverlayClick;
  window.masOpenAppDeepLink = openAppDeepLink;
  window.masHandleChromeAppBtnClick = handleChromeAppBtnClick;
  window.masHandleAlertBtnClick = handleAlertBtnClick;
  window.masHandleDefaultChoiceBtnClick = handleDefaultChoiceBtnClick; // did mount

  useEffect(function () {
    var currLogHeader = logHeader + ' (did mount) ';
    var toShow = isNeedToShow();
    pushLog("".concat(currLogHeader, " toShow = ").concat(toShow));
    if (!toShow) return;
    checkForCookieReset();
    var href = window.location.href;
    var platformName = userAgentUtils.getPlatformName('ios'); // for test only, normal - no value should be provided

    var link = generateApplicationDeepLink(platformName, 'chrome', href, {
      omitExecutionCode: true
    });
    pushLog("".concat(currLogHeader, " Chrome link: ").concat(link));
    setDeepLinkChrome(link);
    var defaultChoice = Cookies.get('MAS-defaultChoice');
    !!defaultChoice && pushLog("".concat(currLogHeader, " default choice is \"").concat(defaultChoice, "\""));

    if (!!defaultChoice && defaultChoice !== 'facebook') {
      handleDefaultChoice(platformName, defaultChoice, href);
    } else if (!!defaultChoice && defaultChoice === 'facebook') {
      return; // just stay in app
    }

    setTimeout(function () {
      return setIsReadyToRender(true);
    }, TIMEOUT_TO_SHOW);
  }, []); // isReadyToRender trigger

  useEffect(function () {
    var currLogHeader = logHeader + ' (isReadyToRender) ';
    pushLog("".concat(currLogHeader, " isReadyToRender = ").concat(isReadyToRender()));

    try {
      render();
    } catch (e) {
      pushLog(e);
    }
  }, ['isReadyToRender']); // any close flag trigger

  useEffect(function () {
    return render();
  }, ['isClosed', 'isPopupClosed', 'isAlertClosed', 'isDefaultChoiceAlertClosed']);

  function render() {
    var currLogHeader = logHeader + ' render() ';
    pushLog(currLogHeader);

    if (!isReadyToRender()) {
      pushLog("".concat(currLogHeader, " not ready to render"));
      removeMasEl();
      return;
    }

    var oMasClasses = classNames('o-mas-vanilla', {
      'o-mas-vanilla--closed': isClosed()
    });
    var oMasPopupClasses = classNames('o-mas-vanilla-popup', {
      'o-mas-vanilla-popup--closed': isPopupClosed()
    });
    var oMasAlertClasses = classNames('o-mas-vanilla-alert', {
      'o-mas-vanilla-alert--closed': isAlertClosed()
    });
    var oMasDefaultChoiceAlertClasses = classNames('o-mas-vanilla-default-choice-alert', {
      'o-mas-vanilla-default-choice-alert--closed': isDefaultChoiceAlertClosed()
    });
    var appName = defaultChoice();
    var appNameUpperCase = !!appName ? appName.replace(/^\w/, function (c) {
      return c.toUpperCase();
    }) : '';
    var newMasHtmlStr = "\n      <div class=\"".concat(oMasClasses, "\">\n        <div class=\"c-mas-vanilla-overlay\" onclick=\"masHandleCloseOverlayClick(event)\" />\n        <div class=\"").concat(oMasPopupClasses, "\">\n          <div class=\"c-mas-vanilla-header\">\n            <span class=\"c-mas-vanilla-header__text\">\n              Our Site Works Best In A Browser\n            </span>\n          </div>\n          <div class=\"o-mas-vanilla-links\">\n            <div class=\"c-mas-app-link\">\n              <img\n                alt=\"Chrome icon\"\n                class=\"c-mas-app-link__icon\"\n                src=\"/Contents/MobileApplicationSwitcher/icons/chrome.svg\"\n              />\n              <span class=\"c-mas-app-link__title\">Chrome</span>\n              <a\n                class=\"c-mas-app-link__button\"\n                onclick=\"masHandleChromeAppBtnClick(event)\"\n              >\n                Open\n              </a>\n            </div>\n          </div>\n        </div>\n        <div class=\"").concat(oMasAlertClasses, "\">\n          <span class=\"o-mas-vanilla-alert__text\">Something went wrong. Please try another option.</span>\n          <a\n            class=\"o-mas-vanilla-alert__ok\"\n            onclick=\"masHandleAlertBtnClick(event)\"\n          >\n            OK\n          </a>\n        </div>\n        <div class=\"").concat(oMasDefaultChoiceAlertClasses, "\">\n          <span class=\"o-mas-vanilla-default-choice-alert__text\">The page will be opened in ").concat(appNameUpperCase, ".</span>\n          <a\n            class=\"o-mas-vanilla-default-choice-alert__button\"\n            onclick=\"masHandleDefaultChoiceBtnClick(event)\"\n          >\n            Open\n          </a>\n        </div>\n      </div>\n    ");
    if (newMasHtmlStr === masHtmlStr()) return; // no changes - no need to rerender

    var masEl = getMasEl();
    masEl.innerHTML = newMasHtmlStr;
    setMasHtmlStr(newMasHtmlStr);
  }
}

onDocReady(initMobileApplicationSwitcher);