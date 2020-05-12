// MobileApplicationSwitcher - vanilla version

import {
  classNames,
  onDocReady,
  pushLog,
  useState,
  useEffect,
  getMasEl,
  removeMasEl,
  Cookies
} from './mas-vanilla-utils'
import userAgentUtils from './utils/user-agent-utils'
import { generateApplicationDeepLink } from './utils/deep-link-utils'

import './mas-vanilla.scss'

function initMobileApplicationSwitcher() {
  const logHeader = '[MobileAppSwitcher(v)] '

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
    const fbAppCookie = !!getCookie('isFacebookApp')
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
    setCookie('MAS-defaultChoice', appName, COOKIE_TTL)
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
                src="./icons/chrome.svg"
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
            class="o-mas-vanilla-default-choice-alert__btn"
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