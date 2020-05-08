import React from "react";
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Typography,
  IconButton,
  Button,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import StarIcon from "@material-ui/icons/Star";
import { mockFavQueues } from "src/mockData";

export default function FavQueueListRow(props: any) {
  const data = props.data;
  const address = data.address;
  const unit =
    address.unit === "" ? (
      <div></div>
    ) : (
      <Grid container item xs={12}>
        <Typography variant="body1">unit</Typography>
        <Typography variant="body2">{address.unit}</Typography>
      </Grid>
    );
  const queueUp = () ={

  };
  return (
    <>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        {/* the header of expansion */}
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body1">{data.name}</Typography>
          </Grid>
          <Grid container item xs={2} direction="column">
            <Typography variant="caption">Wait time</Typography>
            <Typography variant="body2">{data.wait}</Typography>
          </Grid>
          <Grid container item xs={2} direction="column">
            <Typography variant="caption">Queue Size</Typography>
            <Typography variant="body2">{data.size}</Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton color="secondary">
              <StarIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {/* the body */}
        <Grid container>
          <Grid container item xs={8}>
            {" "}
            {/* address*/}
            <address>
              <Typography variant="h3">Address</Typography>
              {unit}
              <Grid item xs={12}>
                <Typography variant="body1">Street address</Typography>
                <Typography variant="body2">{address.streetAddress}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">City</Typography>
                <Typography variant="body2">{address.city}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">Province</Typography>
                <Typography variant="body2">{address.province}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">Postal Code</Typography>
                <Typography variant="body2">{address.postalCode}</Typography>
              </Grid>
            </address>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={12}>
              <Typography variant="body2">{data.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">{data.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">{data.website}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={queueUp}>
                Queue up
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </>
  );
}
