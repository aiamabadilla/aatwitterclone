import React, { useContext } from "react";

import { Redirect } from "react-router-dom";

import { UserContext } from "../../AppRouter";

import "../../../styles/pages/body/Lists.css";

const Lists = () => {
  const [user] = useContext(UserContext);
  if (!user.accesstoken) return <Redirect to="/u/login" />;
  return <div className="lists"></div>;
};

export default Lists;
