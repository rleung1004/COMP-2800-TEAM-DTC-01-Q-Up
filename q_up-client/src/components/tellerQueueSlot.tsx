import React from "react";
import "../styles/tellerQueueSlot.scss";
import "../styles/selectors.scss";
import { Grid, Typography, Box } from "@material-ui/core";

export default function QueueSlot(props: any) {
  const slot = props.data;
  
  const colorClass = props.isSelected
    ? "queueSlotBox selected"
    : "queueSlotBox notSelected";
  
    const onClickHandler = () => {
    props.selectHandler()
  };
 
  return (
    <Box className={colorClass} onClick={onClickHandler}>
      <Grid container alignItems="center" justify="space-around">
        <Grid item xs={6}>
          <Typography variant="body1" align="center" display="inline">
            Number
          </Typography>
          <Typography variant="body2" align="center" display="inline">
            {" " + slot.ticketNumber}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" align="center" display="inline">
            Pass
          </Typography>
          <Typography variant="body2" align="center" display="inline">
            {" " + slot.password}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
