import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Visualizer from "./Visualizer/Visualizer";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/pathfinding-visualizer" component={Visualizer} />
          {/* <Route path="/react-rat" component={ReactRat} /> */}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
