import React from "react";
import "./App.scss";
import axios from "axios";
import { AuthProvider } from "./Auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute"
import LandingPage from "./pages/landing";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import aboutUsPage from "./pages/aboutUs";
import themes from "./mui-theming/themes";
import TermsPage from "./pages/termsAndConditions";
import PrivacyPage from "./pages/privacyPolicy";
import { ThemeProvider } from "@material-ui/core";
import ConsumerRegistrationPage from "./pages/consumerRegistration";
import BusinessRegistrationPage from "./pages/businessRegistration";
import BusinessDashboardPage from "./pages/businessDashboard";
import ConsumerDashboard from "./pages/consumerDashboard";
import ConsumerProfilePage from "./pages/consumerProfile";
import ConsumerEditProfilePage from "./pages/consumerEditProfile";
import BusinessProfilePage from "./pages/businessProfile";
import BusinessEditProfilePage from "./pages/businessEditProfile";
import EmployeeManagementPage from "./pages/employeeManagement";
import QueueSearchPage from "./pages/queueSearch";
import TellerPage from "./pages/teller";
import Booth from "./pages/booth";
import ContactUsPage from "./pages/contactUs";
axios.defaults.baseURL =
  "https://us-central1-q-up-c2b70.cloudfunctions.net/api";

function App() {
  const theme = themes();
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ThemeProvider theme={theme}>
            <Switch>
              <Route path="/" component={LandingPage} exact />
              <Route path="/login" component={LoginPage} exact />
              <Route path="/signup" component={SignupPage} exact />
              <Route path="/aboutUs" component={aboutUsPage} exact />
              <Route path="/contactUs" component={ContactUsPage} exact />
              <PrivateRoute path="/consumerRegistration" component={ConsumerRegistrationPage} exact />
              <PrivateRoute path="/businessRegistration" component={BusinessRegistrationPage} exact />
              <PrivateRoute path="/termsAndConditions" component={TermsPage} exact />
              <PrivateRoute path="/privacyPolicy" component={PrivacyPage} exact />
              <PrivateRoute path="/businessDashboard" component={BusinessDashboardPage} exact />
              <PrivateRoute path="/consumerDashboard" component={ConsumerDashboard} exact />
              <PrivateRoute path="/consumerProfile" component={ConsumerProfilePage} exact />
              <PrivateRoute path="/editConsumerProfile" component={ConsumerEditProfilePage} exact />
              <PrivateRoute path="/businessProfile" component={BusinessProfilePage} exact />
              <PrivateRoute path="/editBusinessProfile" component={BusinessEditProfilePage} exact />
              <PrivateRoute path="/searchQueues" component={QueueSearchPage} exact />
              <PrivateRoute path="/employeeManagement" component={EmployeeManagementPage} exact />
              <PrivateRoute path="/teller" component={TellerPage} exact />
              <PrivateRoute path="/boothDashBoard" component={Booth} exact />
            </Switch>
          </ThemeProvider>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
