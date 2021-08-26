import React from "react";

import Avatar from "@material-ui/core/Avatar";

import "../../../styles/pages/Widgets/SearchResult.css";

const SearchResult = ({ user, handleProfileView }) => {
  return (
    <div
      className="searchresult"
      onClick={() => handleProfileView(user.username)}
    >
      <Avatar src={user.avatar.url} />
      <div className="searchresult__names">
        <h5>{user.name}</h5>
        <h5>@{user.username}</h5>
      </div>
    </div>
  );
};

export default SearchResult;
