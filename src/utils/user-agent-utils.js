import { getWidth } from './viewportSize'

export const getUserAgent = () => navigator?.userAgent || navigator?.vendor || window?.opera

export function isAndroid() {
  const userAgentRegExp = /Android/i
  return userAgentRegExp.test(getUserAgent())
}

export function isIos() {
  const userAgentRegExp = /iPhone|iPad|iPod/i
  return userAgentRegExp.test(getUserAgent())
}

export function isApple() {
  const userAgent = getUserAgent()
  return isIos() || userAgent.match(/Mac/i)
}

export function isWindows() {
  return navigator.userAgent.match(/IEMobile/i)
}

/**
 * @method isMobile
 * @description define user agent for server and browser
 * @param {string} userAgent - used for server-side. If empty - browser user-agent used
 */
export function isMobile(userAgent = null) {
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

export function getPlatformName(defaultName = 'unknown') {
  let platformName = defaultName

  if (isIos()) {
    platformName = 'ios'
  } else if (isAndroid()) {
    platformName = 'android'
  } else if (isWindows()) {
    platformName = 'windows'
  } else if (isApple()) {
    platformName = 'mac'
  }

  return platformName
}

export function isFacebookApp () {
  const userAgentRegExp = /FB(AN|AV|BV)/i
  return userAgentRegExp.test(getUserAgent())
}

const utils = {
  isIos,
  isMobile,
  isAndroid,
  isFacebookApp,
  getUserAgent,
  getPlatformName
}

export default utils
