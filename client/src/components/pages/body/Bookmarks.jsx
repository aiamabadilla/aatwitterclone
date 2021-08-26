import React, { useContext } from "react";

import { Redirect } from "react-router-dom";

import { UserContext } from "../../AppRouter";

import "../../../styles/pages/body/Bookmarks.css";

const Bookmarks = () => {
  const [user] = useContext(UserContext);
  if (!user.accesstoken) return <Redirect to="/u/login" />;
  return <div className="bookmarks"></div>;
};

export default Bookmarks;
