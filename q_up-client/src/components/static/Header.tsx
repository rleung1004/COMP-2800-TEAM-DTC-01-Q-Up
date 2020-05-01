import React from 'react';
import Grid from '@material-ui/core/Grid';

export default function Header() {
   
    return (
    <header style={{backgroundColor: "#242323"}}>
        <Grid container>
            <Grid item xs={2}>
                <h1>QUP</h1>
            </Grid>
            <Grid item xs={8} justify="center">
                <img src={require("../../img/temp_logo_png.png")}/>
            </Grid>
        </Grid>
    </header>);
}