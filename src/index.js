import React from "react";
import ReactDOM from "react-dom";

import { Root } from "@containers";

import './index.scss'

async function startApp() {
  // logger.info("Starting app...");
  ReactDOM.render(<Root />, document.querySelector("#app-root"));
}

startApp();
