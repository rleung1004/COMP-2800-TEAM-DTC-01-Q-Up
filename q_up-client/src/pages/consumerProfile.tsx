import React, { useState, ChangeEvent } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
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
} from "@material-ui/core";
import axios from "axios";
import { formatPhone } from "../utils/formatting";

const useStyles = makeStyles(() => ({
  button: {
    margin: "20px auto 20px auto",
  },
  textField: {
    margin: "20px auto 20px auto",
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
  const [email, setEmail] = useState("some@email.ca");
  const [phoneNumber, setPhoneNumber] = useState("(778)898-9898");
  const [postalCode, setPostalCode] = useState("");
  const [passDialogOpen, setPassDialogOpen] = useState(false);
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
    window.location.href = "/consumerEditProfile";
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
    setPasswordForm((prevState:any) => ({...prevState, [name]:value}));
  }

  const handleDeleteProfile = () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) {
      return;
    }
    axios
      .delete("/deleteCustomer", axiosConfig)
      .then(() => {
        window.location.href = "/";
        window.alert("Your account has been deleted");
      })
      .catch((err: any) => {
        window.alert("Connection error");
        console.log(err);
      });
  };

  const handlePasswordSubmit = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    const packet = {
      // oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      newPasswordConfirm: passwordForm.newPasswordConfirm
    }
    axios.post('/changePassword', packet, axiosConfig)
    .then(() => {
      window.alert("Password successfully changed")
      setPassDialogOpen(false);
    })
    .catch((err: any) => {
      window.alert("Connection error");
      console.log(err);
    });
  }

  axios.get("/customerInfo", axiosConfig)
    .then((data: any) => {
      setEmail(data.email);
      setPhoneNumber(formatPhone(data.phoneNumber));
      setPostalCode(data.postalCode);
    })
    .catch((err: any) => {
      window.alert("Connection error");
      console.log(err);
    });
  return (
    <>
      <Header Nav={ConsumerNav} />
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
      <Dialog open={passDialogOpen} onClose={handlePassChangeCancel}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
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
          type="password"
            color="secondary"
            id="newPassText"
            label="New password"
            name="newPassword"
            onChange={handlePassFormChange}
            value={passwordForm.newPassword}
            className={classes.textField}
            helperText={passwordForm.errors.newPassword}
            error={passwordForm.errors.newPassword ? true : false}
          />
          <TextField
          type="password"
            color="secondary"
            id="newPassConfirm"
            label="Cornfirm new password"
            name="newPasswordConfirm"
            onChange={handlePassFormChange}
            value={passwordForm.newPasswordConfirm}
            className={classes.textField}
            helperText={passwordForm.errors.newPasswordConfirm}
            error={passwordForm.errors.newPasswordConfirm ? true : false}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handlePassChangeCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
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
