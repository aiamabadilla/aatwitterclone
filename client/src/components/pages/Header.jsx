import React from "react";

import "../../styles/pages/Header.css";

const Header = ({ header }) => {
  return (
    <div className="header">
      <h2 className="header__text">{header}</h2>
    </div>
  );
};

export default Header;
