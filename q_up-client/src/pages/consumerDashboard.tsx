import React from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
import FavQueueListRow from "src/components/favQueueListRow";
import { mockFavQueues } from "src/mockData";

export default function ClientDashboardPage() {
  const data = mockFavQueues();
  
  return (
    <>
      <Header Nav={ConsumerNav} />
      <main>
          {data.map((q, key) => <FavQueueListRow key={key} data={q}/>)}
      </main>
      <Footer />
    </>
  );
}
