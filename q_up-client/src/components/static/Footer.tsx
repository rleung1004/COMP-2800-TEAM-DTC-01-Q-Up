import React from "react";
import { Link } from "react-router-dom";
import "../../styles/staticFooter.scss";
import { Grid} from "@material-ui/core";
import CopyrightIcon from '@material-ui/icons/Copyright';

export default function Footer() {
  return (
    <footer>
      <Grid container justify="center" alignItems="center" className="foot-container">
        <Grid item container direction="column" id="foot-content-grid">
            <Grid item container>
                <Grid item xs={3}><img src={require('../../img/twit.svg')} alt="Twitter logo"/></Grid>
                <Grid item xs={3}><img src={require('../../img/face.svg')} alt="Facebook logo"/></Grid>
                <Grid item xs={3}><img src={require('../../img/insta.png')} alt="Instagram logo"/></Grid>
                <Grid item xs={3}><img src={require('../../img/youtube.svg')} alt="Youtube logo"/></Grid>
            </Grid>
            <Grid item><hr/></Grid>
            <Grid item>
                <Link to='/aboutUs' style={{textDecoration: 'none'}}>
                    <p>ABOUT US</p>
                </Link>
            </Grid>
            <Grid item><hr/></Grid>
            <Grid item>
                <p>CONTACT US</p>
            </Grid>
            <Grid item><hr/></Grid>
            <Grid item container justify="space-around" id="priv-terms-container">
                <Grid item xs={4}><p>PRIVACY</p></Grid>
                <Grid item xs={4}><p>TERMS</p></Grid>
            </Grid>
            <Grid item id="copyright-row"><p><CopyrightIcon fontSize="small"/> All rights reserved. Q-UP. 2020</p></Grid>
        </Grid>
      </Grid>
    
    </footer>
  );
}
