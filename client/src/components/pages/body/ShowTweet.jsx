import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import Modal from "react-modal";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import CachedRoundedIcon from "@material-ui/icons/CachedRounded";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import EditTweet from "./Home/EditTweet";

import { UserContext, pusher } from "../../AppRouter";
import {
  getTweet,
  deleteTweet,
  heartTweet,
  retweetTweet,
  getTweetReplies,
} from "../../../api";
import TweetboxReply from "./Home/TweetboxReply";
import Tweet from "./Home/Tweet";

import "../../../styles/pages/body/ShowTweet.css";

Modal.setAppElement("#root");

const ShowTweet = () => {
  const [user] = useContext(UserContext);
  const { tweetid } = useParams();
  const optionsRef = useRef(null);
  const history = useHistory();
  const [showTweet, setShowTweet] = useState({});
  const [showTweetReplies, setShowTweetReplies] = useState([]);
  const [modalOpen, setModalOpen] = useState({ editTweet: false });
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState({
    showTweet: true,
    showTweetReplies: true,
  });
  const oneTweet = { one: true, setShowTweet: setShowTweet };
  const [showReplyBox, setShowReplyBox] = useState({
    replying: false,
    tweetid: "",
  });

  const handleOptions = () => {
    setShowOptions(true);
  };

  const handleDeleteTweet = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    deleteTweet(showTweet._id)
      .then((res) => {
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

  const handleEditTweet = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    setModalOpen({ editTweet: true });
  };

  const handleReply = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    setShowReplyBox({
      replying: !showReplyBox.replying,
      tweetid: showTweet._id,
    });
  };

  const handleRetweet = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    let retweet;

    if (showTweet.retweets.indexOf(user.user._id) !== -1) {
      retweet = false;
      const tweetid = showTweet.retweeted_by
        ? showTweet.retweeted_by.tweet_id
        : showTweet._id;
      user.user.retweets = user.user.retweets.filter(
        (retweet) => retweet !== tweetid
      );
      showTweet.retweets = showTweet.retweets.filter(
        (retweet) => retweet !== user.user._id
      );
    } else if (showTweet.retweets.indexOf(user.user._id) === -1) {
      retweet = true;
      user.user.retweets.push(
        showTweet.retweeted_by ? showTweet.retweeted_by.tweet_id : showTweet._id
      );
      showTweet.retweets.push(user.user._id);
    }

    retweetTweet({
      userid: user.user._id,
      tweetid: showTweet.retweeted_by
        ? showTweet.retweeted_by.tweet_id
        : showTweet._id,
      retweetedBy: showTweet.retweeted_by,
      tweetRetweets: showTweet.retweets,
      userRetweets: user.user.retweets,
      retweet: retweet,
    })
      .then((res) => {
        return;
      })
      .catch((err) => console.log(err));
  };

  const handleHeart = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    if (showTweet.hearts.indexOf(user.user._id) !== -1) {
      const tweetid = showTweet.retweeted_by
        ? showTweet.retweeted_by.tweet
        : showTweet._id;
      user.user.hearts = user.user.hearts.filter((heart) => heart !== tweetid);
      showTweet.hearts = showTweet.hearts.filter(
        (heart) => heart !== user.user._id
      );
    } else if (showTweet.hearts.indexOf(user.user._id) === -1) {
      user.user.hearts.push(
        showTweet.retweeted_by ? showTweet.retweeted_by.tweet : showTweet._id
      );
      showTweet.hearts.push(user.user._id);
    }

    heartTweet({
      user: user.user._id,
      tweet: showTweet.retweeted_by
        ? showTweet.retweeted_by.tweet
        : showTweet._id,
      user_hearts: user.user.hearts,
      tweet_hearts: showTweet.hearts,
    })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  const handleClick = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    // Pusher.logToConsole = true;

    const channel = pusher.subscribe("tweetPosts");
    if (!loading.showTweet) {
      channel.bind("updateReplies", () => {
        getTweetReplies(tweetid)
          .then((res) => {
            setShowTweetReplies(res.data);
            setLoading({ ...loading, showTweetReplies: false });
          })
          .catch((err) => console.log(err));
      });

      channel.bind("updateShow", () => {
        getTweet(tweetid)
          .then((res) => {
            if (!Object.keys(res.data).length) {
              localStorage.setItem("active", "Home");
              return history.push("/u/home");
            }
            setShowTweet(res.data);
            setLoading({ ...loading, showTweet: false });
          })
          .catch((err) => console.log(err));
      });
    }
    // return () => {
    //   channel.unsubscribe();
    //   channel.unbind_all();
    // };
    // eslint-disable-next-line
  }, [loading.showTweet]);

  useEffect(() => {
    if (loading.showTweet) {
      getTweet(tweetid)
        .then((res) => {
          if (!Object.keys(res.data).length) {
            localStorage.setItem("active", "Home");
            return history.push("/u/home");
          }
          console.log(res.data);
          setShowTweet(res.data);
          setLoading({ ...loading, showTweet: false });
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, [tweetid]);

  useEffect(() => {
    console.log(loading);
    if (!loading.showTweet) {
      getTweetReplies(tweetid)
        .then((res) => {
          console.log(res.data);
          setShowTweetReplies(res.data);
          setLoading({ ...loading, showTweetReplies: false });
        })
        .catch((err) => console.log(err));
    }

    // eslint-disable-next-line
  }, [loading.showTweet]);

  return (
    <div className="showtweet">
      {loading.showTweet ? (
        <CircularProgress className="showtweet__loadingProgress" />
      ) : (
        <div className="showtweet__tweet">
          {showOptions && (
            <div className="showtweet__optionsContainer" ref={optionsRef}>
              {!showTweet.retweeted_by &&
                user.user._id === showTweet.tweeter._id && (
                  <Button
                    className="showtweet__deleteButton"
                    onClick={handleDeleteTweet}
                  >
                    <DeleteForeverIcon className="showtweet__deleteIcon" />
                    <h5 className="showtweet__deleteText">Delete</h5>
                  </Button>
                )}
              {!showTweet.retweeted_by &&
                user.user._id === showTweet.tweeter._id && (
                  <Button
                    className="showtweet__editButton"
                    onClick={handleEditTweet}
                  >
                    <EditIcon className="showtweet__editIcon" />
                    <h5 className="showtweet__editText">Edit</h5>
                  </Button>
                )}
            </div>
          )}
          <Modal
            isOpen={modalOpen.editTweet}
            onRequestClose={() => setModalOpen({ editTweet: false })}
            className="showtweet__editModal"
            overlayClassName="showtweet__editOverlay"
          >
            <EditTweet
              tweetid={tweetid}
              setModalOpen={setModalOpen}
              oneTweet={oneTweet}
            />
          </Modal>
          <div className="showtweet__wrapper">
            {showTweet.retweeted_by && (
              <div className="showtweet__retweetedContainer">
                <CachedRoundedIcon className="showtweet__retweetedIcon" />
                <h5 className="showtweet__retweeter">
                  {showTweet.retweeted_by.retweeter.name} Retweeted
                </h5>
              </div>
            )}
            {showTweet.replied_to && (
              <div className="showtweet__repliedContainer">
                <ChatBubbleOutlineRoundedIcon className="showtweet__repliedIcon" />
                <h5 className="showtweet__repliedTo">
                  Reply to {showTweet.replied_to.tweeter.name}
                </h5>
              </div>
            )}
            <div className="showtweet__container">
              <Avatar
                className="showtweet__avatar"
                src={showTweet.tweeter.avatar.url}
              />
              <div className="showtweet__content">
                <div className="showtweet__header">
                  <div className="showtweet__names">
                    <h5 className="showtweet__name">
                      {showTweet.tweeter.name}
                    </h5>
                    &nbsp;
                    <h5 className="showtweet__username">
                      @{showTweet.tweeter.username}
                    </h5>
                    &nbsp;
                    <h5 className="showtweet__createdOn">
                      · {moment(showTweet.created_on).fromNow()}
                    </h5>
                  </div>
                  <Button
                    style={{ visibility: showOptions ? "hidden" : "visible" }}
                    className="showtweet__optionsButton"
                    onClick={handleOptions}
                  >
                    <MoreHorizIcon className="showtweet__optionsIcon" />
                  </Button>
                </div>
                <div className="showtweet__body">
                  {showTweet.text && (
                    <h5 className="showtweet__text">{showTweet.text}</h5>
                  )}
                  {showTweet.image.url && (
                    <img
                      src={showTweet.image.url}
                      alt=""
                      className="showtweet__image"
                    />
                  )}
                </div>
                <div className="showtweet__footer">
                  <Button
                    className="showtweet__replyButton"
                    onClick={handleReply}
                    style={{ backgroundColor: "transparent" }}
                    disableRipple
                  >
                    <ChatBubbleOutlineRoundedIcon
                      className="showtweet__replyIcon"
                      style={{
                        color:
                          showTweet.replies
                            .map((reply) => reply.tweet.tweeter)
                            .indexOf(user.user._id) !== -1 && "var(--primary)",
                      }}
                    />
                    <h5
                      className="showtweet__replyAmount"
                      style={{
                        color:
                          showTweet.replies
                            .map((reply) => reply.tweet.tweeter)
                            .indexOf(user.user._id) !== -1 && "var(--primary)",
                      }}
                    >
                      {" "}
                      {showTweet.replies.length > 0 && showTweet.replies.length}
                    </h5>
                  </Button>
                  <Button
                    className="showtweet__retweetButton"
                    onClick={handleRetweet}
                    style={{ backgroundColor: "transparent" }}
                    disableRipple
                  >
                    <CachedRoundedIcon
                      className="showtweet__retweetIcon"
                      style={{
                        color:
                          showTweet.retweets.indexOf(user.user._id) !== -1 &&
                          "var(--retweet)",
                      }}
                    />
                    <h5
                      className="showtweet__retweetAmount"
                      style={{
                        color:
                          showTweet.retweets.indexOf(user.user._id) !== -1 &&
                          "var(--retweet)",
                      }}
                    >
                      {showTweet.retweets.length > 0 &&
                        showTweet.retweets.length}
                    </h5>
                  </Button>
                  <Button
                    className="showtweet__heartButton"
                    onClick={handleHeart}
                    style={{ backgroundColor: "transparent" }}
                    disableRipple
                  >
                    {showTweet.hearts.indexOf(user.user._id) === -1 ? (
                      <FavoriteBorderRoundedIcon className="showtweet__heartIcon" />
                    ) : (
                      <FavoriteIcon
                        className="showtweet__heartIcon"
                        style={{ color: "var(--heart)" }}
                      />
                    )}
                    <h5
                      className="showtweet__heartAmount"
                      style={{
                        color:
                          showTweet.hearts.indexOf(user.user._id) !== -1 &&
                          "var(--heart)",
                      }}
                    >
                      {showTweet.hearts.length > 0 && showTweet.hearts.length}
                    </h5>
                  </Button>

                  <Button className="showtweet__shareButton">
                    <PublishRoundedIcon className="showtweet__shareIcon" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {showReplyBox && (
            <TweetboxReply
              showReplyBox={showReplyBox}
              tweetid={tweetid}
              tweet={showTweet}
            />
          )}
        </div>
      )}
      {loading.showTweetReplies ? (
        <CircularProgress className="showtweet__loadingReplies" />
      ) : (
        <div className="showtweet__reply">
          {showTweetReplies.map((reply, index) => {
            return <Tweet key={index} tweet={reply} />;
          })}
        </div>
      )}
    </div>
  );
};

export default ShowTweet;
