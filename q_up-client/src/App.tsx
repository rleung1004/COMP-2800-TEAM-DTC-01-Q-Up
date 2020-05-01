import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import LandingPage from './pages/landing';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' component={LandingPage} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
