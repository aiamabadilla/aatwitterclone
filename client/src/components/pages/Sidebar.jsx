import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import Modal from "react-modal";

import TwitterIcon from "@material-ui/icons/Twitter";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import PersonIcon from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";

import SidebarLink from "./SidebarLink";
import TweetboxModal from "./TweetboxModal";

import { UserContext } from "../AppRouter";
import { LINKS } from "../../constants/links";
import { logoutUser } from "../../api";

import "../../styles/pages/Sidebar.css";

Modal.setAppElement("#root");

const Sidebar = () => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);
  const [active, setActive] = useState("");
  const [modalOpen, setModalOpen] = useState({ newTweet: false });

  const handleActiveLink = (activeLink) => {
    localStorage.setItem("active", activeLink);
    setActive(activeLink);
  };

  const handleNewTweet = (e) => {
    setModalOpen({ newTweet: true });
  };

  const handleLogin = (e) => {
    history.push("/u/login");
  };

  const handleSignup = (e) => {
    history.push("/u/signup");
  };

  const handleLogout = (e) => {
    logoutUser()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("active", "Explore");
        localStorage.setItem("user", JSON.stringify(res.data));
        return history.push("/u/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!localStorage.getItem("active") || !user.accesstoken) {
      localStorage.setItem("active", "Explore");
    }
    setActive(localStorage.getItem("active"));
  }, [user.accesstoken]);

  return (
    <div className="sidebar">
      <Modal
        isOpen={modalOpen.newTweet}
        onRequestClose={() => setModalOpen({ newTweet: false })}
        className="sidebar__newModal"
        overlayClassName="sidebar__newOverlay"
      >
        {user.accesstoken ? <TweetboxModal /> : <Redirect to="/u/login" />}
      </Modal>
      <div className="sidebar__links">
        <Link
          to={user.accesstoken ? "/u/home" : "/u/explore"}
          className="sidebar__Link"
          onClick={() =>
            handleActiveLink(user.accesstoken ? "Home" : "Explore")
          }
        >
          <Button className="sidebar__Button">
            <TwitterIcon className="sidebar__twitterIcon"></TwitterIcon>
          </Button>
        </Link>
        {LINKS.map((LINK, index) => {
          return (
            <SidebarLink
              LINK={LINK}
              key={index}
              active={active}
              handleActiveLink={handleActiveLink}
            />
          );
        })}
        <SidebarLink
          LINK={{
            to: `/${user.accesstoken ? user.user.username : "u/login"}`,
            Active: (
              <Button className="sidebarlink__activeButton">
                <PersonIcon className="sidebarlink__Icon" />
                <h2 className="sidebarlink__activeText">Profile</h2>
              </Button>
            ),
            Inactive: (
              <Button className="sidebarlink__Button">
                <PersonOutlineIcon className="sidebarlink__Icon" />
                <h2 className="sidebarlink__text">Profile</h2>
              </Button>
            ),
            active: "Profile",
          }}
          active={active}
          handleActiveLink={handleActiveLink}
        />
        <Button className="sidebar__Button">
          <MoreHorizIcon className="sidebar__Icon" />
        </Button>
        <Button className="sidebar__tweetboxButton" onClick={handleNewTweet}>
          Tweet
        </Button>
      </div>
      <div className="sidebar__userButtons">
        {!user.accesstoken && (
          <Button className="sidebar__login" onClick={handleLogin}>
            Login
          </Button>
        )}
        {!user.accesstoken && (
          <Button className="sidebar__signup" onClick={handleSignup}>
            Signup
          </Button>
        )}
        {user.accesstoken && (
          <Button className="sidebar__logout" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
