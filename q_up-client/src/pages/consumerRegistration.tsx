import React, { useState, ChangeEvent, FormEvent } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   pageTitle: {
      margin: '20px auto 20px auto',
   },
   textField: {
      margin: '20px auto 20px auto',
   },
   button: {
      margin: '20px auto 20px auto',
   },
}));

export default function ConsumerRegistrationPage() {
   const classes = useStyles();
   interface errors {
      phoneNumber?: string;
      postalCode?: string;
   }

   const errorObject: errors = {};

   const [formState, setFormState] = useState({
      phoneNumber: '',
      postalCode: '',
      loading: false,
      errors: errorObject,
   });

   const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormState((prevState) => ({ ...prevState, [name]: value }));
   };
   const handleSkipOnClick = () => {
      const skip = window.confirm(
         'Are you sure? This information be used to provide you better functionality.'
      );
      if (skip) {
         window.location.href = '/consumerDashboard';
      }
   };
   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      setFormState((prevState) => ({ ...prevState, loading: true }));
      const userData = {
         phoneNumber: formState.phoneNumber,
         postalCode: formState.postalCode,
      };

      const axiosConfig = {
         headers: {
            Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
         },
      };

      axios
         .post('/registerCustomer', userData, axiosConfig)
         .then(() => {
            window.location.href = '/consumerDashboard';
         })
         .catch((err: any) => {
            setFormState((prevState) => ({
               ...prevState,
               errors: err.response.data,
               loading: false,
            }));
         });
   };

   return (
      <>
         <Header />
         <main>
            <Grid
               container
               direction='column'
               justify='center'
               alignItems='center'
            >
               <form
                  className={classes.root}
                  autoComplete='off'
                  onSubmit={handleSubmit}
               >
                  <Grid
                     container
                     className='form'
                     direction='column'
                     justify='center'
                     alignItems='center'
                  >
                     <Typography variant='h2' className={classes.pageTitle}>
                        Your info
                     </Typography>
                     <TextField
                        color='secondary'
                        id='phone'
                        label='Phone number'
                        name='phoneNumber'
                        onChange={handleOnFieldChange}
                        value={formState.phoneNumber}
                        className={classes.textField}
                        helperText={formState.errors.phoneNumber}
                        error={formState.errors.phoneNumber ? true : false}
                     />
                     <TextField
                        color='secondary'
                        id='postalCode'
                        label='Postal/Zip Code'
                        name='postalCode'
                        onChange={handleOnFieldChange}
                        value={formState.postalCode}
                        className={classes.textField}
                        helperText={formState.errors.postalCode}
                        error={formState.errors.postalCode ? true : false}
                     />
                     <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                     >
                        Submit
                     </Button>
                  </Grid>
               </form>
               <Button variant='contained' onClick={handleSkipOnClick}>
                  Skip
               </Button>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
