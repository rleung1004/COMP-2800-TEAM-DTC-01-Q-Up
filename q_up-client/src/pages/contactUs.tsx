import * as React from "react";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import StaticNav from "src/components/staticNav";
import { Typography } from "@material-ui/core";

/**
 * Render a contact us page.
 * 
 * Accessible to: all users.
 */
export default function ContactUsPage() {
  return (
    <>
      <Header Nav={StaticNav} />
      <main>
        <header>
          <Typography variant="h1">Contact Us</Typography>
        </header>
        
        <section>
        <div className="fb-comments" data-href="https://www.facebook.com/teamkart.bcit.7" data-numposts="5" data-width=""/>
        </section>
      </main>
      <Footer />
    </>
  );
}
