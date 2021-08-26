import React, { useContext } from "react";

import { Redirect } from "react-router-dom";

import { UserContext } from "../../AppRouter";

import "../../../styles/pages/body/Notifications.css";

const Notifications = () => {
  const [user] = useContext(UserContext);
  if (!user.accesstoken) return <Redirect to="/u/login" />;
  return <div className="notifications"></div>;
};

export default Notifications;
