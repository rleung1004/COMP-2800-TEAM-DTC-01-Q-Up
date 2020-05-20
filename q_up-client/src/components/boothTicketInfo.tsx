import React from 'react';
import { Grid } from '@material-ui/core';

export default function boothEnterName(props: any) {
   return (
      <>
         <Grid container>
            <Grid item xs={12}>
               Hi {props.name}
            </Grid>
            <Grid item xs={6}>
               <Grid>Ticket Number</Grid>
               <Grid>{props.ticketNumber}</Grid>
            </Grid>
            <Grid item xs={6}>
               <Grid>Password</Grid>
               <Grid>{props.password}</Grid>
            </Grid>
         </Grid>
      </>
   );
}
