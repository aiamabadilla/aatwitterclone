import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../AppRouter";

import "../../styles/pages/SidebarLink.css";

const SidebarLink = ({ LINK, active, handleActiveLink }) => {
  const [user] = useContext(UserContext);

  if (!user.accesstoken && localStorage.getItem("active") !== "Explore") {
    LINK.to = "/u/login";
  }

  return (
    <Link
      to={LINK.to}
      className="sidebarlink"
      onClick={() => handleActiveLink(LINK.active)}
    >
      {active === LINK.active ? LINK.Active : LINK.Inactive}
    </Link>
  );
};

export default SidebarLink;
