import React, { useState, ChangeEvent, useEffect } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import BusinessNav from "../components/businessNav";
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
import "../styles/businessProfile.scss";

const useStyles = makeStyles(() => ({
  button: {
    margin: "20px auto 20px auto",
  },
  textField: {
    margin: "20px auto 20px auto",
  },
}));

export default function BusinessProfilePage() {
  interface errors {
    // oldPassword?: string,
    newPassword?: string;
    newPasswordConfirm?: string;
  }
  const errorObj: errors = {};
  const classes = useStyles();
  const [formState, setFormState] = useState({
    name: "",
    category: "",
    description: "",
    email: "",
    hours: {
      startTime: [
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
      ],
      endTime: ["00:01", "00:01", "00:01", "00:01", "00:01", "00:01", "00:01"],
    },
    address: {
      unit: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
    },
    phoneNumber: "",
    website: "",
    averageWaitTime: "",
    loading: true,
  });
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

  const handleEditProfile = () => {
    window.location.href = "/editBusinessProfile";
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
    if (!window.confirm("Are you sure? This cannot be undone.")) {
      return;
    }
    axios
      .delete("/deleteBusiness", axiosConfig)
      .then(() => {
        window.location.href = "/";
        window.alert("Your business has been deleted");
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
        window.alert("Connection error");
        console.log(err);
      });
  };

  const compileAddress = () => {
    const {
      unit,
      streetAddress,
      city,
      province,
      postalCode,
    } = formState.address;
    return `${
      unit ? unit : ""
    } ${streetAddress},\n ${city}, ${province}\n ${postalCode}`;
  };

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getBusiness", axiosConfig)
      .then((res: any) => {
        const data = res.data.businessData;
        console.log(data);
        setFormState({
          name: data.name,
          category: data.category,
          description: data.description,
          email: data.email,
          hours: data.hours,
          address: data.address,
          phoneNumber: data.phoneNumber,
          website: data.website,
          averageWaitTime: data.averageWaitTime,
          loading: false,
        });
      })
      .catch((err: any) => {
        window.alert("Connection error");
        console.log(err);
      });
  }, [axiosConfig, errorObj, getData]);

  const sectionSpacing = 3;
  return (
    <>
      <Header Nav={BusinessNav} logout />
      <main>
        <section>
          <Typography variant="h2">{formState.name}</Typography>
        </section>
        <section>
          <Grid container justify="center">
            <Grid container item xs={12} md={8} lg={6} justify="space-around">
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
          </Grid>
        </section>
        <br />
        <section>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography variant="body1">Description</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">{formState.description}</Typography>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container direction="column" alignItems="center">
            <Typography variant="h3">Hours</Typography>
            <Grid
              container
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              spacing={sectionSpacing}
            >
              <Grid item xs={12}>
                <Typography variant="h4" align="center">
                  Weekdays
                </Typography>{" "}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="textLeft">
                  Open
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="textRight">
                  {formState.hours.startTime[1]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="textLeft">
                  Close
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="textRight">
                  {formState.hours.endTime[1]}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" align="center">
                  Weekend
                </Typography>{" "}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="textLeft">
                  Open
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="textRight">
                  {formState.hours.startTime[0]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="textLeft">
                  Close
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="textRight">
                  {formState.hours.endTime[0]}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container direction="column" alignItems="center">
            <Grid
              container
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              spacing={sectionSpacing}
            >
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" className="textLeft">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" className="textRight">
                  {formState.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" className="textLeft">
                  Phone number
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" className="textRight">
                  {formatPhone(formState.phoneNumber)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" className="textLeft">
                  Website
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" className="textRight">
                  {formState.website}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container direction="column" alignItems="center">
            <Grid
              container
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              spacing={sectionSpacing}
            >
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="textLeft">
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="textRight">
                  {compileAddress()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <section>
          <Grid container direction="column" alignItems="center">
            <Grid
              container
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              spacing={sectionSpacing}
            >
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="textLeft">
                  Business category
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" className="textRight">
                  {formState.category}
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
              error={passwordForm.errors.newPassword ? true : false}
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
              error={passwordForm.errors.newPasswordConfirm ? true : false}
            />
          </Grid>
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
