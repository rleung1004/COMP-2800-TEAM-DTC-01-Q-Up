import React, { useState } from "react";
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Typography,
  IconButton,
  Button,
  ExpansionPanel,
  makeStyles,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import MapIcon from "@material-ui/icons/Map";
import Axios from "axios";
import { formatURL, formatAddress } from "src/utils/formatting";
import "../styles/queueListRow.scss";
import { formatTimeInto12h } from "../utils/formatting";
import { evaluateOpenTime, evaluateCloseTime } from '../utils/misc';
import app from "../firebase";

// Mui stylings
const useStyles = makeStyles({
  qupButton: {
    minWidth: "auto",
  },
  expansion: {
    borderBottom: "0.5px solid black",
  },
  expansionSummary: {},
  expansionDetails: {
    backgroundColor: "#F6F6F6",
  },
});

/**
 * Render an individual queue list row.
 * 
 * Queue list rows are displayed as an expansion panel.
 * The summary section is always shown. The details section is show selectively.
 * @param props.hit optional parameter, data as provided by algolia
 * @param props.data optional parameter, data as provided by our server
 * 
 * props.hit (+) props.data
 * Parameters are mutually exclusive.
 */
export default function QueueListRow(props: any) {
  const classes = useStyles();
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  // Map the data according to the data provider
  const data = props.data
    ? {
        ...props.data,
        startTime: evaluateOpenTime(props.data.hours),
        closeTime: evaluateCloseTime(props.data.hours),
      }
    : {
        ...props.hit,
        active: props.hit.queue.isActive,
        size: props.hit.queue.queueSlots.length,
        startTime: evaluateOpenTime(props.hit.hours),
        closeTime: evaluateCloseTime(props.hit.hours),
        isFav: props.hit.isFav,
        triggerGetStatus: props.hit.triggerGetStatus,
        wait: props.hit.queue.currentWaitTime,
      };
  const address = data.address;
  const expanded = props.isExpanded;
  const handleChange = props.handleChange;
  const [favStatus, setFavStatus] = useState(props.data ? props.data.isFav : props.hit.isFav);

  // Handle click on map button
  const handleToGMap = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=" +
        formatURL(formatAddress(address)),
      "_blank"
    );
  };

  /**
   * Handle click on Fav button.
   * 
   * The Fav button is a curried button.
   * It remembers whether to call the click handler with true or false
   * @param fav the previous state
   * @post will set the fav button such as:
   * If the previous state was true, will curry false
   * as the next state
   * else will curry true
   * @post will replace the fav button with a new one
   */
  const handleFavClick = (fav: Boolean) => async () => {
    const iconButtonManager = () => {
      if (fav) {
        setFavicon(
          <IconButton color="secondary" onClick={handleFavClick(false)}>
            <StarBorderIcon color="primary" />
          </IconButton>
        );
      } else {
        setFavicon(
          <IconButton color="secondary" onClick={handleFavClick(true)}>
            <StarIcon />
          </IconButton>
        );
      }
    };

    // map the data into server format
    const packet = {
      favoriteQueueName: data.name.charAt(0).toUpperCase() +  data.name.substr(1).toLowerCase(),
    };

    await Axios.put("/changeFavoriteQueueStatus", packet, axiosConfig)
      .then((res: any) => {
        window.alert(res.data.general);
        setFavStatus(!favStatus);
        iconButtonManager();
        data.triggerGetStatus();
      })
      .catch((err) => {
        console.error(err);
        console.error(err);
        if (err.response.status && err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut().catch(console.error);
          return;
        }
        window.alert("Connection failed. Please try again");
      });
  };

  /**
   * Following are the initial models for the fav button.
   * The only difference is the color of the icon.
   */

  // Initial fav button model. True version
  const favButtonModel = (
    <IconButton color="secondary" onClick={handleFavClick(true)}>
      <StarIcon />
    </IconButton>
  );

  // Initial fav button model. False version
  const notFavButtonModel = (
    <IconButton color="secondary" onClick={handleFavClick(false)}>
      <StarBorderIcon color="primary" />
    </IconButton>
  );

  // determin what is the initial fav button depending on the actual queue state
  const [favicon, setFavicon] = useState(
    favStatus ? favButtonModel : notFavButtonModel
  );

  // section of the expansion panel header to be displayed if the queue is not active
  const closedQueueHeader = (
    <Grid container item xs={12} justify="center" alignItems="center">
      <Typography variant="body2">
        Closed. Opens at {formatTimeInto12h(data.startTime)}
      </Typography>
    </Grid>
  );

  // section of the expansion panel header to be displayed if the queue is active
  const openQueueHeader = (
    <>
      <Grid container item xs={6} justify="center" alignItems="center">
        <Typography variant="body2">Wait time {data.wait}</Typography>
      </Grid>
      <Grid container item xs={6} justify="center" alignItems="center">
        <Typography variant="body2">Queue Size {data.size}</Typography>
      </Grid>
    </>
  );

  // click handler for queueUp button
  const queueUp = async () => {
    const packet = {
      queueName: data.name.charAt(0).toUpperCase() +  data.name.substr(1).toLowerCase(),
    };
    await Axios.post("/customerEnterQueue", packet, axiosConfig)
      .then((res) => {
        console.log(res);
        window.alert(res.data.general);
        if (props.data) {
          data.triggerGetStatus();
        } else {
          window.location.href = "/consumerDashboard";
        }
      })
      .catch((err) => {
        console.error(err);
        console.error(err);
        if (err.response.status && err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut().catch(console.error);
          return;
        }
        window.alert(err.response.general);
      });
  };
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={handleChange}
      square
      className={classes.expansion}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        className={classes.expansionSummary}
      >
        {/* the header of expansion */}
        <Grid container alignItems="center">
          <Grid item container xs={10}>
            <Grid item xs={12}>
              <Typography variant="body1">{data.name}</Typography>
            </Grid>
            {data.active ? openQueueHeader : closedQueueHeader}
          </Grid>
          <Grid item xs={2}>
            {favicon}
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionDetails}>
        {/* the body */}
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              {data.description}
            </Typography>
          </Grid>
          <Grid container item xs={12} sm={6} justify="flex-start">
            <Grid item xs={12}>
              <Typography variant="body2" className="leftText">
                {data.active
                  ? "Closes at " + formatTimeInto12h(data.closeTime)
                  : "Opens at " + formatTimeInto12h(data.startTime)}
              </Typography>
            </Grid>{" "}
            {/* address*/}
            <Grid item xs={12}>
              <Typography variant="body2" className="leftText">
                {address.unit +
                  " " +
                  address.streetAddress +
                  ", " +
                  address.city}{" "}
                {address.province + ", " + address.postalCode}
                <IconButton size="small" onClick={handleToGMap}>
                  <MapIcon color="primary" />
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={6}>
            <Grid item xs={12}>
              <Typography variant="body2" className="rightText">
                {data.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" className="rightText">
                {data.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" className="rightText">
                {data.website}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={queueUp}
                disabled={!data.active}
                className={classes.qupButton}
              >
                Queue up
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
