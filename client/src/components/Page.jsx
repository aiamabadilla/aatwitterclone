import React from "react";
import { useParams } from "react-router";

import Sidebar from "./pages/Sidebar";
import Widgets from "./pages/Widgets/Widgets";
import Header from "./pages/Header";

import "../styles/Page.css";

const Page = ({ Body, Page, header }) => {
  const { username, tweetid } = useParams();

  if (username && !tweetid) {
    header = username;
  }

  return (
    <div className="page">
      {Body ? (
        <div className="page__content">
          <Sidebar />
          <div className="page__body">
            <Header header={header} />
            <Body />
          </div>
          <Widgets />
        </div>
      ) : (
        <div className="page__content">
          <Page />
        </div>
      )}
    </div>
  );
};

export default Page;
