import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import ConsumerNav from '../components/consumerNav';
import axios from 'axios';
import {
   makeStyles,
   Grid,
   Typography,
   TextField,
   Button,
} from '@material-ui/core';
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

export default function ConsumerEditProfilePage() {
   const classes = useStyles();
   interface errors {
      phoneNumber?: string;
      postalCode?: string;
   }
   const errorObject: errors = {};
   const [getData, setGetData] = useState(true);
   const [formState, setFormState] = useState({
      phoneNumber: '',
      postalCode: '',
      loading: false,
      errors: errorObject,
   });
   const axiosConfig = {
      headers: {
         Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
   };
   const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormState((prevState) => ({ ...prevState, [name]: value }));
   };
   const handleSkipOnClick = () => {
      const skip = window.confirm('Are you sure?');
      if (skip) {
         window.location.href = '/consumerProfile';
      }
   };
   const handleSubmit = (event: FormEvent) => {
      if (!window.confirm("Are you sure? Can't be undone.")) {
         return;
      }
      event.preventDefault();
      setFormState((prevState) => ({ ...prevState, loading: true }));
      const userData = {
         phoneNumber: formState.phoneNumber,
         postalCode: formState.postalCode,
         email: formState.postalCode,
      };

      axios
         .put('/updateCustomer', userData, axiosConfig)
         .then(() => {
            window.location.href = '/consumerProfile';
         })
         .catch((err: any) => {
            setFormState((prevState) => ({
               ...prevState,
               errors: err.response.data,
               loading: false,
            }));
         });
   };

   useEffect(() => {
      if (!getData) {
         return;
      }
      setGetData(false);
      axios
         .get('/getCustomer', axiosConfig)
         .then((res: any) => {
            const data = res.data.customerData;
            setFormState({
               phoneNumber: data.phoneNumber ? data.phoneNumber : '',
               postalCode: data.postalCode ? data.postalCode : '',
               loading: false,
               errors: errorObject,
            });
         })
         .catch((err: any) => {
            window.alert('Connection error');
            console.log(err);
         });
   }, [axiosConfig, errorObject, getData]);
   return (
      <>
         <Header Nav={ConsumerNav} />
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
                     <Typography variant='caption'>
                        Email cannot be changed
                     </Typography>
                     <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                     >
                        Update
                     </Button>
                  </Grid>
               </form>
               <Button variant='contained' onClick={handleSkipOnClick}>
                  Cancel
               </Button>
            </Grid>
         </main>
         <Footer />
      </>
   );
}
