import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import LandingPage from './pages/landing';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import aboutUsPage from "./pages/aboutUs";

function App() {
   return (
      <Router>
         <div className='App'>
            <Switch>
               <Route path='/' component={LandingPage} exact />
               <Route path='/login' component={LoginPage} exact />
               <Route path='/signup' component={SignupPage} exact />
               <Route path='/aboutUs' component={aboutUsPage} exact/>
            </Switch>
         </div>
      </Router>
   );
}

export default App;
