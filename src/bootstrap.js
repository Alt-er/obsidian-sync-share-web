import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// react17 方式
// ReactDOM.render(<App />, document.getElementById("root"));

// react18 方式
const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<App />);
