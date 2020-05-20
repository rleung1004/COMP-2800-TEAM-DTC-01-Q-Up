import React from 'react';
import { TextField, Button, Box } from '@material-ui/core';

export default function boothEnterName(props: any) {
   return (
      <>
         <Box pt={20}>
            <TextField
               color='secondary'
               id='phone'
               label='Enter Your name'
               name='name'
            />
         </Box>
         <br />
         <Box pb={20}>
            <Button
               color='primary'
               variant='contained'
               onClick={props.enterQueue}
            >
               Queue Up
            </Button>
         </Box>
      </>
   );
}
