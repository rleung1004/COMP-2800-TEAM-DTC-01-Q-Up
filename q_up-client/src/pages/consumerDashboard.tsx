import React from 'react';
import Footer from '../components/static/Footer';
import Header from '../components/static/Header';
import { makeStyles } from '@material-ui/core/styles';
import ConsumerNav from '../components/consumerNav';
import { Button, Grid, Typography } from '@material-ui/core';
import CurrentQueueInfo from '../components/currentQueueInfo';
import QueueList from '../components/queueList';
import { mockFavs, mockQueues } from '../mockData';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   button: {
      margin: '20px auto 20px auto',
   },
}));

export default function ClientDashboardPage() {
   const classes = useStyles();

   const noQueue = (
      <Grid container justify='center' alignItems='center'>
         <Typography variant='h2'>Not currently queued</Typography>
      </Grid>
   );

   return (
      <>
         <Header Nav={ConsumerNav} />
         <main>
            <section>{true ? <CurrentQueueInfo /> : noQueue}</section>
            <section>
               <Grid container direction='column'>
                  <Button
                     type='submit'
                     variant='contained'
                     color='primary'
                     className={classes.button}
                  >
                     Abandon Queue
                  </Button>
                  <Button
                     type='submit'
                     variant='contained'
                     color='primary'
                     className={classes.button}
                  >
                     Search Queues
                  </Button>
               </Grid>
            </section>
            <section>
               <ExpansionPanel>
                  <ExpansionPanelSummary
                     aria-controls='panel1a-content'
                     expandIcon={<ExpandMoreIcon />}
                  >
                     <Typography>Favorite queues</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                     <div>
                        <QueueList dataList={mockQueues()} favs={mockFavs()} />
                     </div>
                  </ExpansionPanelDetails>
               </ExpansionPanel>
            </section>
         </main>
         <Footer />
      </>
   );
}
