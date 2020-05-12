import React, { useEffect, useContext, useState } from 'react'

import { generateApplicationDeepLink, getUserAgent } from '@utils';
import userAgentUtils from '@utils/user-agent-utils';

import { BodyLogContext } from '@reducers/bodyLogReducer';

import './SwitchBar.scss'

export function SwitchBar () {
  const logHead = '[SwitchBar]'
  const { pushLog } = useContext(BodyLogContext).actions

  const [isFacebookApp] = useState(userAgentUtils.isFacebookApp())
  const [isMobile] = useState(userAgentUtils.isMobile())
  const [isIos] = useState(userAgentUtils.isIos())
  const [isAndroid] = useState(userAgentUtils.isAndroid())

  const [chromeIosDeepLink, setChromeIosDeepLink] = useState(null)
  const [chromeAndroidDeepLink, setChromeAndroidDeepLink] = useState(null)

  let launcher = null

  useEffect(()=>{
    const href = window.location.href

    pushLog(`${logHead} href = ${href}`)
    pushLog(`${logHead} user-agent = ${getUserAgent()}`)
    pushLog(`${logHead} isMobile = ${isMobile}`)
    pushLog(`${logHead} isIos = ${isIos}`)
    pushLog(`${logHead} isAndroid = ${isAndroid}`)
    pushLog(`${logHead} isFacebookApp = ${isFacebookApp}`)

    const chromeIosDeepLink = generateApplicationDeepLink('ios','chrome', href)
    const chromeAndroidDeepLink = generateApplicationDeepLink('android','chrome', href)

    pushLog(`${logHead} chromeIosDeepLink = ${chromeIosDeepLink}`)
    pushLog(`${logHead} chromeAndroidDeepLink = ${chromeAndroidDeepLink}`)

    setChromeIosDeepLink(chromeIosDeepLink)
    setChromeAndroidDeepLink(chromeAndroidDeepLink)
  },[])

  return (
    <div className="o-mas-switch-bar">
      <span>iOS: </span>&nbsp;
      <a className='o-mas-btn' href={chromeIosDeepLink}>Chrome</a>&nbsp;
      <span>Android: </span>&nbsp;
      <a className='o-mas-btn' href={chromeAndroidDeepLink}>Chrome</a>
    </div>
  )
}