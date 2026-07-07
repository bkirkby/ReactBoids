import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { initAnalytics } from "./analytics";

initAnalytics();

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
