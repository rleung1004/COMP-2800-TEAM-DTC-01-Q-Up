import React from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import BusinessNav from "../components/businessNav";

export default function EmployeeManagementPage() {
  return (
    <>
      <Header Nav={BusinessNav} />
      <main>business dashboard</main>
      <Footer />
    </>
  );
}
