import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"

import TitleBar from './components/TitleBar'
import GuidesList from './components/GuidesList.js'
import GuideDetails from './components/GuideDetails';
import AddGuide from './components/AddGuide';

import './index.css';

function App() {
  const history = useHistory();
  return (
    <div>
      <TitleBar history={history} />
      <div style={{ marginTop: '17vh' }}>
        <Switch>
          <Route exact path="/">
          </Route>
          <Route path="/guideDetails" component={GuideDetails}>
            <GuideDetails />
          </Route>
          <Route path="/addGuide" component={AddGuide}>
            <AddGuide history={history} />
          </Route>
        </Switch>
        <GuidesList history={history} />
      </div>
    </div>
  );
}

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>,
  document.getElementById('root'));