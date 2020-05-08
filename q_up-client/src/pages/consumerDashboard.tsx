import React from 'react';
// import { Link } from 'react-router-dom';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import { makeStyles } from '@material-ui/core/styles';
import ConsumerNav from '../components/consumerNav';
import { Button, Grid, Typography } from '@material-ui/core';
import CurrentQueueInfo from '../components/currentQueueInfo';

const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   button: {
      margin: '20px auto 20px auto',
   },
}));

export default function ClientDashboardPage() {
   const classes = useStyles();

   //  navigator.geolocation.getCurrentPosition((position) => {
   //     let lat = position.coords.latitude;
   //     let lon = position.coords.longitude;
   //     console.log(lat, lon);
   //  });
   // const [anchorEl, setAnchorEl] = React.useState(null);

   // const handleClick = (event: any) => {
   //    setAnchorEl(event.currentTarget);
   // };

   // const handleClose = () => {
   //    setAnchorEl(null);
   // };
   const noQueue = (
      <Grid container justify='center' alignItems='center'>
         <Typography variant='h2'>Not currently queued</Typography>
      </Grid>
   );

   return (
      <>
         <Header Nav={ConsumerNav} />
         <main>
            <section>{true ? <CurrentQueueInfo /> : noQueue}</section>
            <section>
               <Grid container direction='column'>
                  <Button
                     type='submit'
                     variant='contained'
                     color='primary'
                     className={classes.button}
                  >
                     Abandon Queue
                  </Button>
                  <Button
                     type='submit'
                     variant='contained'
                     color='primary'
                     className={classes.button}
                  >
                     Search Queues
                  </Button>
               </Grid>
            </section>
         </main>
         <Footer />
      </>
   );
}
