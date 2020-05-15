import React, { MouseEvent } from "react";
import QueueSlot from "../components/tellerQueueSlot";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import "../styles/teller.scss";

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
    fontSize: "20px",
  },
  title: {
    fontSize: "65px",
  },

  button: {
    margin: "20px auto 20px auto",
  },
}));

// const axiosConfig = {
//   headers: {
//     Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
//   },
// };

const axiosConfig = {};

// let queueList: Array<queueSlot> = [
//   {
//     customer: "Ryan",
//     ticketNumber: 141,
//     password: "hello",
//   },
//   {
//     customer: "Amir",
//     ticketNumber: 142,
//     password: "world",
//   },
//   {
//     customer: "Karel",
//     ticketNumber: 143,
//     password: "password",
//   },
//   {
//     customer: "Terry",
//     ticketNumber: 144,
//     password: "let me in",
//   },
// ];

export default function TellerPage() {
  const classes = useStyles();

  const [getData, setGetData] = useState(true);

  const queueSlots: Array<queueSlot> = [];

  const [queueList, setQueueList] = useState(queueSlots);

  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/tellerQueueList", axiosConfig)
      .then((res: any) => {
        setQueueList(res.data.queueList);
        setActive(true);
      })
      .catch((err: any) => {
        window.alert("Connection error");
        console.log(err);
      });
  }, [getData]);

  const [selected, setSelected] = useState({
    id: -1,
  });

  const selectHandler = (selectorID: number) => () => {
    setSelected({ id: selectorID });
  };

  const handleCheckIn = (event: MouseEvent) => {
    event.preventDefault();
    let index = 0;
    if (selected.id === -1) {
      window.alert("No one is selected");
      return;
    }
    index = selected.id;
    const checkInData = {
      customer: queueList[index].customer,
      ticketNumber: queueList[index].customer,
    };

    axios
      .post("/checkInQueue", checkInData, axiosConfig)
      .then(() => {
        console.log(
          `Removed ticket number ${checkInData.ticketNumber} successfully`
        );
        setGetData(true);
      })
      .catch((err) => {
        console.error(err);
        window.alert("Connection error");
      });
  };

  const handleVIP = (event: MouseEvent) => {
    event.preventDefault();
    axios
      .post("/VIPEnterQueue", {}, axiosConfig)
      .then((res) => {
        let VIPInfo = res.data.VIPSlotInfo;
        console.log(`Added ${VIPInfo.customer} into the queue`);
      })
      .catch((err) => {
        console.error(err);
        window.alert("Connection error");
      });
  };

  return (
    <>
      <Header />
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
          </Grid>
        )}

        {!isActive && (
          <Grid container alignItems="center" justify="space-around">
            <Grid item xs={12}>
              <Typography variant="h1" className={classes.title} align="center">
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
              onClick={handleVIP}
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
              onClick={handleCheckIn}
            >
              Check in
            </Button>
          </Grid>
        </Grid>
      </section>
      <Footer />
    </>
  );
}
