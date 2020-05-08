import React from "react";
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

export default function QueueListRow(props: any) {
  const data = props.data;
  const address = data.address;
  const expanded = props.isExpanded;
  const handleChange = props.handleChange;
  const unit =
    address.unit === "" ? (
      <div></div>
    ) : (
      <Grid container item xs={2}>
        <Typography variant="body2">{address.unit}</Typography>
      </Grid>
  );

  
  
  const handleFavClick = () =>{
    if(props.favList) {
      props.remove();
    }
    console.log(props.favList);
  }

  const queueUp = () => {
    console.log("");
  };
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={handleChange}
    >
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
          <Grid container item xs={2} direction="column">
            <Typography variant="caption">Wait time</Typography>
            <Typography variant="body2">{data.wait}</Typography>
          </Grid>
          <Grid container item xs={2} direction="column">
            <Typography variant="caption">Queue Size</Typography>
            <Typography variant="body2">{data.size}</Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton color="secondary" onClick={handleFavClick} name='fav'>
              <StarIcon name='fav' />
            </IconButton>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {/* the body */}
        <Grid container>
          <Grid container item xs={8} justify="flex-start">
            {" "}
            {/* address*/}
            {unit}
            <Grid item xs={10}>
              <Typography variant="body2" align="left">
                {address.streetAddress}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2" align="left">
                {address.city}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" align="left">
                {address.province}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2" align="left">
                {address.postalCode}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
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
              <Button variant="contained" color="primary" onClick={queueUp}>
                Queue up
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
