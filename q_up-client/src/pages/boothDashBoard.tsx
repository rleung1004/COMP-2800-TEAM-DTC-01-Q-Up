import React, { useState } from 'react';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import BoothEnterName from '../components/boothEnterName';
import BoothTicketInfo from '../components/boothTicketInfo';
import { Grid, Typography } from '@material-ui/core';

export default function BoothDashBoard() {
   const [state, setState] = useState({
      standBy: true,
      name: '',
      ticketNumber: '',
      password: '',
   });

   const onChangeDisplay = (state: any) => {
      setState({ standBy: !state.standBy });
   };

   return (
      <>
         <Header />
         <main>
            {/* <Grid container direction="center>
                  <Grid container item xs={12} sm={} md={} lg={}>
                     <Paper className=" yourElementPaper">
                        <Grid item xs={12} sm={} md={} lg={}> */}
            <Grid>
               {state.standBy ? (
                  <BoothEnterName enterQueue={onChangeDisplay} />
               ) : (
                  <BoothTicketInfo
                     name={state.name}
                     ticketNumber={state.ticketNumber}
                     password={state.password}
                  />
               )}
            </Grid>
            <Grid container spacing={8} justify='center'>
               <Grid item xs={3}>
                  <Typography>Feature</Typography>
                  <Typography>
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Etiam suscipit ipsum felis, in finibus libero tincidunt
                     nec. Pellentesque sit amet rutrum urna. Interdum et
                     malesuada fames ac ante ipsum primis in faucibus.
                  </Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography>Feature</Typography>
                  <Typography>
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Etiam suscipit ipsum felis, in finibus libero tincidunt
                     nec. Pellentesque sit amet rutrum urna. Interdum et
                     malesuada fames ac ante ipsum primis in faucibus.
                  </Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography>Feature</Typography>
                  <Typography>
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Etiam suscipit ipsum felis, in finibus libero tincidunt
                     nec. Pellentesque sit amet rutrum urna. Interdum et
                     malesuada fames ac ante ipsum primis in faucibus.
                  </Typography>
               </Grid>
            </Grid>
            {/* </Grid>
                  </Paper>
               </Grid>
            </Grid> */}
         </main>
         <Footer />
      </>
   );
}
