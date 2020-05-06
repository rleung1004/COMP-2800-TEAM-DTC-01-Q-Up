import React from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";

export default function ConsumerProfilePage() {
  return (
    <>
      <Header Nav={ConsumerNav} />
      <main>consumer profile page</main>
      <Footer />
    </>
  );
}
