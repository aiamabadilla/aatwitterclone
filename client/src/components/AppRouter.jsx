import React, { useState, useEffect, createContext } from "react";
import { Route, Switch } from "react-router-dom";
import Pusher from "pusher-js";

import TwitterIcon from "@material-ui/icons/Twitter";

import Home from "./pages/body/Home/Home";
import Explore from "./pages/body/Explore/Explore";
import Page from "./Page";

import { PAGES } from "../constants/pages";

import { checkRefreshToken } from "../api";

import "../styles/AppRouter.css";

export const pusher = new Pusher("a8665cbba8d3ff83c5ce", {
  cluster: "us3",
});

export const UserContext = createContext([]);

const AppRouter = () => {
  const [loading, setLoading] = useState({ accesstoken: true });
  const [user, setUser] = useState({ refreshtoken: "" });

  useEffect(() => {
    const checkUser = JSON.parse(localStorage.getItem("user"));

    checkRefreshToken({
      token: checkUser ? checkUser.refreshtoken : user.refreshtoken,
    })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setLoading(false);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="appRouter">
      {loading.accesstoken ? (
        <div className="appRouter__IconContainer">
          <TwitterIcon className="appRouter__Icon" />
        </div>
      ) : (
        <UserContext.Provider value={[user, setUser]}>
          <Switch>
            {user.accesstoken ? (
              <Route exact={true} path="/">
                <Page Body={() => <Home />} header="Home" />
              </Route>
            ) : (
              <Route exact={true} path="/">
                <Page Body={() => <Explore />} header="Explore" />
              </Route>
            )}
            {PAGES.map((PAGE, index) => {
              return (
                <Route key={index} exact={PAGE.exact} path={PAGE.path}>
                  <Page
                    Page={PAGE.Page}
                    Body={PAGE.Body}
                    header={PAGE.header}
                  />
                </Route>
              );
            })}
          </Switch>
        </UserContext.Provider>
      )}
    </div>
  );
};

export default AppRouter;
