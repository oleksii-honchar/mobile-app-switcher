import React from 'react'

import ErrorBoundary from '@containers/ErrorBoundary'

import MobileApplicationSwitcher from '@components/MobileApplicationSwitcher/MobileApplicationSwitcher'
// import MasVanilla from '@components/MasVanilla/MasVanilla'
// import MasVanillaOne from '@components/MasVanillaOne/MasVanillaOne'

import { SwitchBar } from './SwitchBar';
import { BodyLog } from './BodyLog';

import './Root.scss'

export function Root () {
    return [
      <div className="o-mas-debug">
        <ErrorBoundary><SwitchBar/></ErrorBoundary>
        <BodyLog/>
      </div>,
      <ErrorBoundary><MobileApplicationSwitcher/></ErrorBoundary>
      // <ErrorBoundary><MasVanilla/></ErrorBoundary>
      // <ErrorBoundary><MasVanillaOne/></ErrorBoundary>
    ]
}