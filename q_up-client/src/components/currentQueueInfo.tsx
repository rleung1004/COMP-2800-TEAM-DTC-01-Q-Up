import React from 'react';
import { Grid, Typography } from '@material-ui/core';

function currentQueueInfo() {
   return (
      <Grid container>
         <Grid container item xs={7} justify='flex-start'>
            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Current Queue{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  Costco
               </Typography>
            </Grid>

            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Wait Time{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  45 min
               </Typography>
            </Grid>

            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Current Position{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  15
               </Typography>
            </Grid>
         </Grid>
         <Grid container item xs={5}>
            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Ticket number{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  #152
               </Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Password{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  Calgary
               </Typography>
            </Grid>
         </Grid>
      </Grid>
   );
}

export default currentQueueInfo;
