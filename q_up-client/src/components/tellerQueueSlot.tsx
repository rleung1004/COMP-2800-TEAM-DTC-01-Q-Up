import React from "react";
import "../styles/tellerQueueSlot.scss";
import "../styles/selectors.scss";
import { Grid, Typography, Box } from "@material-ui/core";

/**
 
 * 
 * This component is used in the teller's page.
 * @param props 
 */
/**
 * Render a queue slot. 
 * @param props.data.email a string, the employees email
 * @param props.data.isOnline a boolean, true if online
 * @param props.data.isSelected a boolean, true if the row the selected row in the list
 * @param props.data.selectHandler a curried function. ->
 * The function has been curried by the parent component to contain a unique reference to the data represented by this row.
 */
export default function QueueSlot(props: any) {
  const slot = props.data;

  const colorClass = props.isSelected
    ? "queueSlotBox selected"
    : "queueSlotBox notSelected";

  /// handle click anywhere on the row. Triggers the selectHandler function passed by the parent.
  const onClickHandler = () => {
    props.selectHandler();
  };

  return (
    <Box className={colorClass} onClick={onClickHandler}>
      <Grid container alignItems="center" justify="space-around">
        <Grid item xs={6}>
          <Typography variant="body1" align="center" display="inline">
            Number:
          </Typography>
          <Typography variant="body2" align="center" display="inline">
            {" " + slot.ticketNumber}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" align="center" display="inline">
            Pass:
          </Typography>
          <Typography variant="body2" align="center" display="inline">
            {" " + slot.password}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
