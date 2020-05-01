import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './pages/landing';
import LandingPage from './pages/landing';
import LoginPage from './pages/login';

function App() {
   return (
      <Router>
         <div className='App'>
            <Switch>
               <Route path='/' component={LandingPage} exact />
               <Route path='/login' component={LoginPage} exact />
            </Switch>
         </div>
      </Router>
   );
}

export default App;
