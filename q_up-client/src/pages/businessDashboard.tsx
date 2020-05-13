import React, { ChangeEvent, useState } from 'react';
// import { Link } from 'react-router-dom';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import BusinessNav from '../components/businessNav';
// import axios from "axios";
// material-ui components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   pageTitle: {
      margin: '20px auto 20px auto',
      fontSize: '1.7rem',
   },
   subHeading: {
      margin: '20px auto 20px auto',
   },
   switch: {},
   heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
   },
   mainSection: {
      color: 'black',
      background: 'white',
      padding: '20px',
   },
   pageTitleContainer: {
      borderBottom: 'thin solid black',
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
         <Header Nav={BusinessNav} />
         <header className={classes.pageTitleContainer}>
            <Typography variant='h2' className={classes.pageTitle}>
               Business Name
            </Typography>
         </header>

         <Grid container alignItems='center' justify='space-around'>
            <Grid item xs={7}>
               <Typography
                  variant='subtitle1'
                  className={classes.subHeading}
                  align='center'
               >
                  Queue Status
               </Typography>
            </Grid>
            <Grid item xs={5}>
               <Switch
                  checked={switchState.queueSwitch}
                  onChange={handleSwitchChange}
                  name='queueSwitch'
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  className={classes.switch}
               />
            </Grid>
         </Grid>

         <Grid
            container
            justify='center'
            alignItems='center'
            className={classes.mainSection}
         >
            <Grid item xs={6}>
               <Typography variant='h5'>Current Size</Typography>
            </Grid>

            <Grid item xs={6}>
               <Typography variant='h5'>Queue Duration*</Typography>
            </Grid>

            <Grid item xs={6}>
               <Typography variant='h5'>
                  <b>20</b>
               </Typography>
            </Grid>

            <Grid item xs={6}>
               <Typography variant='h5'>
                  <b>1h20m</b>
               </Typography>
            </Grid>
         </Grid>

         <ExpansionPanel>
            <ExpansionPanelSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls='panel1a-content'
               id='panel1a-header'
               color='primary'
            >
               <Typography className={classes.heading}>
                  Employee Status
               </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails color='secondary'>
               <Typography>
                  Employees Logged In <br /> 5
               </Typography>
            </ExpansionPanelDetails>
         </ExpansionPanel>

         <ExpansionPanel>
            <ExpansionPanelSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls='panel1a-content'
               id='panel1a-header'
               color='primary'
            >
               <Typography className={classes.heading}>
                  Today's Analytics
               </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails color='secondary'>
               <Typography>Under construction</Typography>
            </ExpansionPanelDetails>
         </ExpansionPanel>

         <Footer />
      </>
   );
}
