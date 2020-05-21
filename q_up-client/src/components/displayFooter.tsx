import React from 'react';
import { Grid, Typography } from '@material-ui/core';

const DisplayFooter = () => {
   return (
      <footer style={{ backgroundColor: '#242323' }}>
         <Grid>
            <Typography variant='h2'>
               Please present your number to our service staff.
            </Typography>
         </Grid>
      </footer>
   );
};

export default DisplayFooter;
