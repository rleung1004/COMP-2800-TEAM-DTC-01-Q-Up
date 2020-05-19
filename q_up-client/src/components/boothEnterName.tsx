import React from 'react';
import { TextField, Button, Box } from '@material-ui/core';

export default function boothEnterName() {
   return (
      <>
         <Box mt={20}>
            <TextField
               color='secondary'
               id='phone'
               label='Enter Your name'
               name='name'
            />
         </Box>
         <br />
         <Box mb={20}>
            <Button>Queue Up</Button>
         </Box>
      </>
   );
}
