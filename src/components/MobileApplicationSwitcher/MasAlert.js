import React from 'react'
import classNames from 'classnames'

import './MasAlert.scss'

export default function MasAlert({ isClosed, onClick }) {
  const oMasAlertClasses = classNames('o-mas-alert', {
    'o-mas-alert--closed': isClosed,
  })

  return (
    <div className={oMasAlertClasses}>
      <span className="o-mas-alert__text">Something went wrong. Please try another option.</span>
      <a
        className="o-mas-alert__ok"
        onClick={onClick}
      >
        OK
      </a>
    </div>
  )
}
