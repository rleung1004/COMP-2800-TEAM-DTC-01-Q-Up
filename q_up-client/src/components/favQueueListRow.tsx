import React from "react";
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Typography,
} from "@material-ui/core";

export default function FavQueueListRow(props: any) {
  const data = props.data;
  return (
    <>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
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
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{/* the body */}</ExpansionPanelDetails>
    </>
  );
}
