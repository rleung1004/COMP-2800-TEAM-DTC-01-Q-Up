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
import { formatGoogleMapURL, formatAddress } from "src/utils/formatting";
import '../styles/queueListRow.scss';

const useStyles = makeStyles({
  qupButton: {
    minWidth: "auto",
  },
  expansion: {
    borderBottom: '0.5px solid black' 
  },
  expansionSummary: {
   
  },
  expansionDetails: {
    backgroundColor: '#F6F6F6',
  }
});

function formatTime(time24h: string) {
  const [hours, mins] = time24h.split(":");
  const intHours = parseInt(hours);
  return (intHours % 12 || 12) + ":" + mins + (intHours >= 12 ? "PM" : "AM");
}

function isWeekend() {
  const date = new Date();
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }
  return false;
}

function evaluateOpenTime(hours: any) {
  if (isWeekend()) {
    return hours.startTime[0];
  }
  return hours.startTime[1];
}

function evaluateCloseTime(hours: any) {
  if (isWeekend()) {
    return hours.endTime[0];
  }
  return hours.endTime[1];
}

export default function QueueListRow(props: any) {
  const classes = useStyles();
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

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

  const handleToGMap = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=" +
        formatGoogleMapURL(formatAddress(address)),
      "_blank"
    );
  };

  const handleFavClick = (fav: Boolean) => () => {
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

    const packet = {
      favoriteQueueName: data.name,
    };

    Axios.put("/changeFavoriteQueueStatus", packet, axiosConfig)
      .then((res: any) => {
        window.alert(res.data.general);
        iconButtonManager();
        data.triggerGetStatus();
      })
      .catch((err) => {
        console.error(err);
        window.alert("Connection failed. Please try again");
      });
  };

  const favButtonModel = (
    <IconButton color="secondary" onClick={handleFavClick(true)}>
      <StarIcon />
    </IconButton>
  );
  const notFavButtonModel = (
    <IconButton color="secondary" onClick={handleFavClick(false)}>
      <StarBorderIcon color="primary" />
    </IconButton>
  );
  const [favicon, setFavicon] = useState(
    data.isFav ? favButtonModel : notFavButtonModel
  );

  const closedQueueHeader = (
    <Grid container item xs={12} justify="center" alignItems="center">
      <Typography variant="body2">
        Closed. Opens at {formatTime(data.startTime)}
      </Typography>
    </Grid>
  );

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

  const queueUp = () => {
    const packet = {
      queueName: data.name,
    };
    Axios.post("/customerEnterQueue", packet, axiosConfig)
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
        window.alert(err.response.general);
      });
  };
  return (
    <ExpansionPanel expanded={expanded} onChange={handleChange} square className={classes.expansion}>
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
            <Typography variant="body2" align="center">{data.description}</Typography>
          </Grid>
          <Grid container item xs={12} sm={6} justify="flex-start" >
          <Grid item xs={12} >
              <Typography variant="body2" className="leftText">
                {data.active
                  ? "Closes at " + formatTime(data.closeTime)
                  : "Opens at " + formatTime(data.startTime)}
              </Typography>
            </Grid>
            {" "}
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
