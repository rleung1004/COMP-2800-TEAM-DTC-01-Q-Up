import React from 'react';
import Footer from 'src/components/static/Footer';
import Header from 'src/components/static/Header';
import '../styles/aboutUs.scss';
import { Grid } from '@material-ui/core';
import us from '../img/us.png';
import productImage from '../img/product image.png';
import ourMission from '../img/our-mission.jpeg';
import logo from '../img/logo.png';

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
            <Grid className='our-story-section'>
               <img className='story-image' src={us} alt='Our avatars' />
               <Grid className='our-text-content'>
                  <h3>OUR STORY</h3>
                  <p>
                     In 2020, we founded Q-Up to resolve the issue of standing
                     in log-waiting lines to enter business buildings and
                     stores. The need to enforce social distancing in the
                     COVID-19 pandemic, has inspired our team to provide our
                     users, with our Q-UP system.
                  </p>
                  <p>
                     We are innovators, go-getters, and problem solvers. Our
                     co-founding team consists of brilliant BCIT students who
                     value solving genuine problems and creating platforms for
                     users to increase their satisfaction standards.
                  </p>
                  <p>
                     Above all, we create with the dream of enlivening our
                     ultimate mission, to provide genuine solutions to the
                     existing problems that the world is facing.
                  </p>
                  <img className='logo' src={logo} alt='logo' />
               </Grid>
               <img
                  className='story-image'
                  src={productImage}
                  alt='Our product'
               />
               <Grid className='our-text-content'>
                  <h3>OUR PRODUCT</h3>
                  <p>
                     We designed Q-UP, our first platform, to help with the
                     COVID-19 pandemic and target those customers that end up
                     standing on huge lineups to access services that businesses
                     provide.
                  </p>
                  <p>
                     Our app is designed specifically for those customers who
                     would rather not spend hours standing in line, and those
                     businesses who would want to use an automated and
                     intelligent service to manage their demanding customers. We
                     deliver premium quality tools and features for businesses.
                  </p>
                  <img className='logo' src={logo} alt='logo' />
               </Grid>
               <img
                  className='story-image'
                  src={ourMission}
                  alt='Our mission'
               />
               <Grid className='our-text-content'>
                  <h3>OUR MISSION</h3>
                  <p>
                     We are founded on the belief that great solutions should be
                     free and accessible for everyone. We are committed to
                     create solutions for issues that people may be facing
                     during the COVID-19 pandemic. We want to change the way the
                     solutions providers are perceived by providing high
                     quality, targeted, and free solutions for everyone.
                  </p>
                  <img className='logo' src={logo} alt='logo' />
               </Grid>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
