import React from 'react'
import classNames from 'classnames'

import './MasPopup.scss'

export default function MasPopup({ isClosed, onClick }) {
  const oMasPopupClasses = classNames('o-mas-popup', {
    'o-mas-popup--closed': isClosed,
  })

  return (
    <div className={oMasPopupClasses}>
      <div className="c-mas-header">
          <span className="c-mas-header__text">
            Our Site Works Best In A Browser
          </span>
      </div>
      <div className="o-mas-links">
        <div className="c-mas-app-link">
          <img
            alt="Chrome icon"
            className="c-mas-app-link__icon"
            src="./assets/icons/chrome.svg"
          />
          <span className="c-mas-app-link__title">Chrome</span>
          <a
            className="c-mas-app-link__button"
            onClick={onClick}
          >
            Open
          </a>
        </div>
      </div>
    </div>
  )
}
