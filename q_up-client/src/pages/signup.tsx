import React, { useState, ChangeEvent, FormEvent, useCallback } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { withRouter, Redirect } from "react-router-dom";
import "../styles/signupPage.scss";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
import FirebaseSignup from "../components/socialMediaSignup";

// Mui styling
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  pageTitle: {
    margin: "20px auto 20px auto",
  },
  textField: {
    margin: "20px auto 20px auto",
  },
  button: {
    margin: "20px auto 20px auto",
  },
}));

/**
 * Render a signup page.
 *
 * Accessible to: All users
 */
const SignupPage = ({ history }: any) => {
  const classes = useStyles();
  // error type definition to be used in input feedback
  interface errors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    userType?: string;
    businessName?: string;
  }
  let errorObject: errors = {};

  // form data
  const [formState, setFormState] = useState({
    password: "",
    email: "",
    confirmPassword: "",
    userType: "customer",
    businessName: "",
    loading: false,
    errors: errorObject,
  });

  /**
   * sync input data with form data
   *
   * Each input is assigned a name analog to the form data it represents.
   * On change the proper property in form data is access by using the name of the event emitter.
   * @param event an event with target
   */
  const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // handle the form submit
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    setFormState((prevState) => ({ ...prevState, loading: true }));

    const userData = {
      email: formState.email,
      password: formState.password,
      confirmPassword: formState.confirmPassword,
      userType: formState.userType,
      businessName: formState.businessName,
    };

    axios
      .post("/signup", userData)
      .then((res) => {
        if (formState.userType === "customer") {
          setFormState((prevState) => ({ ...prevState, loading: false }));
          sessionStorage.setItem(
            "user",
            JSON.stringify({ token: res.data.token, type: "customer" })
          );
          history.push("/consumerRegistration");
        } else {
          sessionStorage.setItem(
            "user",
            JSON.stringify({ token: res.data.token, type: "manager" })
          );
          history.push("/businessRegistration");
        }
      })
      .catch((err) => {
        setFormState((prevState) => ({
          ...prevState,
          errors: err.response.data,
          loading: false,
        }));
      });
  }, [history, formState]);

  const redirectToLogin = () => {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <main>
        <Grid container direction="column" justify="center" alignItems="center">
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              className="form"
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Typography variant="h2" className={classes.pageTitle}>
                Sign Up
              </Typography>
              <TextField
                color="secondary"
                required
                id="email"
                label="Email"
                name="email"
                onChange={handleOnFieldChange}
                value={formState.email}
                className={classes.textField}
                helperText={formState.errors.email}
                error={formState.errors.email ? true : false}
              />
              <TextField
                color="secondary"
                required
                id="password"
                label="Password"
                name="password"
                type="password"
                onChange={handleOnFieldChange}
                value={formState.password}
                helperText={formState.errors.password}
                error={formState.errors.password ? true : false}
              />
              <TextField
                color="secondary"
                required
                id="confirmPassword"
                label="Confirm password"
                name="confirmPassword"
                type="password"
                onChange={handleOnFieldChange}
                value={formState.confirmPassword}
                helperText={formState.errors.confirmPassword}
                error={formState.errors.confirmPassword ? true : false}
              />
              {formState.userType === "manager" && (
                <TextField
                  color="secondary"
                  required
                  id="businessName"
                  label="Business Name"
                  name="businessName"
                  type="text"
                  onChange={handleOnFieldChange}
                  value={formState.businessName}
                  helperText={formState.errors.businessName}
                  error={formState.errors.businessName ? true : false}
                />
              )}
              <FormControl component="fieldset">
                <FormLabel component="legend"></FormLabel>
                <RadioGroup
                  name="userType"
                  value={formState.userType}
                  onChange={handleOnFieldChange}
                >
                  <FormControlLabel
                    value="customer"
                    control={<Radio />}
                    label="I want to queue as a customer"
                  />
                  <FormControlLabel
                    value="manager"
                    control={<Radio />}
                    label="I want to register my business"
                  />
                </RadioGroup>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Sign Up
              </Button>
            </Grid>
          </form>
          {formState.userType === "customer" && (
            <Typography variant="body1">Or</Typography>
          )}
          {formState.userType === "customer" && (
            <FirebaseSignup />
          )}
          
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.goBack()}
          >
            Back
          </Button>

          <div className="text-center last-element">
            Already have an account? <div onClick={redirectToLogin}>Log in</div>
          </div>
        </Grid>
      </main>
      <Footer />
    </>
  );
}

export default withRouter(SignupPage);
