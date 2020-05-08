import React from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
import QueueList from "src/components/queueList";
import { mockFavQueues } from "src/mockData";

export default function ClientDashboardPage() {
  
  return (
    <>
      <Header Nav={ConsumerNav} />
      <main>
        <QueueList dataList={mockFavQueues()}/>
      </main>
      <Footer />
    </>
  );
}
