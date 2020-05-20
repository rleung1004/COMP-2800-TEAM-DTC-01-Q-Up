import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import BoothEnterName from '../components/boothEnterName';
import BoothTicketInfo from '../components/boothTicketInfo';
import { Grid, Typography } from '@material-ui/core';
import '../styles/boothDashBoard.scss';

export default function BoothDashBoard() {
   const axiosConfig = {
      headers: {
         Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
   };

   const [state, setState] = useState({
      standBy: true,
      name: '',
      ticketNumber: '',
      password: '',
   });

   const [getData, setGetData] = useState(true);

   useEffect(() => {
      if (!getData) {
         return;
      }
      setGetData = false;
   }, []);

   const onEnterQueue = (state: any) => {
      axios
         .put('/boothEnterQueue', {}, axiosConfig)
         .then((res) => {
            const data = res.data.BoothSlotInfo;
            setState({
               standBy: false,
               name: data.customer,
               ticketNumber: data.ticketNumber,
               password: data.password,
            });
         })
         .catch((err) => {
            console.error(err);
            window.alert('Connection error.');
         });
      setState((prevState) => ({ ...prevState, standBy: !state.standBy }));
   };

   const onDone = () => {
      setState(() => ({
         standBy: true,
         name: '',
         ticketNumber: '',
         password: '',
      }));
   };

   return (
      <>
         <Header />
         <main>
            <Grid>
               {state.standBy ? (
                  <BoothEnterName enterQueue={onEnterQueue} />
               ) : (
                  <BoothTicketInfo
                     changeStandBy={onDone}
                     name={state.name}
                     ticketNumber={state.ticketNumber}
                     password={state.password}
                  />
               )}
            </Grid>
            <Grid container justify='center'>
               <Grid className='textContainer' item xs={4}>
                  <Typography className='boothFeatureHeadings' variant='h2'>
                     Simple
                  </Typography>
                  <Typography>
                     Enter the queue with just your name and a click of a
                     button. You will then get a ticket number and a password
                     which you will need to enter the store when it is your
                     turn. Now you can do something more meaningful instead of
                     waiting in front of the store.
                  </Typography>
               </Grid>
               <Grid className='textContainer' item xs={4}>
                  <Typography className='boothFeatureHeadings' variant='h2'>
                     Estimated
                  </Typography>
                  <Typography>
                     Esitmeted wait time and the current ticket number being
                     served is displayed on the store display screen. The screen
                     is so big you can see it from a mile away so that you can
                     wait anywhere without having to worry you will miss your
                     turn.
                  </Typography>
               </Grid>
               <Grid className='textContainer' item xs={4}>
                  <Typography className='boothFeatureHeadings' variant='h2'>
                     Easy
                  </Typography>
                  <Typography>
                     When it is your turn to enter the store, all you need is
                     the password you got when you check in. Just tell our staff
                     the password he will let you in. That's it. Happy shopping.
                  </Typography>
               </Grid>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
