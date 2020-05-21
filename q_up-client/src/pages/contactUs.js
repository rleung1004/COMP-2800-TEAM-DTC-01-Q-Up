/*jshint esversion: 6 */
import StaticNav from "src/components/staticNav";
import React, { useState } from "react";
import Header from "src/components/Header";
import Typography from "@material-ui/core/Typography";
import Footer from "src/components/Footer";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { ReactComponent as Twitter } from "../img/Twitter_Social_Icon_Rounded_Square_Color.svg";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { formatURL } from "../utils/formatting";
import "../styles/contactUs.scss";
import makeStyles from "@material-ui/core/styles/makeStyles";

//Mui styling
const useStyles = makeStyles({
  darkPaper: {
    backgroundColor: "rgba(29,161,242, 0.7)",
    padding: "0rem 1rem 1.5rem",
    width: '100%'
  },
  sidePadedPaper: {
    padding: "2rem 1rem",
  },
  socialGrid: {
    padding: '1rem 0rem 1rem'
  },
  fbPaper: {
    maxWidth: '331px',
    padding: '2rem 1rem'
  },
  TextField: {
    width: '100%'
  }
});

// default hashtags for tweet button
const hashes = "#TalkToQUp";

// reference to insert by default into tweet button
const homePage = "https://q-up-c2b70.web.app/";


/**
 * Render a contact us page.
 *
 * Accessible to: all users.
 */
export default function ContactUsPage() {
  const classes = useStyles();

  // manage twitter input
  const [twitterText, setTwitterText] = useState("");
  const onTwitTextChange = (event) => {
    const value = event.target.value;
    if (value.length > 280) {
      return;
    }
    setTwitterText(event.target.value);
  };

  // create tweeter button url
  const prepTweeterURL = () => {
    return `
    https://twitter.com/intent/tweet?hashtags=${formatURL(
      hashes
    )}&original_referer=${formatURL(
      window.location.toString()
    )}&ref_src=twsrc%5Etfw&text=${formatURL(
      twitterText
    )}&tw_p=tweetbutton&url=${homePage
    }&via=${formatURL('QueueQup')}`;
  };

  // tweeter button click handler
  const tweet = () => {
    window.open(prepTweeterURL());
  };

  return (
    <>
      <Header Nav={StaticNav} />
      <main>
        <header>
          <Typography variant="h2">Contact Us</Typography>
        </header>
          <Grid container justify="center">
            <br/>
            <Grid container item xs={12} md={6} justify="center" className={classes.socialGrid}>
              <Paper className={classes.sidePadedPaper}>
                <header>
                  <Typography>On Twitter</Typography>
                </header>
                <Grid
                  container
                  item
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <TwitterTimelineEmbed
                    sourceType="url"
                    url="https://twitter.com/QueueQup?"
                    options={{ height: 400 }}
                  />
                  <Paper className={classes.darkPaper}>
                    <TextField
                      id="filled-multiline-static"
                      label="Send us a Tweet!"
                      multiline
                      rowsMax={4}
                      name="YourTweet"
                      value={twitterText}
                      onChange={onTwitTextChange}
                      className={classes.TextField}
                    />
                  </Paper>
                  <IconButton onClick={tweet}>
                    <SvgIcon
                      component={Twitter}
                      viewBox="0 0 400 400 "
                    ></SvgIcon>
                  </IconButton>
                </Grid>
              </Paper>
            </Grid>
            <br/>
            <Grid
              container
              item
              xs={12}
              md={6}
              justify="center"
              alignItems="center"
              className="fbContainer"
            >
              <Grid container item xs={11} md={20} className={classes.socialGrid} justify="center">
                <Paper className={classes.fbPaper}>
                  <header>
                    <Typography variant="body1">On Facebook</Typography>
                  </header>
                  <div
                    className="fb-comments"
                    data-href="https://www.facebook.com/teamkart.bcit.7"
                    data-numposts="5"
                    data-width="100%"
                  ></div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
      </main>
      <Footer />
    </>
  );
}
