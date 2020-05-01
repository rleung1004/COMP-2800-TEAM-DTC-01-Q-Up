import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/static/Header";
import Footer from "src/components/static/Footer";
import "../styles/landing.scss";
import { Grid, Button } from "@material-ui/core";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Grid
          container
          justify="center"
          alignItems="center"
          className="top-pic-section"
        >
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <Link to="/login">
                <Button variant="contained" className="btn">
                  Login
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup">
                <Button variant="contained" className="btn">
                  Signup
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </main>
      <section id="iframe-container">
        <iframe
          id="pitch-video"
          frameBorder="0"
          src="https://www.youtube.com/embed/zUbBq3o2b2g"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </section>
      <Footer />
    </>
  );
}
