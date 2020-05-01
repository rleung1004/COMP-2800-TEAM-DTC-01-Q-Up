import React from 'react';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

export default function Header() {
   
    return (
    <header style={{backgroundColor: "gray"}}>
        <Grid container justify="space-between" >
        <h1>QUP</h1>
        <img src={require("../../img/temp_logo_png.png")} style={{height: 100, width: 100}} />
        </Grid>
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
        </nav>
    </header>);
}