import Cookies from 'js-cookie'

import { isBrowser } from './general'

/**
 * @description check query param isLogEnabled for browser and set cookie for it.
 *  for server mode enabled log for non-prod env.
 * @param logContextName - additional context to check logging for.
 *  E.g. 'isCampaignContextLogsEnabled' can be disabled or enabled separately
 *  by adding same param to url
 * @returns {boolean}
 */
export function isLogEnabled(logContextName = null) {
  let isLogEnabled = true

  if (!isBrowser) {
    isLogEnabled = process.env.LOG_LEVEL === 'info'
    return isLogEnabled
  }

  const logStatusCookie = !!Cookies.get('isLogEnabled')
  if (!logStatusCookie && typeof window !== 'undefined') {
    isLogEnabled = !!window.location?.search.match(/isLogEnabled/i) ?? false
    if (!isLogEnabled) return false

    Cookies.set('isLogEnabled', 'true', 1)
  }

  if (!logContextName) return isLogEnabled

  // if general log enabled will check for certain context config
  if (isLogEnabled && logContextName && typeof window !== 'undefined') {
    isLogEnabled = !!Cookies.get(logContextName)
    if (!isLogEnabled) {
      const regExp = new RegExp(logContextName, 'i')
      isLogEnabled =
        !!window.location?.search.toLowerCase().match(regExp) ?? false
      if (!isLogEnabled) return false

      Cookies.set(logContextName, 'true', 1)
    }
  }

  return isLogEnabled
}

/**
 * @description to enable logs include param 'isLogEnabled'
 */
const globalLogger = {
  emit(method, ...logArguments) {
    return isLogEnabled() && console[method]?.(...logArguments)
  },
  log() {
    this.emit('log', ...arguments)
  },
  info() {
    this.emit('info', ...arguments)
  },
  warn() {
    this.emit('warn', ...arguments)
  },
  error() {
    this.emit('error', ...arguments)
  },
  table() {
    this.emit('table', ...arguments)
  },
  trace() {
    this.emit('trace', ...arguments)
  },
  group() {
    this.emit('group', ...arguments)
  },
  groupCollapsed() {
    this.emit('groupCollapsed', ...arguments)
  },
  groupEnd() {
    this.emit('groupEnd', ...arguments)
  },
}

globalLogger.log('[logger] log enabled!')

export default globalLogger
