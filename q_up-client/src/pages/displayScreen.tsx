import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import '../styles/displayScreen.scss';
import axios from 'axios';

export default function BoothDashBoard() {
   // Current time display
   // I found this code on https://productoptimist.com/
   // @see https://productoptimist.com/start-using-react-hooks-a-clock-timer-example/
   const [time, setTime] = useState(new Date());

   useEffect(() => {
      var timerID = setInterval(() => tick(), 1000);
      return function cleanup() {
         clearInterval(timerID);
      };
   });

   function tick() {
      setTime(new Date());
   }
   // End current time display

   const axiosConfig = {
      headers: {
         Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
   };

   const [getData, setGetData] = useState(true);
   const [nowServing, setNowServing] = useState(-1);
   const [queueLength, setQueueLength] = useState(-1);
   const [estimatedWaitTime, setEstimatedWaitTime] = useState(-1);

   useEffect(() => {
      if (!getData) {
         return;
      }
      setGetData(false);
      axios
         .get('/getDisplay', axiosConfig)
         .then((res) => {
            const data = res.data.displayInfo;
            const waitTime = res.data.estimatedWaitTime;
            console.log(res);

            setNowServing(data[0]);
            setQueueLength(data.length);
            setEstimatedWaitTime(waitTime);
         })
         .catch((err) => {
            console.error(err);
         });
   });

   return (
      <>
         <div
            className='displayScreenHeader'
            style={{ backgroundColor: '#242323' }}
         >
            <Grid container justify='center'>
               <Grid item container alignItems='center' xs={12}>
                  <Grid item xs={2}>
                     <img src={require('../img/logo.png')} alt='QUP logo' />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}>
                     <Grid>
                        <Typography variant='h2'>Customers in line</Typography>
                     </Grid>
                     <Grid>
                        <Typography variant='h3'>{queueLength}</Typography>
                     </Grid>
                  </Grid>
                  <Grid item xs={2}>
                     <Grid>
                        <Typography variant='h2'>Est. wait time</Typography>
                     </Grid>
                     <Grid>
                        <Typography variant='h3'>
                           {estimatedWaitTime}
                        </Typography>
                     </Grid>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}>
                     <Grid>
                        <Typography variant='h2'>Current time</Typography>
                     </Grid>
                     <Grid>
                        <Typography variant='h3'>
                           {time.toLocaleTimeString()}
                        </Typography>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </div>
         <main className='displayPage'>
            <Grid container>
               <Grid className='left-column' item xs={12}>
                  <Box pt={6}>
                     <Typography className='now-serving'>
                        NOW SERVING
                     </Typography>
                  </Box>
                  <Box pb={6}>
                     <Typography className='now-serving-ticket-number'>
                        #{nowServing}
                     </Typography>
                  </Box>
               </Grid>
               {/* <Grid className='right-column' item xs={5} container>
                  <Grid xs={6}>
                     <Box pt={5}>Ticket #</Box>
                  </Grid>
               </Grid> */}
            </Grid>
         </main>
         <footer className='displayScreenFooter'>
            <Grid>
               <Typography variant='h2'>
                  Please present your number to our service staff.
               </Typography>
            </Grid>
         </footer>
      </>
   );
}
