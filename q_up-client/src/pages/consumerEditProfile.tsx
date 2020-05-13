import React, { useState, ChangeEvent, FormEvent } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
import axios from "axios";
import { makeStyles, Grid, Typography, TextField, Button } from "@material-ui/core";
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

export default function ConsumerEditProfilePage() {
  const classes = useStyles();
  interface errors {
    email?: string,
    phoneNumber?: string;
    postalCode?: string;
  }

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  const errorObject: errors = {};

  const [formState, setFormState] = useState({
    email: "",
    phoneNumber: "",
    postalCode: "",
    loading: false,
    errors: errorObject,
  });

  const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSkipOnClick = () => {
    const skip = window.confirm(
      "Are you sure?"
    );
    if (skip) {
      window.location.href = window.location.hostname + "/consumerProfile";
    }
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormState((prevState) => ({ ...prevState, loading: true }));
    const userData = {
      email: formState.email,
      phoneNumber: formState.phoneNumber,
      postalCode: formState.postalCode,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
    };

    axios
      .post("/updateCustomer", userData, axiosConfig)
      .then(() => {
        window.location.href = "/consumerDashboard";
      })
      .catch((err: any) => {
        setFormState((prevState) => ({
          ...prevState,
          errors: err.response.data,
          loading: false,
        }));
      });
  };

  axios.get("/customerInfo", axiosConfig)
    .then((data: any) => {
      setFormState({
        email: data.email,
        phoneNumber: data.phoneNumber,
        postalCode: data.postalCode,
        loading: false,
        errors: errorObject,
      });
    })
    .catch((err: any) => {
      window.alert("Connection error");
      console.log(err);
    });

  return (
    <>
      <Header Nav={ConsumerNav} />
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
                id="phone"
                label="Phone number"
                name="phoneNumber"
                onChange={handleOnFieldChange}
                value={formState.phoneNumber}
                className={classes.textField}
                helperText={formState.errors.phoneNumber}
                error={formState.errors.phoneNumber ? true : false}
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
                error={formState.errors.postalCode ? true : false}
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
            Cancel
          </Button>
        </Grid>
      </main>
      <Footer />
    </>
  );
}
