import React from "react";
import Footer from "src/components/static/Footer";
import Header from "../components/static/Header";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/signupPage.css";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  return (
    <>
      <Header />
      <main>
        <div className="login-form first-element">
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              required
              id="standard-required"
              label="Username"
            />
            <TextField
              required
              id="standard-password-input"
              label="Password"
              type="password"
            />
            <TextField
            required
              id="standard-password-input"
              label="Confirm password"
              type="password"
            />
          </form>

          <div className="form-group bottom-space">
            <button type="button" className="btn btn-lg btn-block">
              Back
            </button>
          </div>
          <div className="text-center last-element">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
