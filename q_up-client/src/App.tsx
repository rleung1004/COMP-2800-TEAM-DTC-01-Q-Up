import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/landing';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import aboutUsPage from './pages/aboutUs';
import themes from './mui-theming/themes';
import termsPage from './pages/termsAndConditions';
import privacyPage from './pages/privaryPolicy';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from './store';

function App() {
   const theme = themes();
   return (
      <Provider store={store}>
         <Router>
            <div className='App'>
               <ThemeProvider theme={theme}>
                  <Switch>
                     <Route path='/' component={LandingPage} exact />
                     <Route path='/login' component={LoginPage} exact />
                     <Route path='/signup' component={SignupPage} exact />
                     <Route path='/aboutUs' component={aboutUsPage} exact />
                     <Route
                        path='/termsAndConditions'
                        component={termsPage}
                        exact
                     />
                     <Route
                        path='/PrivacyPolicy'
                        component={privacyPage}
                        exact
                     />
                  </Switch>
               </ThemeProvider>
            </div>
         </Router>
      </Provider>
   );
}

export default App;
