import React from "react";
import "../../styles/staticFooter.scss";
import { Grid } from "@material-ui/core";

export default function Footer() {
  return (
    <footer>
      <Grid container justify="center" alignItems="center" className="foot-container">
        <Grid item container direction="column" id="foot-content-grid">
            <Grid item container>
                <Grid item xs={3}><img src={require('../../img/twit.svg')}/></Grid>
                <Grid item xs={3}><img src={require('../../img/face.svg')}/></Grid>
                <Grid item xs={3}><img src={require('../../img/insta.png')}/></Grid>
                <Grid item xs={3}><img src={require('../../img/youtube.svg')}/></Grid>
            </Grid>
            <Grid item><hr/></Grid>
            <Grid item>
                <p>ABOUT US</p>
            </Grid>
            <Grid item><hr/></Grid>
            <Grid item>
                <p>CONTACT US</p>
            </Grid>
            <Grid item><hr/></Grid>
            <Grid item container justify="space-around" id="priv-terms-container">
                <Grid item xs={3}><p>PRIVACY</p></Grid>
                <Grid item xs={3}><p>TERMS OF USE</p></Grid>
            </Grid>
        </Grid>
      </Grid>
    </footer>
  );
}
