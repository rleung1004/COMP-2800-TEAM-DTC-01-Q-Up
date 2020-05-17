import React, { ChangeEvent, useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import BusinessNav from "../components/businessNav";
// import axios from "axios";
// material-ui components
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { makeStyles, Paper } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  pageTitle: {
    margin: "20px auto 20px auto",
    fontSize: "1.7rem",
  },
  subHeading: {
    margin: "20px auto 20px auto",
  },
  switch: {},
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  mainSection: {
    color: "black",
    background: "white",
    padding: "20px",
  },
  pageTitleContainer: {
    borderBottom: "thin solid black",
  },
}));

export default function BusinessDashboardPage() {
  const classes = useStyles();

  const [data, setData] = useState({
    queueSize: "3",
    duration: "3",
    activeEmployees: "3",
    queueStatus: false,
    businessName: "3432",
  });

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prevState: any) => ({
      ...prevState,
      queueStatus: event.target.checked,
    }));
  };

  useEffect(() => {
    axios
      .get("ryan lets fix this!")
      .then((res: any) => {
        console.log(res);
        setData({
          queueStatus: true,
          duration: "",
          activeEmployees: "",
          businessName: "",
          queueSize: "",
        });
      })
      .catch((err: any) => {
        console.log(err);
        window.alert("Connection error.");
      });
  }, [axiosConfig, data]);
  return (
    <>
      <Header Nav={BusinessNav} logout />
      <header className={classes.pageTitleContainer}>
        <Typography variant="h2" className={classes.pageTitle}>
          {data.businessName}
        </Typography>
      </header>
      <Grid container justify="center">
        <Grid
          container
          item
          alignItems="center"
          justify="flex-start"
          xs={12}
          sm={8}
          md={6}
          lg={4}
        >
          <Grid item xs={7}>
            <Typography
              variant="body1"
              className={classes.subHeading}
              align="left"
            >
              Queue Status
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Switch
              checked={data.queueStatus}
              onChange={handleSwitchChange}
              name="queueSwitch"
              inputProps={{ "aria-label": "secondary checkbox" }}
              className={classes.switch}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper>
            <Grid container justify="center">
              <Grid
                container
                item
                alignItems="center"
                justify="flex-start"
                xs={12}
                sm={8}
                md={6}
                lg={4}
              >
                <Grid item xs={6}>
                  <Typography variant="body1" align="left">
                    Current Size
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">{data.queueSize}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" align="left">
                    Queue Duration
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">{data.duration}</Typography>
                </Grid>

                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body1" align="left">
                      Employees online
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {data.activeEmployees}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}
