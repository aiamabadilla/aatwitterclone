import React, { useContext } from "react";

import { Redirect } from "react-router-dom";

import { UserContext } from "../../AppRouter";

import "../../../styles/pages/body/Messages.css";

const Messages = () => {
  const [user] = useContext(UserContext);
  if (!user.accesstoken) return <Redirect to="/u/login" />;
  return <div className="messages"></div>;
};

export default Messages;
