import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import '../styles/booth.scss';

export default function BoothDisabledInfo() {
  return (
    <>
      <Grid
        container
        className="boothInfoSectionContent"
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <Typography variant="h1">Now Closed</Typography>
        </Grid>
      </Grid>
    </>
  );
}
