import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

interface queueSlot {
  customer: string;
  ticketNumber: number;
  password: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  subHeading: {
    margin: "20px auto 20px auto",
  },
}));

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
  },
};

const [getData, setGetData] = useState(true);

let queueList: Array<queueSlot> = [];
let isActive: boolean;

useEffect(() => {
  if (!getData) {
    return;
  }
  setGetData(false);
  axios
    .get("/tellerQueueList", axiosConfig)
    .then((res: any) => {
      queueList = res.data.queueList;
      isActive = res.data.isActive;
    })
    .catch((err: any) => {
      window.alert("Connection error");
      console.log(err);
    });
}, [axiosConfig, getData]);

export default function TellerPage() {
  const classes = useStyles();
  return (
    <>
      <Header />

      {isActive && (
        <Grid container alignItems="center" justify="space-around">
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              className={classes.subHeading}
              align="center"
            >
              Current Size
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              className={classes.subHeading}
              align="center"
            >
              Queue Duration*
            </Typography>
          </Grid>
        </Grid>
      )}

      {isActive && (
        <Grid container alignItems="center" justify="space-around">
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              className={classes.subHeading}
              align="center"
            >
              {queueList.length}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              className={classes.subHeading}
              align="center"
            >
              32mins
            </Typography>
          </Grid>
          )
        </Grid>
      )}
      <Footer />
    </>
  );
}
