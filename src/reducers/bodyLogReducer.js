import React, { useReducer, createContext } from 'react'

import logger from '@logger'

const logHeader = '[bodyLogReducer]'

export const BodyLogContext = createContext(null)

function wrapDispatchWithLog(dispatch) {
  const headerCss = 'color: #302204; font-weight: bold; background: #ffc13d;'

  return (action = null) => {
    logger.info(`%c${logHeader} dispatch: `, headerCss, action)
    dispatch(action)
  }
}

function bodyLogReducer (state, action) {
  switch (action.type) {
    case 'push-log':
      return [...state, action.payload]
    default:
      throw new Error(`${action.type} is not defined`)
  }
}

export function BodyLogProvider ({ children }) {
  const [state, dispatch] = useReducer(bodyLogReducer, [])

  const wrappedDispatch = wrapDispatchWithLog(dispatch)

  const actionPushLog = (payload) => wrappedDispatch({ type: 'push-log', payload})

  const value = {
    state,
    actions: {
      pushLog: actionPushLog
    }
  }

  return <BodyLogContext.Provider value={value}>{children}</BodyLogContext.Provider>
}

