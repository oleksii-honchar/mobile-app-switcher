/**
 * @description check query param isLogEnabled for browser and set cookie for it.
 *  for server mode enabled log for non-prod env.
 * @param logContextName - additional context to check logging for.
 *  E.g. 'isCampaignContextLogsEnabled' can be disabled or enabled separately
 *  by adding same param to url
 * @returns {boolean}
 */
export function isLogEnabled(logContextName = null) {
  return true
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
