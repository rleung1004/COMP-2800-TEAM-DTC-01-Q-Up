import React from "react";
import Grid from "@material-ui/core/Grid";
import "../../styles/staticHeader.scss";
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
      <Grid container alignItems="center">
        <Grid item xs={2}>
          {Logout}
        </Grid>
        <Grid item container xs={8} justify="center">
          <img src={require("../../img/logo.png")} alt="QUP logo" />
<<<<<<< HEAD
        </Grid>
        <Grid item xs={2}>
          <Navbar />
=======
>>>>>>> 8be47739136c95c4345ba5ed3751b54854adae79
        </Grid>
      </Grid>
    </header>
  );
}
