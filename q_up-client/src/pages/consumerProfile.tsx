import React, { useState, ChangeEvent, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import ConsumerNav from '../components/consumerNav';
import {
   Grid,
   Button,
   Typography,
   makeStyles,
   Dialog,
   DialogContent,
   DialogTitle,
   TextField,
   DialogActions,
} from '@material-ui/core';
import axios from 'axios';
import { formatPhone } from '../utils/formatting';

const useStyles = makeStyles(() => ({
   button: {
      margin: '20px auto 20px auto',
   },
   textField: {
      margin: '20px auto 20px auto',
   },
}));

export default function ConsumerProfilePage() {
  interface errors {
    // oldPassword?: string,
    newPassword?:string,
    newPasswordConfirm?: string
  }
  const errorObj: errors = {}
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [passDialogOpen, setPassDialogOpen] = useState(false);
  const [getData, setGetData] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    // oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    errors: errorObj
  });

   const axiosConfig = {
      headers: {
         Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
   };

   const handleEditProfile = () => {
      window.location.href = '/editConsumerProfile';
   };

   const handlePasswordChange = () => {
      setPassDialogOpen(true);
   };

   const handlePassChangeCancel = () => {
      setPassDialogOpen(false);
   };

   const handlePassFormChange = (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setPasswordForm((prevState: any) => ({ ...prevState, [name]: value }));
   };

   const handleDeleteProfile = () => {
      if (!window.confirm('Are you sure? This cannot be undone.')) {
         return;
      }
      axios
         .delete('/deleteCustomer', axiosConfig)
         .then(() => {
            window.location.href = '/';
            window.alert('Your account has been deleted');
         })
         .catch((err: any) => {
            window.alert('Connection error');
            console.log(err);
         });
   };

   const handlePasswordSubmit = () => {
      if (!window.confirm('Are you sure?')) {
         return;
      }
      const packet = {
         // oldPassword: passwordForm.oldPassword,
         password: passwordForm.newPassword,
         confirmPassword: passwordForm.newPasswordConfirm,
      };
      axios
         .put('/changePassword', packet, axiosConfig)
         .then((res) => {
            console.log(res.data);

            window.alert('Password successfully changed');
            setPassDialogOpen(false);
         })
         .catch((err: any) => {
            window.alert('Connection error');
            console.log(err);
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
            console.log(data);
            setEmail(data.email);
            setPhoneNumber(
               data.phoneNumber ? formatPhone(data.phoneNumber) : 'N/A'
            );
            setPostalCode(data.postalCode ? data.postalCode : 'N/A');
         })
         .catch((err: any) => {
            window.alert('Connection error');
            console.log(err);
         });
   }, [axiosConfig, errorObj, getData]);
  
  return (
    <>
      <Header Nav={ConsumerNav} logout/>
      <main>
        <section>
          <Grid container justify="space-around">
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleEditProfile}
              >
                Edit profile
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleDeleteProfile}
              >
                Delete account
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handlePasswordChange}
              >
                Change password
              </Button>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container>
            <Grid item sm={12} md={6}>
              <Typography variant="body1">Email</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body2">{email}</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body1">Phone number</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body2">{phoneNumber}</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body1">Postal code</Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography variant="body2">{postalCode}</Typography>
            </Grid>
          </Grid>
        </section>
      </main>
      <Dialog open={passDialogOpen} onClose={handlePassChangeCancel} PaperProps={{style: {backgroundColor:"#242323"}}}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container direction='column'>
          {/* <TextField
          type="password"
            color="secondary"
            id="oldPassText"
            label="Old password"
            name="oldPassword"
            onChange={handlePassFormChange}
            value={passwordForm.oldPassword}
            className={classes.textField}
            helperText={passwordForm.errors.oldPassword}
            error={passwordForm.errors.oldPassword ? true : false}
          /> */}
                  <TextField
                     type='password'
                     color='secondary'
                     id='newPassText'
                     label='New password'
                     name='newPassword'
                     onChange={handlePassFormChange}
                     value={passwordForm.newPassword}
                     className={classes.textField}
                     helperText={passwordForm.errors.newPassword}
                     error={passwordForm.errors.newPassword ? true : false}
                  />
                  <TextField
                     type='password'
                     color='secondary'
                     id='newPassConfirm'
                     label='Cornfirm password'
                     name='newPasswordConfirm'
                     onChange={handlePassFormChange}
                     value={passwordForm.newPasswordConfirm}
                     className={classes.textField}
                     helperText={passwordForm.errors.newPasswordConfirm}
                     error={
                        passwordForm.errors.newPasswordConfirm ? true : false
                     }
                  />
               </Grid>
            </DialogContent>
            <DialogActions>
               <Button
                  variant='contained'
                  color='primary'
                  className={classes.button}
                  onClick={handlePassChangeCancel}
               >
                  Cancel
               </Button>
               <Button
                  variant='contained'
                  color='secondary'
                  className={classes.button}
                  onClick={handlePasswordSubmit}
               >
                  Ok
               </Button>
            </DialogActions>
         </Dialog>
         <Footer />
      </>
   );
}
