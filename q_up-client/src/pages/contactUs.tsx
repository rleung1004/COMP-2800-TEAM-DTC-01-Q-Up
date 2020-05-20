import StaticNav from "src/components/staticNav";
import Axios from "axios";
import React from "react";
import Header from "src/components/Header";
import Typography from "@material-ui/core/Typography";
import Footer from "src/components/Footer";
import Paper from "@material-ui/core/Paper";

/**
 * Render a contact us page.
 * 
 * Accessible to: all users.
 */
export default function ContactUsPage() {
  const onclick = () => {
    Axios.get('/getOAuthToken')
    .then((res:any) => {
      window.location.href = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + res.data.oauthToken;
    })
    .catch(console.log);
  };
  return (
    <>
      <Header Nav={StaticNav} />
      <main>
        <header>
          <Typography variant="h1">Contact Us</Typography>
        </header>
        <button onClick={onclick}>twit</button>
        <section>
          <Paper>
             <div className="fb-comments" data-href="https://www.facebook.com/teamkart.bcit.7" data-numposts="5" data-width=""></div>
          </Paper>
        </section>
      </main>
      <Footer />
    </>
  );
}
