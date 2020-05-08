import React, { useState } from "react";
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Typography,
  IconButton,
  Button,
  ExpansionPanel,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import MapIcon from '@material-ui/icons/Map';

function formatTime(time24h: string) {
  const [hours, mins] = time24h.split(":");
  const intHours = parseInt(hours);
  return (intHours % 12 || 12) + ":" + mins + (intHours >= 12 ? "PM" : "AM");
}

export default function QueueListRow(props: any) {
  const data = props.data;
  const address = data.address;
  const expanded = props.isExpanded;
  const handleChange = props.handleChange;

  // const unit =
  //   address.unit === "" ? (
  //     <div></div>
  //   ) : (
  //     <Grid container item xs={1}>
  //       <Typography variant="body2">{address.unit}</Typography>
  //     </Grid>
  //   );
  const handleFavClick = (fav: Boolean) => () => {
    if (props.isFavList) {
      props.remove();
      return;
    }
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
    props.isFav ? favButtonModel : notFavButtonModel
  );

  const closedQueueHeader = (
    <Grid container item xs={4}>
      <Typography variant="body2">
        Now closed. Opens at {formatTime(data.startTime)}
      </Typography>
    </Grid>
  );

  const openQueueHeader = (
    <>
      <Grid container item xs={2} direction="column">
        <Typography variant="caption">Wait time</Typography>
        <Typography variant="body2">{data.wait}</Typography>
      </Grid>
      <Grid container item xs={2} direction="column">
        <Typography variant="caption">Queue Size</Typography>
        <Typography variant="body2">{data.size}</Typography>
      </Grid>
    </>
  );

  const queueUp = () => {
    console.log("");
  };
  return (
    <ExpansionPanel expanded={expanded} onChange={handleChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        {/* the header of expansion */}
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1">{data.name}</Typography>
          </Grid>
          {data.active ? openQueueHeader : closedQueueHeader}
          <Grid item xs={2}>
            {favicon}
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {/* the body */}
        <Grid container>
          <Grid container item xs={6} justify="flex-start">
            {" "}
            {/* address*/}
            <Grid item xs={12} >
              <Typography variant="body2" align="left">
                {address.unit +
                  " " +
                  address.streetAddress +
                  ", " +
                  address.city}{" "}
                <br />
                {address.province + ", " + address.postalCode}
              </Typography>
            </Grid>
            <Grid container item xs={12}  justify="flex-start">
              <IconButton size="small">
                <MapIcon color="primary"/>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="left">
                {data.active
                  ? "Closes at " + formatTime(data.closeTime)
                  : "Opens at " + formatTime(data.startTime)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={6}>
            <Grid item xs={12}>
              <Typography variant="body2" align="left">
                {data.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="left">
                {data.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="left">
                {data.website}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={queueUp}
                disabled={!data.active}
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
