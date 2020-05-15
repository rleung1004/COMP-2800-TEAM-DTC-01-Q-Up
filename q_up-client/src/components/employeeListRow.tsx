import React from 'react';
import {
   ExpansionPanel,
   Grid,
   Typography,
   IconButton,
   makeStyles,
   createStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles(() =>
   createStyles({
      margin: {
         marginTop: '10px',
      },
   })
);

export default function EmplyeeListRow() {
   const classes = useStyles();

   return (
      <section>
         <ExpansionPanel>
            <Grid container justify='flex-start' alignItems='flex-start'>
               <Grid item xs={3}>
                  <Typography className={classes.margin}>Employee1</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.margin}>Password</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.margin}>Online</Typography>
               </Grid>
               <Grid item xs={3}>
                  <IconButton aria-label='edit'>
                     <EditIcon fontSize='small' />
                  </IconButton>
                  <IconButton aria-label='delete'>
                     <DeleteForeverIcon fontSize='small' />
                  </IconButton>
               </Grid>
            </Grid>
         </ExpansionPanel>
      </section>
   );
}
