import React, { useCallback } from "react";
import app from "../firebase";
import axios from "axios";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { makeStyles } from "@material-ui/core/styles";
import ConsumerNav from "../components/consumerNav";
import { Button, Grid, Typography } from "@material-ui/core";
import CurrentQueueInfo from "../components/currentQueueInfo";
import QueueList from "../components/queueList";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withRouter, Redirect } from "react-router-dom";

// Mui stylings
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
  expansionDetails: {
    paddingLeft: "0px",
    paddingRight: "0px",
  },
}));

/**
 * Render a customer dashboard page.
 *
 * Accessible to: customers
 */
const ClientDashboardPage = ({ history }: any) => {
  const classes = useStyles();

  // queue data
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

  // element to render if customer is not queued
  const noQueue = (
    <Grid container justify="center" alignItems="center">
      <Typography variant="h2">Not currently queued</Typography>
    </Grid>
  );

  const queueList: Array<object> = [];
  // favorite queue data
  const [favQueues, setFavQueues] = useState(queueList);

  // handle search queues button click
  const toSearchQueuesHandler = useCallback(() => {
    history.push("/searchQueues");
  }, [history]);

  // fetch flag
  const [getData, setGetData] = useState(true);

  // fetch flag setter to pass to children
  const triggerGetStatus = () => {
    setGetData(true);
  };

  // fetch current queue data
  useEffect(() => {
    return () => {
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
          console.error(err.response);
          if (err.response.status === 404) {
            setCurrentQueueInfo((prevState: any) => ({
              ...prevState,
              inQueue: false,
            }));
            return;
          }
          if (err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            app.auth().signOut();
            return;
          }
          window.alert(err.response.data.general);
        });
    };
  }, [axiosConfig, getData]);

  // fetch favorite queues
  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getFavouriteQueues", axiosConfig)
      .then((res) => {
        const businesses = res.data.favoriteBusinesses;
        const data: Array<object> = [];
        for (const business in businesses) {
          data.push({ ...businesses[business], triggerGetStatus, isFav: true });
        }
        setFavQueues(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          return;
        }
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        }
        window.alert("Connection error: Could not load your favourite queues.");
      });
  }, [axiosConfig, getData]);

  if (JSON.parse(sessionStorage.user).type !== "customer") {
    return <Redirect to="/login" />;
  }

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
          <Grid container justify="center">
            <Grid item container xs={12} md={10} justify="center">
              <Grid
                container
                item
                alignItems="center"
                justify="center"
                xs={12}
                md={10}
              >
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    aria-controls="panel1a-content"
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>Favorite queues</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.expansionDetails}>
                    <div>
                      <QueueList dataList={favQueues} />
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            </Grid>
          </Grid>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default withRouter(ClientDashboardPage);
