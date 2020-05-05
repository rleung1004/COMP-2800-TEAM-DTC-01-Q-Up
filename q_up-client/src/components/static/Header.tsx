import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../../styles/staticHeader.scss'

export default function Header(props: any) {
    const Navbar = props.Nav? props.Nav: null;
    return (
    <header style={{backgroundColor: "#242323"}}>
        <Grid container alignItems="center">
            <Grid item xs={2}>
                <h1>QUP</h1>
            </Grid>
            <Grid item container xs={8} justify="center">
                <img src={require("../../img/temp_logo_png.png")} alt="QUP logo"/>
            </Grid>
        </Grid>
        {Navbar}
    </header>);
}