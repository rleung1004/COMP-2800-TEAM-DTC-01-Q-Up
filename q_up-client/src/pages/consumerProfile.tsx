import React, { useState } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
import { Grid, Button, Typography, makeStyles } from "@material-ui/core";
import Axios from "axios";
import {formatNumber} from '../utils/formatting';

const useStyles = makeStyles(() => ({
  button: {
    margin: "20px auto 20px auto",
  },
}));

export default function ConsumerProfilePage() {
  const classes = useStyles();
  const [email, setEmail] = useState("some@email.ca");
  const [phoneNumber, setPhoneNumber] = usestate("(778)898-9898");
  const [postalCode, setPostalCode] = usestate("");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  Axios.get("/customerInfo", axiosConfig)
  .then((data:any) => {
    setEmail(data.email);
    setPhoneNumber(formatNumber(data.phoneNumber));
    setPostalCode(data.postalCode);
  })
  .catch(err => {
    window.alert("Connection error");
    console.log(err);
  });
  return (
    <>
      <Header Nav={ConsumerNav} />
      <main>
        <section>
          <Grid container justify="space-around">
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Edit profile
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Delete account
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Change password
              </Button>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container>
            <Grid item sm={12} md={6}>
              <Typography variant="body1">Email</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body2">{email}</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body1">Phone number</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body2">{phoneNumber}</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body1">Postal code</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body2">{postalCode}</Typography>
            </Grid>
          </Grid>
        </section>
      </main>
      <Footer />
    </>
  );
}
