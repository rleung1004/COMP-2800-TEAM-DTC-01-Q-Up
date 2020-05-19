import React from "react";
import Grid from "@material-ui/core/Grid";
import "../../styles/staticHeader.scss";
import axios from "axios";
import { IconButton, makeStyles } from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles(() => ({
  root: {
    color: "#FFF",
  },
}));

export default function Header(props: any) {
  const classes = useStyles();
  
  const onLogoutHandler = () => {
    const userType = JSON.parse(sessionStorage.user).type;
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
    };
    if (userType === "employee") {
      axios.get("/logout", axiosConfig)
      .catch((err) => {
        console.error(err);
        window.alert("Connection error, please try again");
        return;
      })
    }
    sessionStorage.removeItem("user");
    window.location.href = "/";
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
      <Grid container justify="center">
        <Grid item container alignItems="center" xs={12} sm={10} md={8}>
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
      </Grid>
    </header>
  );
}
