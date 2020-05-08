import React, { ChangeEvent, useState } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
// import axios from "axios";
// material-ui components
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  pageTitle: {
    margin: "20px auto 20px auto",
  },
  subHeading: {
    margin: "20px auto 20px auto",
  },
  switch: {},
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  mainSection: {
    color: "black",
    background: "white",
  },
}));

export default function BusinessDashboardPage() {
  const classes = useStyles();
  // interface IaxiosConfig {
  //   headers: {
  //     Authorization: string;
  //   };
  // }

  // const axiosConfig: IaxiosConfig = {
  //   headers: {
  //     Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
  //   },
  // };

  const [switchState, setSwitchState] = useState({
    queueSwitch: false,
  });

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSwitchState((prevState) => ({
      ...prevState,
      queueSwitch: event.target.checked,
    }));
  };

  return (
    <>
      <Header Nav={ConsumerNav} />
      <Grid container direction="column" alignItems="center" spacing={5}>
        <Grid item xs={12}>
          <Typography variant="h2" className={classes.pageTitle}>
            Business Name
          </Typography>
        </Grid>
        <Grid item xs={12} direction="row">
          <Grid
            container
            alignItems="center"
            justify="space-between"
            spacing={10}
          >
            <Grid item xs={6}>
              <Typography variant="h5" className={classes.subHeading}>
                Queue Status
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Switch
                checked={switchState.queueSwitch}
                onChange={handleSwitchChange}
                name="queueSwitch"
                inputProps={{ "aria-label": "secondary checkbox" }}
                className={classes.switch}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} direction="row">
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.mainSection}
          >
            <Grid item xs={6}>
              <Typography variant="h5">
                Current Size <br /> 20
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h5">
                Queue Duration <br /> 1h20m*
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  color="primary"
                >
                  <Typography className={classes.heading}>
                    Employee Status
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails color="secondary">
                  <Typography>
                    Employees Logged In <br /> 5
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              color="primary"
            >
              <Typography className={classes.heading}>
                Today's Analytics
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails color="secondary">
              <Typography>Under construction</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Footer />
      </Grid>
    </>
  );
}
