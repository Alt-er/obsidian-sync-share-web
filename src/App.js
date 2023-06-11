import "./global.css";

import { BrowserRouter as Router } from "react-router-dom";

import RouterApp from "./router/RouterApp";
import React from "react";

const basename = "/";

function App() {
    return (
        <React.StrictMode>
            <Router basename={basename}>
                <RouterApp />
            </Router>
        </React.StrictMode>
    );
}

export default App;
