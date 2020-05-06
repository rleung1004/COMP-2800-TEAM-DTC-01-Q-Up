import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import LandingPage from './pages/landing';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import themes from './mui-theming/themes';
import { ThemeProvider } from '@material-ui/core';

function App() {
   const theme = themes();
   return (
      <Router>
         <div className='App'>
            <ThemeProvider theme={theme}>
            <Switch>
               <Route path='/' component={LandingPage} exact />
               <Route path='/login' component={LoginPage} exact />
               <Route path='/signup' component={SignupPage} exact />
            </Switch>
            </ThemeProvider>
         </div>
      </Router>
   );
}

export default App;
