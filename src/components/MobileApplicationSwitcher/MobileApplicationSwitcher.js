import React, { useState, useEffect, useContext } from 'react'
import classNames from 'classnames'
import Cookies from 'js-cookie'

import { generateApplicationDeepLink } from '@utils/deep-link-utils'
import userAgentUtils from '@utils/user-agent-utils'

import { BodyLogContext } from '@reducers/bodyLogReducer'

import MasPopup from './MasPopup'
import MasAlert from './MasAlert'
import MasDefaultChoiceAlert from './MasDefaultChoiceAlert'

import './MobileApplicationSwitcher.scss'

const logHeader = '[MobileAppSwitcher] '
const TIMEOUT_TO_SHOW = 1000
const COOKIE_TTL = 1*864e+5 // 1d
// const COOKIE_TTL = 2*60000 // 2min
const MAS_DEFAULT_CHOICE_COOKIE = 'MAS-defaultChoice'

export default function MobileApplicationSwitcher() {
  const [isReadyToRender, setIsReadyToRender] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [isPopupClosed, setIsPopupClosed] = useState(false)
  const [isAlertClosed, setIsAlertClosed] = useState(true)
  const [isDefaultChoiceAlertClosed, setIsDefaultChoiceAlertClosed] = useState(true)
  const [deepLinkChrome, setDeepLinkChrome] = useState('')
  const [deepLinkDefaultChoice, setDeepLinkDefaultChoice] = useState('')
  const [defaultChoice, setDefaultChoice] = useState('')

  const { pushLog } = useContext(BodyLogContext).actions

  function checkForCookieReset () {
    const currLogHeader = logHeader + ' checkForCookieReset()'
    const toReset = !!window.location?.search.match(/toResetMasCookie/i) ?? false
    if (toReset) {
      pushLog(`${currLogHeader} gonna reset "${MAS_DEFAULT_CHOICE_COOKIE}" cookie`)
      Cookies.remove(MAS_DEFAULT_CHOICE_COOKIE)
    }
  }

  function getCookieExpireDate() {
    return new Date(new Date().getTime() + COOKIE_TTL)
  }

  function isNeedToShow() {
    const currLogHeader = logHeader + ' isNeedToShow()'

    let toShow = userAgentUtils.isMobile() && userAgentUtils.isFacebookApp()

    if (toShow) return toShow

    // force to show by query params isFacebookApp
    const fbAppCookie = !!Cookies.get('isFacebookApp')
    pushLog(`${currLogHeader} fbAppCookie = ${fbAppCookie}`)
    if (!fbAppCookie && typeof window !== 'undefined') {
      toShow = !!window.location?.search.match(/isFacebookApp/i) ?? false
      if (!toShow) return false

      Cookies.set('toShow', 'true', { expires: getCookieExpireDate() })
    }

    return toShow
  }

  function rememberUserChoice(appName) {
    const currLogHeader = logHeader + ' rememberUserChoice()'
    pushLog(`${currLogHeader} gonna set "${appName}" as default choice`)
    Cookies.set('MAS-defaultChoice', appName, { expires: getCookieExpireDate() })
  }

  function handleCloseOverlayClick () {
    setIsClosed(true)
    rememberUserChoice('facebook')
  }

  function handleDefaultChoice (platformName, defaultChoice, href) {
    const currLogHeader = logHeader + ' handleDefaultChoice() '
    pushLog(`${currLogHeader} - ${defaultChoice}`)

    const link = generateApplicationDeepLink(platformName, defaultChoice, href, { omitExecutionCode: true })

    setIsPopupClosed(true)
    setIsDefaultChoiceAlertClosed(false)
    setDeepLinkDefaultChoice(link)
    setDefaultChoice(defaultChoice)
  }

  function handleError () {
    rememberUserChoice('facebook')

    // close popup and show alert
    setIsPopupClosed(true)
    setIsAlertClosed(false)
    setIsDefaultChoiceAlertClosed(true)
  }

  function openAppDeepLink (appDeepLink) {
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
      if (!wnd && userAgentUtils.isAndroid()) { // iOS doesn't provide wnd after window.open ¯\_(ツ)_/¯
        pushLog(`${currLogHeader} finally: error opening link`)
        handleError()
      } else {
        setIsClosed(true) // all good - just close MAS
      }
    }
  }

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

  if (!isReadyToRender) return null

  const oMasClasses = classNames('o-mas', {
    'o-mas--closed': isClosed,
  })

  return (
    <div className={oMasClasses}>
      <div className="c-mas-overlay" onClick={handleCloseOverlayClick} />
      <MasPopup isClosed={isPopupClosed} onClick={() => {
        rememberUserChoice('chrome')
        openAppDeepLink(deepLinkChrome)
      }}/>
      <MasAlert isClosed={isAlertClosed} onClick={() => {
        rememberUserChoice('facebook')
        handleCloseOverlayClick()
      }}/>
      <MasDefaultChoiceAlert appName={defaultChoice} isClosed={isDefaultChoiceAlertClosed} onClick={() => {
        openAppDeepLink(deepLinkDefaultChoice)
      }}/>
    </div>
  )
}
