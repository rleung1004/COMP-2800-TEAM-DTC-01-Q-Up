import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";
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
import "../styles/consumerProfile.scss";
import { withRouter } from "react-router-dom";
import app from "../firebase";

// Mui stylings
const useStyles = makeStyles(() => ({
  button: {
    margin: "20px auto 20px auto",
  },
  textField: {
    margin: "20px auto 20px auto",
  },
}));

/**
 * Render a customer profile page.
 *
 * Accessible to: customers
 */
const ConsumerProfilePage = ({ history }: any) => {
  // error type definition to be used in input feedback for password form
  interface errors {
    // oldPassword?: string,
    newPassword?: string;
    newPasswordConfirm?: string;
  }
  const errorObj: errors = {};
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
    errors: errorObj,
  });

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  // handle edit profile button click
  const handleEditProfile = useCallback(() => {
    history.push("/editConsumerProfile");
  }, [history]);

  // handle password change button click
  const handlePasswordChangeButtonClick = () => {
    setPassDialogOpen(true);
  };

  // handle password form close or cancel click
  const handlePassChangeCancel = () => {
    setPassDialogOpen(false);
  };

  // sync password form inputs with password form data
  const handlePassFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setPasswordForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  // handle profile delete button click
  const handleDeleteProfile = () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) {
      return;
    }
    axios
      .delete("/deleteCustomer", axiosConfig)
      .then(async () => {
        await app.auth().signOut();
        window.alert("Your account has been deleted");
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        }
        window.alert("Connection error");
      });
  };

  // handle password form submit
  const handlePasswordSubmit = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    const packet = {
      // oldPassword: passwordForm.oldPassword,
      password: passwordForm.newPassword,
      confirmPassword: passwordForm.newPasswordConfirm,
    };
    axios
      .put("/changePassword", packet, axiosConfig)
      .then((res) => {
        console.log(res.data);

        window.alert("Password successfully changed");
        setPassDialogOpen(false);
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        }
        window.alert("Connection error");
      });
  };

  // fetch customer data
  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getCustomer", axiosConfig)
      .then((res: any) => {
        const data = res.data.customerData;
        console.log(data);
        setEmail(data.email);
        setPhoneNumber(
          data.phoneNumber ? formatPhone(data.phoneNumber) : "N/A"
        );
        setPostalCode(data.postalCode ? data.postalCode : "N/A");
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        }
        window.alert("Connection error");
      });
  }, [axiosConfig, errorObj, getData]);

  return (
    <>
      <Header Nav={ConsumerNav} logout />
      <main>
        <section>
          <Grid container justify="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
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
                    onClick={handlePasswordChangeButtonClick}
                  >
                    Change password
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container justify="center">
            <Grid container item justify="center" xs={12} sm={8} md={6} lg={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="profileTextLeft">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="profileTextRight">
                  {email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="profileTextLeft">
                  Phone number
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="profileTextRight">
                  {phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="profileTextLeft">
                  Postal code
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="profileTextRight">
                  {postalCode}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </section>
      </main>
      <Dialog
        open={passDialogOpen}
        onClose={handlePassChangeCancel}
        PaperProps={{ style: { backgroundColor: "#242323" } }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container direction="column">
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
              error={!!passwordForm.errors.newPassword}
            />
            <TextField
              type="password"
              color="secondary"
              id="newPassConfirm"
              label="Cornfirm password"
              name="newPasswordConfirm"
              onChange={handlePassFormChange}
              value={passwordForm.newPasswordConfirm}
              className={classes.textField}
              helperText={passwordForm.errors.newPasswordConfirm}
              error={!!passwordForm.errors.newPasswordConfirm}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justify="center" spacing={1}>
            <Grid container item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handlePassChangeCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid container item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handlePasswordSubmit}
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
};

export default withRouter(ConsumerProfilePage);
