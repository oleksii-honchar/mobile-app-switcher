import React from 'react'
import classNames from 'classnames'

import './MasDefaultChoiceAlert.scss'

export default function MasDefaultChoiceAlert({ appName, isClosed, onClick }) {
  const oMasDefaultChoiceAlertClasses = classNames('o-mas-default-choice-alert', {
    'o-mas-default-choice-alert--closed': isClosed,
  })

  const appNameUpperCase = appName.replace(/^\w/, c => c.toUpperCase())

  return (
    <div className={oMasDefaultChoiceAlertClasses}>
      <span className="o-mas-default-choice-alert__text">The page will be opened in {appNameUpperCase}.</span>
      <a
        className="o-mas-default-choice-alert__btn"
        onClick={onClick}
      >
        Open
      </a>
    </div>
  )
}
