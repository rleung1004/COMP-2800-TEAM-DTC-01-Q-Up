import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import { Link } from 'react-router-dom';
// import QueueListRow from "../components/queueListRow";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  InfiniteHits,
  SearchBox,
  // Pagination,
  // ClearRefinements,
  // RefinementList,
  // Configure,
} from "react-instantsearch-dom";
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import ConsumerNav from "../components/consumerNav";
// import { Typography } from "@material-ui/core";
// import PropTypes from "prop-types";
import QueueListRow from "src/components/queueListRow";
import "../styles/queueSearch.scss";
import axios from "axios";

export default function QueueSearchPage() {
  const [getData, setGetData] = useState(true);
  const listNames: Array<string> = [];
  const [favQueues, setFavQueues] = useState(listNames);
  const searchClient = algoliasearch(
    "EU7O4R6VOS",
    "86a00161b4b0e5a68907e099e5962273"
  );
  const [expandedPanel, setExpanded] = useState("panel");
  const handleChange = (panel: string) => (event: any, isExpanded: boolean) => {
    if (event.target.name === "fav") {
      return;
    }
    setExpanded(isExpanded ? panel : "panel");
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  const triggerGetStatus = () => {
    setGetData(true);
  };

  const isFav = (hitName: string) => {
    return favQueues.includes(hitName);
  };

  const Hit = (data: any) => {    
    const hitData = {
      ...data.hit,
      triggerGetStatus,
      isFav: isFav(data.hit.name),
    };
    return <QueueListRow hit={hitData} 
    handleChange={handleChange("panel" + hitData.__position )}
    isExpanded={expandedPanel === "panel" + hitData.__position}
    />;
  };

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    axios
      .get("/getFavouriteQueues", axiosConfig)
      .then((res) => {
        console.log("please dont");
        const businesses = res.data.favoriteBusinesses;
        const names: Array<string> = [];
        for (const business in businesses) {
          names.push(businesses[business].name);
        }
        setFavQueues(names);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 404) {
          return;
        }
        window.alert("Connection error: Could not load your favourite queues.");
      });
  }, [axiosConfig, getData]);
  return (
    <>
      <Header Nav={ConsumerNav} logout />
      <main>
        <div className="InstantSearch">
          <InstantSearch indexName="businesses" searchClient={searchClient}>
            <SearchBox
              translations={{
                placeholder: "Search for a queue",
              }}
            />
            <section id="results">
              <InfiniteHits hitComponent={Hit} transformItems={isFav} />
            </section>
          </InstantSearch>
        </div>
      </main>
      <Footer />
    </>
  );
}
