import React, { useEffect, useContext, useState } from 'react'

import './BodyLog.scss'
import { BodyLogContext} from '@reducers/bodyLogReducer';

export function BodyLog () {
  const { state } = useContext(BodyLogContext)
  const [ items, setItems ] = useState([])

  useEffect(() => {
    const newItems = state.map((item, idx) => {
      return <span key={idx} className='o-log-item'>{item}</span>
    })
    setItems(newItems)
  }, [state])

  return (
    <div className="o-mas-body-log">
      {items}
    </div>
  )
}