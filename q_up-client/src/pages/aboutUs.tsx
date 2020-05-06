import React from 'react';
import Footer from 'src/components/static/Footer';
import Header from 'src/components/static/Header';
import '../styles/aboutUs.scss';
import { Grid } from '@material-ui/core';
// import { Card, CardMedia } from '@material-ui/core';

export default function aboutUsPage() {
   return (
      <>
         <Header />
         <main>
            <Grid
               container
               justify='center'
               alignItems='center'
               className='top-pic-section'
            >
               <Grid item xs={12}>
                  <header id='top-img-text'>
                     <h2>This is just the beginning.</h2>
                  </header>
               </Grid>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
