import React from 'react';
// import { Link } from 'react-router-dom';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import { makeStyles } from '@material-ui/core/styles';
import ConsumerNav from '../components/consumerNav';
import { Button, Grid } from '@material-ui/core';
import Dropdown from 'react-bootstrap/Dropdown';

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

   return (
      <>
         <Header Nav={ConsumerNav} />
         <main>
            <Grid container spacing={0} justify='center'>
               <Grid item xs={2}>
                  <Button
                     type='submit'
                     variant='contained'
                     color='primary'
                     className={classes.button}
                  >
                     Search Queues
                  </Button>
               </Grid>
               <Grid item xs={2}>
                  <Dropdown className={classes.button}>
                     <Dropdown.Toggle id='dropdown-basic'>
                        Dropdown Button
                     </Dropdown.Toggle>

                     <Dropdown.Menu>
                        <Dropdown.Item style={{ textDecoration: 'none' }}>
                           Grocer
                        </Dropdown.Item>
                        <Dropdown.Item style={{ textDecoration: 'none' }}>
                           Restaurant
                        </Dropdown.Item>
                        <Dropdown.Item style={{ textDecoration: 'none' }}>
                           Government
                        </Dropdown.Item>
                        <Dropdown.Item style={{ textDecoration: 'none' }}>
                           Hairdresser
                        </Dropdown.Item>
                        <Dropdown.Item style={{ textDecoration: 'none' }}>
                           Clinic
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </Grid>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
