import React, { useState, ChangeEvent, FormEvent } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
// material-ui components
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
export default function SignupPage() {
  const history = useHistory();
  const classes = useStyles();
  interface errors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    userType?: string;
    businessName?: string;
  }
  let errorObject: errors = {};
  const [formState, setFormState] = useState({
    password: "",
    email: "",
    confirmPassword: "",
    userType: "customer",
    businessName: "",
    loading: false,
    errors: errorObject,
  });
  const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = (event: FormEvent) => {
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
          window.location.href = "/consumerRegistration";
        } else {
          sessionStorage.setItem(
            "user",
            JSON.stringify({ token: res.data.token, type: "manager" })
          );
          window.location.href = "/businessRegistration";
        }
      })
      .catch((err) => {
        setFormState((prevState) => ({
          ...prevState,
          errors: err.response.data,
          loading: false,
        }));
      });
  };
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
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </Grid>
      </main>
      <Footer />
    </>
  );
}
