import React, { MouseEvent } from "react";
import QueueSlot from "../components/tellerQueueSlot";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import "../styles/teller.scss";

interface queueSlot {
  customer: string;
  ticketNumber: number;
  password: string;
}

// Mui styling
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  subHeading: {
    fontSize: "20px",
  },
  title: {
    fontSize: "65px",
  },

  button: {
    margin: "20px auto 20px auto",
  },
}));

/**
 * Render a teller page.
 * 
 * Accessible to: employees
 */
export default function TellerPage() {
  const classes = useStyles();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  // fetch flag
  const [getData, setGetData] = useState(true);

  const queueSlots: Array<queueSlot> = [];

  // queue customers data
  const [queueList, setQueueList] = useState(queueSlots);

  // queue state
  const [isActive, setActive] = useState(false);
  const [currentWaitTime, setWaitTime] = useState(null);
  const [queueLength, setQueueLength] = useState(null);

  // fetch queue data
  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getQueue", axiosConfig)
      .then((res: any) => {
        let queue = res.data.queue;
        setQueueList(queue.queueList);
        setActive(queue.isActive);
        setWaitTime(queue.currentWaitTime);
        setQueueLength(queue.queueLength);
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          window.location.href = '/login';
          return;
        }
        window.alert("Connection error");
      });
  }, [axiosConfig, getData]);

  // Track the currently selected customer
  const [selected, setSelected] = useState({
    id: -1,
  });

  /**
   * Get a function that sets the current selected customer.
   * 
   * Gets a curried function that is passed to each customer row.
   * @param selectorID the queue row id
   */
  const selectHandler = (selectorID: number) => () => {
    setSelected({ id: selectorID });
  };

  // Handle the check in button click
  const handleCheckInClick = (event: MouseEvent) => {
    event.preventDefault();
    let index: number;
    if (selected.id === -1) {
      window.alert("No one is selected");
      return;
    }
    index = selected.id;
    const checkInData = {
      ticketNumber: queueList[index].ticketNumber,
    };

    axios
      .put("/checkInQueue", checkInData, axiosConfig)
      .then(() => {
        console.log(
          `Removed ticket number ${checkInData.ticketNumber} successfully`
        );
        setGetData(true);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          window.location.href = '/login';
          return;
        }
        window.alert("Connection error");
      });
  };

  // Handle the VIP button click
  const handleVIPClick = (event: MouseEvent) => {
    event.preventDefault();
    axios
      .put("/VIPEnterQueue", {}, axiosConfig)
      .then((res) => {
        let VIPInfo = res.data.VIPSlotInfo;
        console.log(`Added ${VIPInfo.customer} into the queue`);
        setGetData(true);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          window.location.href = '/login';
          return;
        }
        window.alert("Connection error");
      });
  };

  return (
    <>
      <Header logout />
      <main>
        <section className="top-container">
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
                  {queueLength}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  className={classes.subHeading}
                  align="center"
                >
                  {currentWaitTime}
                </Typography>
              </Grid>
            </Grid>
          )}

          {!isActive && (
            <Grid container alignItems="center" justify="space-around">
              <Grid item xs={12}>
                <Typography
                  variant="h1"
                  className={classes.title}
                  align="center"
                >
                  Queue is Not Active
                </Typography>
              </Grid>
            </Grid>
          )}
        </section>
        <section className="center-container">
          {queueList.map((queueSlot, key) => {
            return (
              <QueueSlot
                key={key}
                data={queueSlot}
                isSelected={key === selected.id}
                selectHandler={selectHandler(key)}
              />
            );
          })}
        </section>
        <section className="bottom-container">
          <Grid container alignItems="center" justify="space-around">
            <Grid item xs={6}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleVIPClick}
              >
                VIP
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleCheckInClick}
              >
                Check in
              </Button>
            </Grid>
          </Grid>
        </section>
      </main>
      <Footer />
    </>
  );
}
