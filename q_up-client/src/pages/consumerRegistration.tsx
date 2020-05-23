import React, { useState, ChangeEvent, FormEvent, useCallback } from "react";
import app from "../firebase";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";
import PhoneMaskedInput, { unMaskPhone } from "src/components/PhoneMaskedInput";

// Mui stylings
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
 * Render a consumer registration page.
 *
 * Accessible to: customers
 */
const ConsumerRegistrationPage = ({ history }: any) => {
  const classes = useStyles();

  // error type definition to be used in input feedback
  interface errors {
    phoneNumber?: string;
    postalCode?: string;
  }

  const errorObject: errors = {};

  // form data
  const [formState, setFormState] = useState({
    phoneNumber: "",
    postalCode: "",
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

  // handle skip button on click
  const handleSkipOnClick = useCallback(() => {
    const skip = window.confirm(
      "Are you sure? This information be used to provide you better functionality."
    );
    if (skip) {
      history.push("/consumerDashboard");
    }
  }, [history]);

  // handle form submit
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setFormState((prevState) => ({ ...prevState, loading: true }));
      const userData = {
        phoneNumber: unMaskPhone(formState.phoneNumber),
        postalCode: formState.postalCode.toUpperCase(),
      };

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
        },
      };

      axios
        .post("/registerCustomer", userData, axiosConfig)
        .then(() => {
          history.push("/consumerDashboard");
        })
        .catch((err: any) => {
          console.log(err);
          if (err.response.status && err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            app.auth().signOut().catch(console.error);
            return;
          }
          setFormState((prevState) => ({
            ...prevState,
            errors: err.response.data,
            loading: false,
          }));
        });
    },
    [history, formState]
  );

  if (JSON.parse(sessionStorage.user).type !== "customer") {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header />
      <main>
        <Grid container direction="column" justify="center" alignItems="center">
          <form
            className={classes.root}
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
                Your info
              </Typography>
              <TextField
                color="secondary"
                id="phone"
                label="Phone number"
                name="phoneNumber"
                onChange={handleOnFieldChange}
                value={formState.phoneNumber}
                className={classes.textField}
                helperText={formState.errors.phoneNumber}
                error={!!formState.errors.phoneNumber}
                InputProps={{inputComponent: PhoneMaskedInput as any} }
              />
              <TextField
                color="secondary"
                id="postalCode"
                label="Postal/Zip Code"
                name="postalCode"
                onChange={handleOnFieldChange}
                value={formState.postalCode}
                className={classes.textField}
                helperText={formState.errors.postalCode}
                error={!!formState.errors.postalCode}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Submit
              </Button>
            </Grid>
          </form>
          <Button variant="contained" onClick={handleSkipOnClick}>
            Skip
          </Button>
        </Grid>
      </main>
      <Footer />
    </>
  );
};

export default withRouter(ConsumerRegistrationPage);
