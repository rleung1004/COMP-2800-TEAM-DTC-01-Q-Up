import React from "react";
import { Grid, Typography, Box } from "@material-ui/core";

/**
 * Render a row in a list of employees.
 * @param props.data.email a string, the employees email
 * @param props.data.isOnline a boolean, true if online
 * @param props.data.isSelected a boolean, true if the row the selected row in the list
 * @param props.data.selectHandler a curried function. ->
 * The function has been curried by the parent component to contain a unique reference to the data represented by this row.
 */
export default function EmployeeListRow(props: any) {
  const data = props.data;

  // change css depending on the selected status(affects color)
  const colorClass = props.isSelected
    ? "queueSlotBox selected"
    : "queueSlotBox notSelected";

  // handle click anywhere on the row. Triggers the selectHandler function passed by the parent.
  const onClickHandler = () => {
    props.selectHandler();
  };
  return (
    <section>
      <Box className={colorClass} onClick={onClickHandler}>
        <Grid container justify="center">
          <Grid item xs={6}>
            <Typography variant="body1">{data.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {data.isOnline ? "Online" : "Away"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
}
