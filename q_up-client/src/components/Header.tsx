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
  const onLogoutHandler = async () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    const userType = JSON.parse(sessionStorage.user).type;
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
    };
    await app.auth().signOut();
    if (userType === "employee") {
      axios
        .get("/logout", axiosConfig)
        .then(() => {
          sessionStorage.removeItem("user");
          return;
        })
        .catch((err) => {
          console.error(err);
          console.error(err);
          if (err.response.status && err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            app.auth().signOut().catch(console.error);
            return;
          }
          window.alert("Connection error, please try again");
          return;
        });
    } else {
      sessionStorage.removeItem("user");
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
