import React from "react";

import ShowTweet from "../components/pages/body/ShowTweet";
import Signup from "../components/pages/Signup";
import Login from "../components/pages/Login";
import Home from "../components/pages/body/Home/Home";
import Explore from "../components/pages/body/Explore/Explore";
import Notifications from "../components/pages/body/Notifications";
import Messages from "../components/pages/body/Messages";
import Bookmarks from "../components/pages/body/Bookmarks";
import Lists from "../components/pages/body/Lists";
import Profile from "../components/pages/body/Profile";

export const PAGES = [
  { Page: () => <Signup />, path: "/u/signup", exact: false, header: "Signup" },
  { Page: () => <Login />, path: "/u/login", exact: false, header: "Login" },
  {
    Body: () => <Home />,
    path: "/u/home",
    exact: true,
    header: "Home",
  },
  {
    Body: () => <Explore />,
    path: "/u/explore",
    exact: true,
    header: "Explore",
  },
  {
    Body: () => <Notifications />,
    path: "/u/notifications",
    exact: true,
    header: "Notifications",
  },
  {
    Body: () => <Messages />,
    path: "/u/messages",
    exact: true,
    header: "Messages",
  },
  {
    Body: () => <Bookmarks />,
    path: "/u/bookmarks",
    exact: true,
    header: "Bookmarks",
  },
  {
    Body: () => <Lists />,
    path: "/u/lists",
    exact: true,
    header: "Lists",
  },
  {
    Body: () => <Profile />,
    path: "/:username",
    exact: true,
    header: "Profile",
  },
  {
    Body: () => <ShowTweet />,
    path: "/:username/:tweetid",
    exact: true,
    header: "Tweet",
  },
];
