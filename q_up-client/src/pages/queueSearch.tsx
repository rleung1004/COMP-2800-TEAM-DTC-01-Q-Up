import React, { useState, useEffect } from "react";

import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  InfiniteHits,
  SearchBox,
} from "react-instantsearch-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ConsumerNav from "../components/consumerNav";
import QueueListRow from "src/components/queueListRow";
import "../styles/queueSearch.scss";
import axios from "axios";
import Grid from "@material-ui/core/Grid/Grid";
import { Paper } from "@material-ui/core";

/**
 * Render a queue search page.
 * 
 * Accessible to: customer.
 */
export default function QueueSearchPage() {
  // fetch flag
  const [getData, setGetData] = useState(true);
  const listNames: Array<string> = [];
  // fav queue names
  const [favQueues, setFavQueues] = useState(listNames);

  // algolia config
  const searchClient = algoliasearch(
    "EU7O4R6VOS",
    "86a00161b4b0e5a68907e099e5962273"
  );

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  /**
   * Return a function that sets the fetch flag to true.
   * It is passed to each queue result. 
   */ 
  const triggerGetStatus = () => {
    setGetData(true);
  };

  /**
   * Evaluate if a given queue is a favorite of the current user.
   * 
   */ 
  const isFav = (hitName: string) => {
    return favQueues.includes(hitName);
  };

  /**
   * Render one row of search results.
   * @param data an object, represents one row of search results
   */
  const Hit = (data: any) => {
    const hitData = {
      ...data.hit,
      triggerGetStatus,
      isFav: isFav(data.hit.name),
    };
    return <QueueListRow hit={hitData} />;
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
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          window.location.href = '/login';
          return;
        }
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
              <Grid container justify="center">
                <Grid container item xs={12} md={10} lg={8} justify="center">
                  <Paper className="searchPaper">
                      <InfiniteHits hitComponent={Hit} transformItems={isFav} />
                  </Paper>
                </Grid>
              </Grid>
            </section>
          </InstantSearch>
        </div>
      </main>
      <Footer />
    </>
  );
}
