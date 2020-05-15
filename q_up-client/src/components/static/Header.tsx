import React from "react";
import Grid from "@material-ui/core/Grid";
import "../../styles/staticHeader.scss";
import { IconButton, makeStyles } from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import axios from "axios";

const useStyles = makeStyles(() => ({
  root: {
    color: "#FFF",
  },
}));

export default function Header(props: any) {
  const classes = useStyles();
  const onLogoutHandler = () => {
    axios
      .get("/logout")
      .then(() => {
        window.location.href = "/";
      })
      .catch((err: any) => {
        console.log(err);
        window.alert("Could not logout, failed connection");
      });
  };
  const Navbar = props.Nav ? props.Nav : () => <></>;
  const Logout = props.logout ? (
    <IconButton onClick={onLogoutHandler} classes={classes}>
      <PowerSettingsNewIcon />
    </IconButton>
  ) : (
    <> </>
  );

  return (
    <header style={{ backgroundColor: "#242323" }}>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          {Logout}
        </Grid>
        <Grid item container xs={8} justify="center">
          <img src={require("../../img/logo.png")} alt="QUP logo" />
        </Grid>
        <Grid item xs={2}>
          <Navbar />
        </Grid>
      </Grid>
    </header>
  );
}
