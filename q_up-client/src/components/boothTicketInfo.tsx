import React from "react";
import { Grid, Button, Typography } from "@material-ui/core";

export default function boothEnterName(props: any) {
  const data = props.data;
  return (
    <>
      <Grid
        container
        className="boothInfoSectionContent"
        justify="space-around"
      >
        <Grid item xs={12} className="pushDown">
          <Typography variant="h3" align="center">
            Hi {data.name}
          </Typography>
        </Grid>
        <Grid item container xs={6} direction="column" justify="center">
          <Typography variant="body1">Ticket Number</Typography>
          <Typography variant="body2">{data.ticketNumber}</Typography>
        </Grid>
        <Grid item container xs={6} direction="column" justify="center">
          <Typography variant="body1">Code city</Typography>
          <Typography variant="body2">{data.password}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" onClick={props.onDone}>
            Done
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
