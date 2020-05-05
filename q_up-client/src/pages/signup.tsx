import React, {useState} from "react";
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

export default function signupPage() {
  const classes = useStyles();
  const [formState, setFormState] = useState({password: '', username: '', confirmPass:''}); 
  const handleOnFieldChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState(prevState=>({...prevState, [name]: value}));
  };
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
              name="username"
              onChange={handleOnFieldChange}
              value={formState.username}
            />
            <TextField
              required
              id="standard-password-input"
              label="Password"
              name="password"
              type="password"
              onChange={handleOnFieldChange}
              value={formState.password}
            />
            <TextField
            required
              id="standard-password-input"
              label="Confirm password"
              name="confirmPass"
              type="password"
              onChange={handleOnFieldChange}
              value={formState.confirmPass}
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
