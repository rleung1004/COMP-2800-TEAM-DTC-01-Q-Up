import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/landing.scss';
import { Grid, Typography, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import StaticNav from '../components/staticNav';
import { makeStyles } from '@material-ui/core/styles';

// Mui Stylings
const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   button: {
      margin: 'auto',
   },
}));

/**
 * Render a landing page.
 *
 * Accessible to: All users.
 */
export default function LandingPage() {
   const classes = useStyles();
   return (
      <>
         <Header Nav={StaticNav} />
         <main>
            <Grid
               container
               justify='center'
               alignItems='center'
               className='top-pic-section'
            >
               <Grid item xs={12}>
                  <header id='landing-header'>
                     <h2>No more queues with Q-UP</h2>
                     <p>
                        Queue from home on your favorite grocers, clinics and
                        more!
                     </p>
                  </header>
               </Grid>

               <Grid item container direction='column' spacing={2}>
                  <Grid item>
                     <Link to='/login' style={{ textDecoration: 'none' }}>
                        <Button
                           type='button'
                           variant='contained'
                           color='primary'
                           className={classes.button}
                        >
                           Sign in
                        </Button>
                     </Link>
                  </Grid>
                  <Grid item>
                     <Link to='/signup' style={{ textDecoration: 'none' }}>
                        <Button
                           type='button'
                           variant='contained'
                           color='primary'
                           className={classes.button}
                        >
                           Sign up
                        </Button>
                     </Link>
                  </Grid>
               </Grid>
            </Grid>
            <Grid className='landing-page-body'>
               <Grid id='iframe-container'>
                  <iframe
                     title='Pitch'
                     frameBorder='0'
                     id='pitch-video'
                     src='https://www.youtube.com/embed/zUbBq3o2b2g'
                     allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                     allowFullScreen
                  />
               </Grid>
               <Grid
                  justify='center'
                  alignItems='center'
                  container
                  className='how-it-works-section'
               >
                  <Grid item xs={12}>
                     <Box mt={2} mb={2}>
                        <Typography variant='h2'>How it Works</Typography>
                     </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Box pl={3} pr={3}>
                        <Box mt={1} mb={1}>
                           <Typography className='bold' variant='h3'>
                              As a Customer:
                           </Typography>
                        </Box>
                        <ul>
                           <li>Sign up to our website</li>
                           <li>Find the store that you want</li>
                           <li>Press enter</li>
                           <li>Go to the store when its your turn</li>
                        </ul>
                     </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Box pl={3} pr={3}>
                        <Box mt={1} mb={1}>
                           <Typography className='bold' variant='h3'>
                              As a Business:
                           </Typography>
                        </Box>
                        <ul>
                           <li>Sign up to our website</li>
                           <li>Set up your business profile</li>
                           <li>Start your queue</li>
                           <li>Let customers into your store</li>
                        </ul>
                     </Box>
                  </Grid>
               </Grid>
               <Grid>
                  <Grid item xs={12}>
                     <img
                        style={{ width: '100%' }}
                        src={require('../img/hugelineup.jpeg')}
                        alt='Hugo line up'
                     />
                  </Grid>
               </Grid>
               <Grid>
                  <Box p={4}>
                     <Typography>
                        Did you know that an average person spends about{' '}
                        <strong>one year</strong> of their life waiting on
                        lineups? Are you concerned about maintaining your social
                        distancing in the huge grocery lineups? We recognizes
                        how precious your time is, so we want to introduce you
                        to Q-UP. Q-Up is an online platform that allows you to
                        be just a click away from virtually standing in a line.
                        It tells you how many people are ahead of you and gives
                        you an estimate on how longer you need to be waiting in
                        the line. Spot waiting with Q-UP.
                     </Typography>
                  </Box>
               </Grid>
               <Grid item xs={12}>
                  <img
                     style={{ width: '100%' }}
                     src={require('../img/product image.png')}
                     alt='Product'
                  />
               </Grid>
               <Grid container justify='center' alignItems='center'>
                  <Grid item xs={12} sm={6}>
                     <Box m={4}>
                        <Box mt={1} mb={1}>
                           <Typography variant='h2'>Simple</Typography>
                        </Box>
                        <Typography>
                           Enter the queue with just a click of a button. You
                           will then get a ticket number and a password which
                           you will need to enter the store when it is your
                           turn.
                        </Typography>
                     </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Box m={4}>
                        <Box mt={1} mb={1}>
                           <Typography variant='h2'>Estimated</Typography>
                        </Box>
                        <Typography>
                           Your wait time is estimated by our powerful machine
                           learning algorithm. We will notify when you should be
                           heading out based on the distance between you and the
                           store you queued up for.
                        </Typography>
                     </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Box m={4}>
                        <Box mt={1} mb={1}>
                           <Typography variant='h2'>Easy</Typography>
                        </Box>
                        <Typography>
                           When it is your turn to enter the store, all you need
                           is the password you got when you check in. Just tell
                           our staff the password he will let you in. That's it.
                        </Typography>
                     </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Box m={4}>
                        <Box mt={1} mb={1}>
                           <Typography variant='h2'>Personalized</Typography>
                        </Box>
                        <Typography>
                           You can bookmark your favourite stores. You can also
                           get live information on the current queue status.
                        </Typography>
                     </Box>
                  </Grid>
               </Grid>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
