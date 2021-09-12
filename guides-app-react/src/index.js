import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"

import TitleBar from './components/TitleBar'
import GuidesList from './components/GuidesList'
import GuideDetails from './components/GuideDetails';
import AddGuide from './components/AddGuide';

import './index.css';

function App() {
  const history = useHistory();
  return (
    <div>
      <TitleBar history={history} />
      <Switch>
        <Route exact path="/">
          <GuidesList history={history} />
        </Route>
        <Route path="/guideDetails" component={GuideDetails}>
          <GuideDetails />
        </Route>
        <Route path="/addGuide" component={AddGuide}>
          <AddGuide history={history} />
        </Route>
      </Switch>
    </div>
  );
}

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>,
  document.getElementById('root'));