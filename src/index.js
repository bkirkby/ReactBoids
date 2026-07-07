import React from "react";
import ReactDOM from "react-dom";
import dotenv from "dotenv";

import App from "./App";
import { initAnalytics } from "./analytics";

dotenv.config();
initAnalytics();

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
