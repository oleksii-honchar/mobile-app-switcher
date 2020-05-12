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
  String.prototype.startsWith = function(search, pos){
    return this.slice(pos || 0, search.length) === search;
  };
}

function getMasEl () {
  let masEl = document.getElementById('o-mas-vanilla')
  if (!!masEl) return masEl

  masEl = document.createElement('div')
  masEl.id = 'o-mas-vanilla'

  document.body.appendChild(masEl)

  return masEl
}

function removeMasEl() {
  const oMasEl = document.getElementById('o-mas-vanilla')
  !!oMasEl && oMasEl.parentNode.removeChild(oMasEl)
}

function isEmptyObject (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

function onDocReady(fn) {
  // see if DOM is already available
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // call on next available tick
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

function pushLog (data) {
  const bodyLogEl = document.getElementsByClassName('o-mas-body-log')[0]
  if (!bodyLogEl) return

  const logEl = document.createElement('span')
  logEl.className = 'o-log-item'
  logEl.innerText = data

  bodyLogEl.appendChild(logEl)
}

// emulation of literal ``
function l (literalStr, params = {}) {
  if (isEmptyObject(params)) return literalStr

  let res = literalStr
  for (const key in params) {
    res = res.replace('${' + key + '}', params[key])
  }

  return res
}

// simplified version of hooks to keep logic similar to react version
function useState (name, initialValue = null) {
  let value = initialValue

  const setValue = (newValue) => {
    value = newValue

    const msg = 'mas:' + JSON.stringify({
      name,
      value
    })
    window.postMessage(msg, '*')
  }

  return [
    () => value,
    setValue
  ]
}

function useEffect (callback, dependencies = null) {
  function checkIfMasMessage (message, callback, dependencies) {
    if (typeof message.data !== 'string') return
    if (!message.data.startsWith('mas:')) return

    const strData = message.data.replace('mas:','')
    let data = null
    try {
      data = JSON.parse(strData)
    } catch (e) {
      console.error(e)
      return
    }

    // <empty> case - trigger every time
    if (dependencies === null) return callback()

    // [<name>] trigger if watched value changed
    if (Array.isArray(dependencies) && dependencies.indexOf(data.name) >= 0) return callback()
  }

  // [] trigger once
  if (Array.isArray(dependencies) && dependencies.length === 0) return callback()

  window.addEventListener(
    'message',
    (msg) => checkIfMasMessage(msg, callback, dependencies),
    false
  )
}

function classNames(baseNames, conditionalNames = {}) {
  if (isEmptyObject(conditionalNames)) return baseNames

  let res = baseNames
  for (const key in conditionalNames) {
    if (conditionalNames[key]) res += ' ' + key
  }

  return res
}

const Cookies = {
  get: function get(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2)
      return parts.pop().split(";").shift();
    else
      return "";
  },
  set: function (cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  remove: function (cname) {
    Cookies.set(cname, '', -1)
  }
}

//----------------------------------------------------------------------------
//----------------------- VIEWPORT-SIZE
//----------------------------------------------------------------------------

// sources from https://github.com/jarvys/viewportSize

const isBrowser = typeof window !== 'undefined'

function getSize(Name) {
  let size
  let name = Name.toLowerCase()
  let document = window.document
  let documentElement = document.documentElement
  if (window['inner' + Name] === undefined) {
    // IE6 & IE7 don't have window.innerWidth or innerHeight
    size = documentElement['client' + Name]
  } else if (window['inner' + Name] !== documentElement['client' + Name]) {
    // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

    // Insert markup to test if a media query will match document.doumentElement["client" + Name]
    let bodyElement = document.createElement('body')
    bodyElement.id = 'vpw-test-b'
    bodyElement.style.cssText = 'overflow:scroll'
    let divElement = document.createElement('div')
    divElement.id = 'vpw-test-d'
    divElement.style.cssText = 'position:absolute;top:-1000px'
    // Getting specific on the CSS selector so it won't get overridden easily
    divElement.innerHTML =
      '<style>@media(' +
      name +
      ':' +
      documentElement['client' + Name] +
      'px){body#vpw-test-b div#vpw-test-d{' +
      name +
      ':7px!important}}</style>'
    bodyElement.appendChild(divElement)
    documentElement.insertBefore(bodyElement, document.head)

    if (divElement['offset' + Name] === 7) {
      // Media query matches document.documentElement["client" + Name]
      size = documentElement['client' + Name]
    } else {
      // Media query didn't match, use window["inner" + Name]
      size = window['inner' + Name]
    }
    // Cleanup
    documentElement.removeChild(bodyElement)
  } else {
    // Default to use window["inner" + Name]
    size = window['inner' + Name]
  }
  return size
}

function getHeight() {
  return (isBrowser && getSize('Height')) ?? null
}
function getWidth() {
  return (isBrowser && getSize('Width')) ?? null
}

//----------------------------------------------------------------------------
//----------------------- USER-AGENT-UTILS
//----------------------------------------------------------------------------

const getUserAgent = () => navigator?.userAgent || navigator?.vendor || window?.opera

function isAndroid() {
  const userAgentRegExp = /Android/i
  return userAgentRegExp.test(getUserAgent())
}

function isIos() {
  const userAgentRegExp = /iPhone|iPad|iPod/i
  return userAgentRegExp.test(getUserAgent())
}

function isWindows() {
  return navigator.userAgent.match(/IEMobile/i)
}

/**
 * @method isMobile
 * @description define user agent for server and browser
 * @param {string} userAgent - used for server-side. If empty - browser user-agent used
 */
function isMobile(userAgent = null) {
  let isMobileAgent = null
  const userAgentRegExp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  if (userAgent) {
    isMobileAgent = userAgentRegExp.test(userAgent)
    return isMobileAgent
  }

  userAgent = getUserAgent()
  isMobileAgent = userAgentRegExp.test(userAgent)

  const isLessThan768px = getWidth() <= 768

  return isMobileAgent || isLessThan768px
}

function getPlatformName(defaultName = 'unknown') {
  let platformName = defaultName

  if (isIos()) {
    platformName = 'ios'
  } else if (isAndroid()) {
    platformName = 'android'
  } else if (isWindows()) {
    platformName = 'windows'
  }

  return platformName
}

function isFacebookApp () {
  const userAgentRegExp = /FB(AN|AV|BV)/i
  return userAgentRegExp.test(getUserAgent())
}

const userAgentUtils = {
  isIos,
  isMobile,
  isAndroid,
  isFacebookApp,
  getUserAgent,
  getPlatformName
}

//----------------------------------------------------------------------------
//----------------------- DEEP-LINK-UTILS
//----------------------------------------------------------------------------

function generateChromeDeepLink(platform, href, options = {}) {
  const appHref = href.replace(/https?\:\/\//, '')
  const genOptions = {
    omitExecutionCode: false,
    ...options,
  }

  let link = null
  let deepLink = null

  const makeExecutable = href => `javascript:window.open('${href}', '_system')`

  switch (platform) {
    case 'android':
      link = `intent:${appHref}#Intent;scheme=http;package=com.android.chrome;end`
      break
    case 'ios':
      link = `googlechrome://${appHref}`
      break
    default:
      throw new Error(
        `generateChromeDeepLink() "${platform}" is not supported!`
      )
  }

  if (genOptions.omitExecutionCode) return link

  deepLink = makeExecutable(link)
  return deepLink
}

function generateApplicationDeepLink(
  platform,
  appName,
  href,
  options = {}
) {
  let link = null
  switch (appName) {
    case 'chrome':
      link = generateChromeDeepLink(platform, href, options)
      break
    default:
      throw new Error(
        `generateApplicationDeepLink() "${appName}" is not supported!`
      )
  }

  return link
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function initMobileApplicationSwitcher() {
  const logHeader = '[MobileAppSwitcher(vo)] '

  const TIMEOUT_TO_SHOW = 1000
  const COOKIE_TTL = 1 // 1d
  const MAS_DEFAULT_CHOICE_COOKIE = 'MAS-defaultChoice'

  const [isReadyToRender, setIsReadyToRender] = useState('isReadyToRender', false)
  const [isClosed, setIsClosed] = useState('isClosed', false)
  const [isPopupClosed, setIsPopupClosed] = useState('isPopupClosed', false)
  const [isAlertClosed, setIsAlertClosed] = useState('isAlertClosed', true)
  const [isDefaultChoiceAlertClosed, setIsDefaultChoiceAlertClosed] = useState('isDefaultChoiceAlertClosed', true)
  const [deepLinkChrome, setDeepLinkChrome] = useState('deepLinkChrome', '')
  const [deepLinkDefaultChoice, setDeepLinkDefaultChoice] = useState('')
  const [defaultChoice, setDefaultChoice] = useState('')
  const [masHtmlStr, setMasHtmlStr] = useState('masHtmlStr', '')

  function checkForCookieReset () {
    const currLogHeader = logHeader + ' checkForCookieReset()'
    const toReset = !!window.location?.search.match(/toResetMasCookie/i) ?? false
    if (toReset) {
      pushLog(`${currLogHeader} gonna reset "${MAS_DEFAULT_CHOICE_COOKIE}" cookie`)
      Cookies.remove(MAS_DEFAULT_CHOICE_COOKIE)
    }
  }

  function isNeedToShow() {
    const currLogHeader = logHeader + ' isNeedToShow()'

    let toShow = userAgentUtils.isMobile() && userAgentUtils.isFacebookApp()

    if (toShow) return toShow

    // force to show by query params isFbApp
    const fbAppCookie = !!Cookies.get('isFacebookApp')
    pushLog(`${currLogHeader} fbAppCookie = ${fbAppCookie}`)
    if (!fbAppCookie && typeof window !== 'undefined') {
      toShow = !!window.location?.search.match(/isFacebookApp/i) ?? false
      if (!toShow) return false

      Cookies.set('toShow', 'true', COOKIE_TTL)
    }

    return toShow
  }

  function rememberUserChoice(appName) {
    const currLogHeader = logHeader + ' rememberUserChoice()'
    pushLog(`${currLogHeader} gonna set "${appName}" as default choice`)
    Cookies.set('MAS-defaultChoice', appName, COOKIE_TTL)
  }

  function handleCloseOverlayClick(event) {
    event.stopPropagation()

    setIsClosed(true)
    rememberUserChoice('facebook')
  }

  function handleDefaultChoice(platformName, defaultChoice, href) {
    const currLogHeader = logHeader + ' handleDefaultChoice() '
    pushLog(`${currLogHeader} - ${defaultChoice}`)

    const link = generateApplicationDeepLink(platformName, defaultChoice, href, { omitExecutionCode: true })

    setIsPopupClosed(true)
    setIsDefaultChoiceAlertClosed(false)
    setDeepLinkDefaultChoice(link)
    setDefaultChoice(defaultChoice)
  }

  function handleDefaultChoiceBtnClick (event)  {
    event.stopPropagation()
    openAppDeepLink(deepLinkDefaultChoice())
  }

  function handleError() {
    rememberUserChoice('facebook')

    // close popup and show alert
    setIsPopupClosed(true)
    setIsAlertClosed(false)
    setIsDefaultChoiceAlertClosed(true)
  }

  function openAppDeepLink(appDeepLink) {
    const currLogHeader = logHeader + ' openAppDeepLink() '
    pushLog(`${currLogHeader} ${appDeepLink}`)

    let wnd = null
    try {
      wnd = window.open(appDeepLink, '_system')
    } catch (e) {
      console.error(e)
      pushLog(`${currLogHeader} catch: error opening link`)
      handleError()
    } finally {
      if (!wnd) {
        pushLog(`${currLogHeader} finally: error opening link`)
        handleError()
      } else {
        setIsClosed(true) // all good - just close MAS
      }
    }
  }

  function handleChromeAppBtnClick (event) {
    event.stopPropagation()
    rememberUserChoice('chrome')
    openAppDeepLink(deepLinkChrome())
  }

  function handleAlertBtnClick (event) {
    event.stopPropagation()
    rememberUserChoice('facebook')
    handleCloseOverlayClick(event)
  }

  window.masHandleCloseOverlayClick = handleCloseOverlayClick
  window.masOpenAppDeepLink = openAppDeepLink
  window.masHandleChromeAppBtnClick = handleChromeAppBtnClick
  window.masHandleAlertBtnClick = handleAlertBtnClick
  window.masHandleDefaultChoiceBtnClick = handleDefaultChoiceBtnClick

  // did mount
  useEffect(() => {
    const currLogHeader = logHeader + ' (did mount) '

    const toShow = isNeedToShow()
    pushLog(`${currLogHeader} toShow = ${toShow}`)

    if (!toShow) return

    checkForCookieReset()

    const href = window.location.href
    const platformName = userAgentUtils.getPlatformName('ios') // for test only, normal - no value should be provided

    const link = generateApplicationDeepLink(platformName, 'chrome', href, { omitExecutionCode: true })
    pushLog(`${currLogHeader} Chrome link: ${link}`)
    setDeepLinkChrome(link)

    const defaultChoice = Cookies.get('MAS-defaultChoice')
    !!defaultChoice && pushLog(`${currLogHeader} default choice is "${defaultChoice}"`)
    if (!!defaultChoice && defaultChoice !== 'facebook') {
      handleDefaultChoice(platformName, defaultChoice, href)
    } else if (!!defaultChoice && defaultChoice === 'facebook') {
      return // just stay in app
    }

    setTimeout(() => setIsReadyToRender(true), TIMEOUT_TO_SHOW)
  }, [])

  // isReadyToRender trigger
  useEffect(() => {
    const currLogHeader = logHeader + ' (isReadyToRender) '
    pushLog(`${currLogHeader} isReadyToRender = ${isReadyToRender()}`)

    try {
      render()
    } catch (e) {
      pushLog(e)
    }
  }, ['isReadyToRender'])

  // any close flag trigger
  useEffect(() => render(), ['isClosed', 'isPopupClosed', 'isAlertClosed', 'isDefaultChoiceAlertClosed'])

  function render () {
    const currLogHeader = logHeader + ' render() '

    pushLog(currLogHeader)

    if (!isReadyToRender()) {
      pushLog(`${currLogHeader} not ready to render`)
      removeMasEl()
      return
    }

    const oMasClasses = classNames('o-mas-vanilla', {
      'o-mas-vanilla--closed': isClosed(),
    })

    const oMasPopupClasses = classNames('o-mas-vanilla-popup', {
      'o-mas-vanilla-popup--closed': isPopupClosed(),
    })

    const oMasAlertClasses = classNames('o-mas-vanilla-alert', {
      'o-mas-vanilla-alert--closed': isAlertClosed(),
    })

    const oMasDefaultChoiceAlertClasses = classNames('o-mas-vanilla-default-choice-alert', {
      'o-mas-vanilla-default-choice-alert--closed': isDefaultChoiceAlertClosed(),
    })

    const appName = defaultChoice()
    const appNameUpperCase = !!appName ? appName.replace(/^\w/, c => c.toUpperCase()) : ''

    const newMasHtmlStr = `
      <div class="${oMasClasses}">
        <div class="c-mas-vanilla-overlay" onclick="masHandleCloseOverlayClick(event)" />
        <div class="${oMasPopupClasses}">
          <div class="c-mas-vanilla-header">
            <span class="c-mas-vanilla-header__text">
              Our Site Works Best In A Browser
            </span>
          </div>
          <div class="o-mas-vanilla-links">
            <div class="c-mas-app-link">
              <img
                alt="Chrome icon"
                class="c-mas-app-link__icon"
                src="/Contents/MobileApplicationSwitcher/icons/chrome.svg"
              />
              <span class="c-mas-app-link__title">Chrome</span>
              <a
                class="c-mas-app-link__button"
                onclick="masHandleChromeAppBtnClick(event)"
              >
                Open
              </a>
            </div>
          </div>
        </div>
        <div class="${oMasAlertClasses}">
          <span class="o-mas-vanilla-alert__text">Something went wrong. Please try another option.</span>
          <a
            class="o-mas-vanilla-alert__ok"
            onclick="masHandleAlertBtnClick(event)"
          >
            OK
          </a>
        </div>
        <div class="${oMasDefaultChoiceAlertClasses}">
          <span class="o-mas-vanilla-default-choice-alert__text">The page will be opened in ${appNameUpperCase}.</span>
          <a
            class="o-mas-vanilla-default-choice-alert__button"
            onclick="masHandleDefaultChoiceBtnClick(event)"
          >
            Open
          </a>
        </div>
      </div>
    `

    if (newMasHtmlStr === masHtmlStr()) return // no changes - no need to rerender

    const masEl = getMasEl()
    masEl.innerHTML = newMasHtmlStr

    setMasHtmlStr(newMasHtmlStr)
  }
}

onDocReady(initMobileApplicationSwitcher)