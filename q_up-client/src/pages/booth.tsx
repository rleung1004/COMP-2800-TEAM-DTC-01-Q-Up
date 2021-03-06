import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import BoothEnterName from "../components/boothEnterName";
import BoothTicketInfo from "../components/boothTicketInfo";
import { Grid, Typography } from "@material-ui/core";
import "../styles/booth.scss";
import BoothDisabledInfo from "src/components/boothDisabledInfo";
import BoothLoadingInfo from "src/components/boothLoading";
import app from "../firebase";

enum boothStates {
  loading,
  closed,
  accepting,
  serving,
}

/**
 * Renders a booth page.
 */
export default function Booth() {
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  const [boothInfo, setBoothInfo] = useState({
    state: boothStates.loading,
    name: "",
    ticketNumber: "",
    password: "",
  });

  // fetch flag
  const [getData, setGetData] = useState(true);

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getQueue", axiosConfig)
      .then((res: any) => {
        const data = res.data.queue;
        setBoothInfo((prevState: any) => ({
          ...prevState,
          state: data.isActive ? boothStates.accepting : boothStates.closed,
        }));
      })
      .catch((err: any) => {
        console.error(err);
        if (err.response.status && err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut().catch(console.error);
          return;
        }
      });
  }, [getData, axiosConfig]);

  // handle done button click, to be passed to child BoothTicketInfo
  const onDone = () => {
    setBoothInfo((prevState) => ({
      ...prevState,
      state: boothStates.loading,
      name: "",
      ticketNumber: "",
      password: "",
    }));
    setGetData(true);
  };

  const InfoSection = () => {
    if (boothInfo.state === boothStates.closed) {
      return <BoothDisabledInfo />;
    } else if (boothInfo.state === boothStates.accepting) {
      return <BoothEnterName setBoothInfo={setBoothInfo} />;
    } else if (boothInfo.state === boothStates.serving) {
      return <BoothTicketInfo onDone={onDone} data={boothInfo} />;
    } else if (boothInfo.state === boothStates.loading) {
      return <BoothLoadingInfo />;
    }
    return <></>;
  };

  return (
    <>
      <Header />
      <main>
        <section className="boothInfoSectionContainer">
          <InfoSection />
        </section>
        <Grid container justify="center">
          <Grid
            container
            item
            className="textContainer"
            xs={12}
            justify="center"
            alignItems="center"
          >
            <Typography className="boothFeatureHeadings" variant="h2">
              How it works
            </Typography>
            <Grid item xs={8}>
              <ol className="orderedList">
                <li>
                  <Typography variant="body2" align="left">
                    1 - Enter your name
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" align="left">
                    2 - Press queue up
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" align="left">
                    3 - Get your ticket number and your code city
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" align="left">
                    4 - Look for your ticket number in the queue display
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" align="left">
                    5 - When your turn comes, state your code city to the queue
                    keeper
                  </Typography>
                </li>
              </ol>
            </Grid>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
