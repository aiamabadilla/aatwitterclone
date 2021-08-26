import React, { useState, useEffect, useContext } from "react";
import Pusher from "pusher-js";
import { Redirect } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import { getTweets } from "../../../../api";
import { UserContext } from "../../../AppRouter";

import Tweetbox from "./Tweetbox";
import Tweet from "./Tweet";

import "../../../../styles/pages/body/Home/Home.css";

const Home = () => {
  const [user] = useContext(UserContext);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState({ tweets: true });

  useEffect(() => {
    if (user.accesstoken) {
      getTweets()
        .then((res) => {
          setTweets(res.data);
          setLoading({ tweets: false });
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Pusher.logToConsole = true;
    if (user.accesstoken) {
      const pusher = new Pusher("a8665cbba8d3ff83c5ce", {
        cluster: "us3",
      });

      const channel = pusher.subscribe("tweetPosts");

      channel.bind("update", () => {
        if (user.accesstoken) {
          getTweets()
            .then((res) => {
              setTweets(res.data);
              setLoading({ tweets: false });
            })
            .catch((err) => console.log(err));
        }
      });

      channel.bind("updateReply", ({ updatedTweets }) => {
        updatedTweets.forEach((updatedTweet) => {
          const pos = tweets
            .map((tweet) => tweet._id)
            .indexOf(updatedTweet._id);
          tweets.splice(pos, 1, updatedTweet);
        });
        setTweets([...tweets]);
      });

      return () => {
        channel.unsubscribe();
        channel.unbind_all();
      };
    }
    // eslint-disable-next-line
  });

  if (!user.accesstoken) return <Redirect to="/u/login" />;

  return (
    <div className="home">
      {user.accesstoken && <Tweetbox />}
      {loading.tweets ? (
        <CircularProgress className="home__loadingTweets" />
      ) : (
        <div className="home__tweets">
          {tweets.length ? (
            tweets.map((tweet, index) => {
              return <Tweet key={index} tweet={tweet} />;
            })
          ) : (
            <div className="home__notweets">
              <h2 className="home__header">
                Looks like there are no tweets...
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
