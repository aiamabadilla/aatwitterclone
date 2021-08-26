import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AppRouter from "./AppRouter";

const App = () => {
  return (
    <div className="app">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
};

export default App;
