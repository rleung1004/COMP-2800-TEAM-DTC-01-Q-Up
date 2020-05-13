import React from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
import { Grid, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "20px auto 20px auto",
  },
}));

export default function ConsumerProfilePage() {
  const classes = useStyles();
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

        </section>
      </main>
      <Footer />
    </>
  );
}
