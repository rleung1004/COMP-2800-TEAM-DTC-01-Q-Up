import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import { makeStyles } from "@material-ui/core/styles";
import ConsumerNav from "../components/consumerNav";
import { Button, Grid, Typography } from "@material-ui/core";
import CurrentQueueInfo from "../components/currentQueueInfo";
import QueueList from "../components/queueList";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  button: {
    margin: "20px auto 20px auto",
  },
}));

export default function ClientDashboardPage() {
  const classes = useStyles();
  const [currentQueueInfo, setCurrentQueueInfo] = useState({
    businessName: "",
    estimatedWait: 0,
    currentPosition: 0,
    ticketNumber: 0,
    password: "",
    inQueue: false,
  });
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  const noQueue = (
    <Grid container justify="center" alignItems="center">
      <Typography variant="h2">Not currently queued</Typography>
    </Grid>
  );

  const queueList: Array<object> = [];
  const listNames: Array<string> = [];
  const [favQueues, setFavQueues] = useState({
    data: queueList,
    names: listNames,
  });

  const toSearchQueuesHandler = () => {
    window.location.href = "/searchQueues";
  };

  const [getData, setGetData] = useState(true);
  const triggerGetStatus = () => {
    setGetData(true);
  };

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getCustomerQueueInfo", axiosConfig)
      .then((res) => {
        const data = res.data.queueSlotInfo;
        setCurrentQueueInfo({
          businessName: data.currentQueue,
          estimatedWait: data.currentWaitTime,
          currentPosition: data.queuePosition,
          ticketNumber: data.ticketNumber,
          password: data.password,
          inQueue: true,
        });
      })
      .catch((err) => {
        console.error(err);
        window.alert(err);
      });
  }, [axiosConfig, getData]);

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);

    axios
      .get("/getFavouriteQueues", axiosConfig)
      .then((res) => {
        let businesses = res.data.favoriteBusinesses;
        let data: Array<object> = [];
        let names: Array<string> = [];

        console.log(data);
        for (const business in businesses) {
          names.push(businesses[business].name);
          data.push(businesses[business]);
        }
        console.log(names);

        setFavQueues({ data, names });
      })
      .catch((err) => {
        console.error(err);
        window.alert("Connection error: Could not load your favourite queues.");
      });
  }, [axiosConfig, getData]);

  return (
    <>
      <Header Nav={ConsumerNav} logout />
      <main>
        <section>
          {currentQueueInfo.inQueue ? (
            <CurrentQueueInfo
              data={currentQueueInfo}
              triggerGetStatus={triggerGetStatus}
            />
          ) : (
            noQueue
          )}
        </section>
        <section>
          <Grid container direction="column">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={toSearchQueuesHandler}
            >
              Search Queues
            </Button>
          </Grid>
        </section>
        <section>
          <ExpansionPanel>
            <ExpansionPanelSummary
              aria-controls="panel1a-content"
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>Favorite queues</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <QueueList
                  dataList={favQueues.data}
                  favs={favQueues.names}
                  triggerGetStatus={triggerGetStatus}
                />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </section>
      </main>
      <Footer />
    </>
  );
}
