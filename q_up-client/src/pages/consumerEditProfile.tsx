import React from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";

export default function ConsumerEditProfilePage() {
  return (
    <>
      <Header Nav={ConsumerNav} />
      <main>consumer edit profile page</main>
      <Footer />
    </>
  );
}
