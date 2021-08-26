import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";

import SearchResult from "./SearchResult";

import { getUsers } from "../../../api";

import "../../../styles/pages/Widgets/Widgets.css";

const Widgets = () => {
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState({ search: "" });
  const [loading, setLoading] = useState({ search: true });
  const [users, setUsers] = useState([]);

  const searchRef = useRef(null);

  const handleSearchActive = (e) => {
    if (searchRef.current && searchRef.current.contains(e.target)) {
      setActive(true);
    }
  };

  const handleProfileView = (username) => {
    history.push(`/${username}`);
  };

  const handleClick = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setActive(false);
    }
  };

  useEffect(() => {
    setLoading({ ...loading, search: true });
    if (search.search) {
      getUsers(search)
        .then((res) => {
          console.log(res.data);
          setUsers(res.data);
          setLoading({ ...loading, search: false });
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="widgets">
      <div className="widgets__container">
        <form action="" className="widget__searchForm">
          <label
            htmlFor="search"
            className="widget__searchContainer"
            style={{ border: active && "1px solid var(--primary)" }}
            onClick={handleSearchActive}
            ref={searchRef}
          >
            <SearchIcon
              className="widget__searchIcon"
              style={{ color: active && "var(--primary)" }}
            />
            <input
              style={{ color: active && "var(--dark)" }}
              name="search"
              id="search"
              type="text"
              value={search.search}
              autoComplete="off"
              className="widget__searchInput"
              placeholder="Search Twitter"
              onChange={(e) =>
                setSearch({ ...search, [e.target.name]: e.target.value })
              }
            />
          </label>
        </form>
        {
          <div className="widget__searchResults">
            {users.map((user, index) => {
              return (
                <SearchResult
                  key={index}
                  user={user}
                  handleProfileView={handleProfileView}
                />
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};

export default Widgets;
