import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

const DisplayHeader = () => {
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

   return (
      <header style={{ backgroundColor: '#242323' }}>
         <Grid container justify='center'>
            <Grid item container alignItems='center' xs={12}>
               <Grid item xs={2}>
                  <img src={require('../img/logo.png')} alt='QUP logo' />
               </Grid>
               <Grid item xs={2}></Grid>
               <Grid item xs={2}>
                  <Grid>Customers in line</Grid>
                  <Grid>11</Grid>
               </Grid>
               <Grid item xs={2}>
                  <Grid>Est. waiting time</Grid>
                  <Grid>11min</Grid>
               </Grid>
               <Grid item xs={2}></Grid>
               <Grid item xs={2}>
                  <Grid>Current time</Grid>
                  <Grid>{time.toLocaleTimeString()}</Grid>
               </Grid>
            </Grid>
         </Grid>
      </header>
   );
};

export default DisplayHeader;
