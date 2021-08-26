import React from "react";

import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import HomeIcon from "@material-ui/icons/Home";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import MailIcon from "@material-ui/icons/Mail";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FeaturedPlayListIcon from "@material-ui/icons/FeaturedPlayList";
import FeaturedPlayListOutlinedIcon from "@material-ui/icons/FeaturedPlayListOutlined";

import Button from "@material-ui/core/Button";

export const LINKS = [
  {
    to: "/u/home",
    Active: (
      <Button className="sidebarlink__activeButton">
        <HomeIcon className="sidebarlink__activeIcon" />
        <h2 className="sidebarlink__activeText">Home</h2>
      </Button>
    ),
    Inactive: (
      <Button className="sidebarlink__Button">
        <HomeOutlinedIcon className="sidebarlink__Icon" />{" "}
        <h2 className="sidebarlink__text">Home</h2>
      </Button>
    ),
    active: "Home",
  },
  {
    to: "/u/explore",
    Active: (
      <Button className="sidebarlink__activeButton">
        <ExploreIcon className="sidebarlink__activeIcon" />
        <h2 className="sidebarlink__activeText">Explore</h2>
      </Button>
    ),
    Inactive: (
      <Button className="sidebarlink__Button">
        <ExploreOutlinedIcon className="sidebarlink__Icon" />{" "}
        <h2 className="sidebarlink__text">Explore</h2>
      </Button>
    ),
    active: "Explore",
  },
  {
    to: "/u/notifications",
    Active: (
      <Button className="sidebarlink__activeButton">
        <NotificationsIcon className="sidebarlink__Icon" />{" "}
        <h2 className="sidebarlink__activeText">Notifications</h2>
      </Button>
    ),
    Inactive: (
      <Button className="sidebarlink__Button">
        <NotificationsNoneOutlinedIcon className="sidebarlink__Icon" />
        <h2 className="sidebarlink__text">Notifications</h2>
      </Button>
    ),
    active: "Notifications",
  },
  {
    to: "/u/messages",
    Active: (
      <Button className="sidebarlink__activeButton">
        <MailIcon className="sidebarlink__Icon" />{" "}
        <h2 className="sidebarlink__activeText">Messages</h2>
      </Button>
    ),
    Inactive: (
      <Button className="sidebarlink__Button">
        <MailOutlineOutlinedIcon className="sidebarlink__Icon" />{" "}
        <h2 className="sidebarlink__text">Messages</h2>
      </Button>
    ),
    active: "Messages",
  },
  {
    to: "/u/bookmarks",
    Active: (
      <Button className="sidebarlink__activeButton">
        <BookmarkIcon className="sidebarlink__Icon" />
        <h2 className="sidebarlink__activeText">Bookmarks</h2>
      </Button>
    ),
    Inactive: (
      <Button className="sidebarlink__Button">
        <BookmarkBorderOutlinedIcon className="sidebarlink__Icon" />
        <h2 className="sidebarlink__text">Bookmarks</h2>
      </Button>
    ),
    active: "Bookmarks",
  },
  {
    to: "/u/lists",
    Active: (
      <Button className="sidebarlink__activeButton">
        <FeaturedPlayListIcon className="sidebarlink__Icon" />
        <h2 className="sidebarlink__activeText">Lists</h2>
      </Button>
    ),
    Inactive: (
      <Button className="sidebarlink__Button">
        <FeaturedPlayListOutlinedIcon className="sidebarlink__Icon" />
        <h2 className="sidebarlink__text">Lists</h2>
      </Button>
    ),
    active: "Lists",
  },
];
