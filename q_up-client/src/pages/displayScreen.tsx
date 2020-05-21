import React from 'react';
import DisplayHeader from '../components/displayHeader';
import DisplayFooter from '../components/displayFooter';
import { Grid, Box, Typography } from '@material-ui/core';
import '../styles/displayScreen.scss';

export default function BoothDashBoard() {
   return (
      <>
         <DisplayHeader />
         <main>
            <Grid container>
               <Grid className='left-column' item xs={7}>
                  <Box pt={20}>
                     <Typography className='now-serving'>
                        NOW SERVING
                     </Typography>
                  </Box>
                  <Box pb={10}>
                     <Typography className='now-serving-ticket-number'>
                        #154
                     </Typography>
                  </Box>
               </Grid>
               <Grid className='right-column' item xs={5} container>
                  <Grid xs={6}>
                     <Box pt={5}>Ticket #</Box>
                  </Grid>
                  <Grid xs={6}>
                     <Box pt={5}>Status</Box>
                  </Grid>
               </Grid>
            </Grid>
         </main>
         <DisplayFooter />
      </>
   );
}
