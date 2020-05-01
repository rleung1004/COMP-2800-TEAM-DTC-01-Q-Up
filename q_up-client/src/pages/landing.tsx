import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/static/Header";
import Footer from "src/components/static/Footer";
import "../styles/landing.scss";
import { Grid } from "@material-ui/core";

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
          <Grid item xs={12}>
            <header id="landing-header">
              <h2>No more queues with Q-UP</h2>
              <p>Queue from home on your favorite grocers, clinics and more!</p>
            </header>
          </Grid>

          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <Link to="/login">
                <button>Login</button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup">
                <button>Signup</button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </main>
      <section id="iframe-container">
        <iframe
          title="Pitch"
          frameBorder="0"
          id="pitch-video"
          src="https://www.youtube.com/embed/zUbBq3o2b2g"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </section>
        <section className="how-it-works-section">
           <h2>How it Works:</h2>
            <h3>As a customer:</h3>
               <ol >
                   <li>Sign up to our website</li>
                   <li>Find the store that you want to queue for and queue up for it</li>
                   <li>Go to the store when its your turn to enter</li>
               </ol>
            <h3>As a business:</h3>
            <ol>
                <li>Sign up to our website</li>
                <li>Set up your business profile</li>
                <li>Start your queue</li>
                <li>Let customers into your store</li>
            </ol>

        </section>
      <Footer />
    </>
  );
}
