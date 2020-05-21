import React from "react";
import Grid from "@material-ui/core/Grid";
import "../styles/staticHeader.scss";
import axios from "axios";
import app from "../firebase";
import { IconButton, makeStyles } from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles(() => ({
  root: {
    color: "#FFF",
  },
}));

/**
 * Render a header.
 *
 * @param props.logout a boolean. If true, will display a logout button
 * @param props.nav OPTIONAL a React Component. A hamburger menu to be displayed
 *
 * Accessible to: all users
 */
export default function Header(props: any) {
  const classes = useStyles();

  /**
   * Handle logging out.
   *
   * Redirects to Landing page upon success.
   * 
   * Only employees are required to send a request to server. Else, just delete the token.
   */
  const onLogoutHandler = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    const userType = JSON.parse(sessionStorage.user).type;
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
    };
    if (userType === "employee") {
      axios
        .get("/logout", axiosConfig)
        .then(async () => {
          sessionStorage.removeItem("user");
          return await app.auth().signOut();
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            window.location.href = '/login';
            return;
          }
          window.alert("Connection error, please try again");
          return;
        });
    } else {
      sessionStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  // Handle the possiblity not to have a nav element
  const Navbar = props.Nav ? props.Nav : () => <></>;

  // conditionally render a logout button
  const Logout = props.logout ? (
    <IconButton onClick={onLogoutHandler} classes={classes}>
      <PowerSettingsNewIcon />
    </IconButton>
  ) : (
    <> </>
  );

  return (
    <header style={{ backgroundColor: "#242323" }}>
      <Grid container justify="center">
        <Grid item container alignItems="center" xs={12} sm={10} md={8}>
          <Grid item xs={2}>
            {Logout}
          </Grid>
          <Grid item container xs={8} justify="center">
            <img src={require("../img/logo.png")} alt="QUP logo" />
          </Grid>
          <Grid item xs={2}>
            <Navbar />
          </Grid>
        </Grid>
      </Grid>
    </header>
  );
}
