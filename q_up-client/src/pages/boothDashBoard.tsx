import React from 'react';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import { TextField } from '@material-ui/core';

export default function BoothDashBoard() {
   return (
      <>
         <Header />
         <main>
            <TextField
               color='secondary'
               id='phone'
               label='Enter Your name'
               name='name'
            />
         </main>
         <Footer />
      </>
   );
}
