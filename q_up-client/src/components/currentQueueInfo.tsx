import React from 'react';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(() => ({
   button: {
     margin: "20px auto 20px auto",
   },
 }));

function CurrentQueueInfo(props:any) {
   const classes = useStyles();
   const data = props.data;
   const axiosConfig = {
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
    };

   const abandonQueueHandler = () => {
      axios
      .put('/abandonQueue', {}, axiosConfig)
      .then((res) => {
        console.log(res);
        window.alert(res.data.general);
        props.triggerGetStatus()
      })
      .catch((err) => {
        console.error(err.response);
        window.alert(err.response.data.general);
      });
    };
   return (
      <Grid container>
         <Grid container item xs={7} justify='flex-start'>
            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Current Queue{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  {data.businessName}
               </Typography>
            </Grid>

            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Wait Time{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  {data.estimatedWaitTime}
               </Typography>
            </Grid>

            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Current Position{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  {data.currentPosition}
               </Typography>
            </Grid>
         </Grid>
         <Grid container item xs={5}>
            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Ticket number{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  {data.ticketNumber}
               </Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography display='inline' variant='body1'>
                  Password{'  '}
               </Typography>
               <Typography display='inline' variant='body2'>
                  {data.password}
               </Typography>
            </Grid>
         </Grid>
         <Grid container direction="column">
         <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={abandonQueueHandler}
            >
              Abandon Queue
            </Button>
         </Grid>
      </Grid>
   );
}

export default CurrentQueueInfo;
