import React, { useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import BusinessNav from "../components/businessNav";
// import axios from "axios";
// material-ui components
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { makeStyles, Paper, Button } from "@material-ui/core";
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
  const [getData, setGetData] = useState(true);
  const classes = useStyles();

  const [data, setData] = useState({
    queueSize: 0,
    duration: 0,
    activeEmployees: 0,
    queueStatus: false,
    businessName: "",
    withEmployees: false,
  });

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  const handleSwitchChange = () => {
    axios
      .put("/changeQueueStatus", {}, axiosConfig)
      .then(() => {
        setData((prevState: any) => ({
          ...prevState,
          queueStatus: !data.queueStatus,
        }));
        setGetData(true);
        window.alert("Successfully changed status.");
      })
      .catch((err: any) => {
        if (err.response.status === 404) {
          window.alert(
            "You are outside of normal operation hours. To start your queue change your operation hours."
          );
          return;
        }
        console.error(err);
        window.alert("Connection error.");
      });
  };

  const handleToAddEmployees = () => {
    window.location.href = "/employeeManagement";
  };

  const noEmployees = (
    <>
      <Grid container justify="center" spacing={6}>
        <Grid item xs={10}>
          <Typography variant="h3">You do not have any employees.</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToAddEmployees}
          >
            Add employees
          </Button>
        </Grid>
      </Grid>
      <br />
    </>
  );

  const withEmployees = (
    <>
      <Grid container justify="center">
        <Grid item container justify="center" xs={12} md={8} lg={6}>
          <Grid
            container
            item
            alignItems="center"
            justify="center"
            xs={12}
            sm={8}
            md={6}
          >
            <Grid item xs={6}>
              <Typography
                variant="body1"
                className={classes.subHeading}
                align="left"
              >
                Queue Status
              </Typography>
            </Grid>
            <Grid item xs={2}>
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
      </Grid>
      <Grid container justify="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper>
            <Grid container justify="center">
              <Grid
                container
                item
                alignItems="center"
                justify="center"
                xs={12}
                sm={8}
                md={6}
              >
                <Grid item xs={6}>
                  <Typography variant="body1" align="left">
                    Current Size
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography variant="body2">{data.queueSize}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" align="left">
                    Queue Duration
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography variant="body2">{data.duration}</Typography>
                </Grid>

                <Grid container alignItems="center" justify="center">
                  <Grid item xs={6}>
                    <Typography variant="body1" align="left">
                      Employees online
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
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
    </>
  );

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getQueue", axiosConfig)
      .then((res: any) => {
        console.log(res);
        const info = res.data;
        setData({
          queueStatus: info.queue.isActive,
          duration: info.queue.currentWaitTime,
          activeEmployees: info.onlineEmployees,
          businessName: info.businessName,
          queueSize: info.queue.queueLength,
          withEmployees: true,
        });
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 404) {
          setData((prevState: any) => ({
            ...prevState,
            businessName: err.response.data.businessName,
            withEmployees: false,
          }));
          return;
        }
        window.alert("Connection error.");
      });
  }, [axiosConfig, data, getData]);
  return (
    <>
      <Header Nav={BusinessNav} logout />
      <main>
      <header className={classes.pageTitleContainer}>
        <Grid container justify="center">
          <Grid item xs={10}>
            <Typography
              variant="h3"
              className={classes.pageTitle}
              align="center"
            >
              {data.businessName}
            </Typography>
          </Grid>
        </Grid>
      </header>
      <section>{data.withEmployees ? withEmployees : noEmployees}</section>
      </main>
      <Footer />
    </>
  );
}
