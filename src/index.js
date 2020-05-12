import React from 'react';
import ReactDOM from 'react-dom';

import logger from '@logger';

import { BodyLogProvider } from './reducers/bodyLogReducer';
import { Root } from '@containers';

import './index.scss'

async function startApp() {
  logger.info('Starting app...');
  ReactDOM.render(
    <BodyLogProvider>
      <Root />
    </BodyLogProvider>,
    document.querySelector('#app-root'));
}

startApp();
