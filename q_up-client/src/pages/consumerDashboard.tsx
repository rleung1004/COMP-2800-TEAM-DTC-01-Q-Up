import React from 'react';
// import { Link } from 'react-router-dom';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import { makeStyles } from '@material-ui/core/styles';
import ConsumerNav from '../components/consumerNav';
import { Button, Grid, Menu, MenuItem } from '@material-ui/core';

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
   const [anchorEl, setAnchorEl] = React.useState(null);

   const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

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
                  <Button
                     aria-controls='simple-menu'
                     aria-haspopup='true'
                     onClick={handleClick}
                     className={classes.button}
                     style={{ color: 'white' }}
                  >
                     Categories
                  </Button>
                  <Menu
                     id='simple-menu'
                     anchorEl={anchorEl}
                     keepMounted
                     open={Boolean(anchorEl)}
                     onClose={handleClose}
                  >
                     <MenuItem onClick={handleClose}>Grocers</MenuItem>
                     <MenuItem onClick={handleClose}>Clinic</MenuItem>
                     <MenuItem onClick={handleClose}>Government</MenuItem>
                  </Menu>
               </Grid>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
