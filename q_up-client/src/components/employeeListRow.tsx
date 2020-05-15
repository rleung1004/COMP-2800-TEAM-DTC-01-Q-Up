import React from 'react';
import {
   Grid,
   Typography,
   Box,
} from '@material-ui/core';

export default function EmpolyeeListRow(props:any) {
   const data = props.data;
   const colorClass = props.isSelected
    ? "queueSlotBox selected"
    : "queueSlotBox notSelected";
    const onClickHandler = () => {
    props.selectHandler()
   };
   return (
      <section>
         <Box className={colorClass} onClick={onClickHandler}>
            <Grid container justify='flex-start' alignItems='flex-start'>
               <Grid item xs={3}>
                  <Typography variant="body1">{data.email}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography variant="body1">{data.isOnline}</Typography>
               </Grid>
            </Grid>
         </Box>
      </section>
   );
}
