import React, { useState, useRef, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
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
import Button from "@material-ui/core/Button";

import EditTweet from "./EditTweet";
import TweetboxReply from "./TweetboxReply";
import { deleteTweet, heartTweet, retweetTweet } from "../../../../api";
import { UserContext } from "../../../AppRouter";

import "../../../../styles/pages/body/Home/Tweet.css";

Modal.setAppElement("#root");

const Tweet = ({ tweet }) => {
  const [user] = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState({ editTweet: false });
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const history = useHistory();
  const oneTweet = { one: false };
  const [showReplyBox, setShowReplyBox] = useState({
    replying: false,
    tweetid: "",
  });

  const handleOptions = () => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    setShowOptions(true);
  };

  const handleShowTweet = (e) => {
    const tar = e.target.className;
    if (
      tar === "tweet" ||
      tar === "tweet__container" ||
      tar === "tweet__header" ||
      tar === "tweet__text" ||
      tar === "tweet__footer"
    ) {
      history.push(
        `/${tweet.tweeter.username}/${
          tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id
        }`
      );
    }
  };

  const handleDeleteTweet = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    deleteTweet(tweet._id)
      .then((res) => setShowOptions(false))
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
      tweetid: tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id,
    });
  };

  const handleRetweet = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }

    let retweet;

    if (tweet.retweets.indexOf(user.user._id) !== -1) {
      retweet = false;
      const tweetid = tweet.retweeted_by
        ? tweet.retweeted_by.tweet._id
        : tweet._id;
      user.user.retweets = user.user.retweets.filter(
        (retweet) => retweet !== tweetid
      );
      tweet.retweets = tweet.retweets.filter(
        (retweet) => retweet !== user.user._id
      );
    } else if (tweet.retweets.indexOf(user.user._id) === -1) {
      retweet = true;
      user.user.retweets.push(
        tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id
      );
      tweet.retweets.push(user.user._id);
    }

    retweetTweet({
      user: user.user._id,
      tweet: tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id,
      retweeted_by: tweet.retweeted_by,
      tweet_retweets: tweet.retweets,
      user_retweets: user.user.retweets,
      retweet: retweet,
    })
      .then((res) => {
        setShowOptions(false);
      })
      .catch((err) => console.log(err));
  };

  const handleHeart = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
    console.log(tweet);
    if (tweet.hearts.indexOf(user.user._id) !== -1) {
      const tweetid = tweet.retweeted_by
        ? tweet.retweeted_by.tweet._id
        : tweet._id;
      user.user.hearts = user.user.hearts.filter((heart) => heart !== tweetid);
      tweet.hearts = tweet.hearts.filter((heart) => heart !== user.user._id);
    } else if (tweet.hearts.indexOf(user.user._id) === -1) {
      user.user.hearts.push(
        tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id
      );
      tweet.hearts.push(user.user._id);
    }

    heartTweet({
      user: user.user._id,
      tweet: tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id,
      user_hearts: user.user.hearts,
      tweet_hearts: tweet.hearts,
    })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  const handleShare = (e) => {
    if (!user.accesstoken) {
      return history.push("/u/login");
    }
  };

  const handleClick = (e) => {
    if (
      user.user._id &&
      optionsRef.current &&
      !optionsRef.current.contains(e.target)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="tweet" onClick={handleShowTweet}>
      <div className="tweet__reply">
        {showOptions && (
          <div className="tweet__optionsContainer" ref={optionsRef}>
            {tweet.retweeted_by &&
              tweet.retweeted_by.retweeter._id === user.user._id && (
                <Button
                  className="tweet__unretweetButtonOption"
                  onClick={handleRetweet}
                >
                  <CachedRoundedIcon className="tweet__unretweetIconOption" />
                  <h5 className="tweet__unretweetTextOption">Unretweet</h5>
                </Button>
              )}
            {(user.user._id === tweet.tweeter._id ||
              (tweet.retweeted_by &&
                tweet.retweeted_by.tweet.tweeter._id === user.user._id)) && (
              <Button
                className="tweet__deleteButtonOption"
                onClick={handleDeleteTweet}
              >
                <DeleteForeverIcon className="tweet__deleteIconOption" />
                <h5 className="tweet__deleteTextOption">Delete</h5>
              </Button>
            )}
            {(user.user._id === tweet.tweeter._id ||
              (tweet.retweeted_by &&
                tweet.retweeted_by.tweet.tweeter._id === user.user._id)) && (
              <Button
                className="tweet__editButtonOption"
                onClick={handleEditTweet}
              >
                <EditIcon className="tweet__editIconOption" />
                <h5 className="tweet__editTextOption">Edit</h5>
              </Button>
            )}
          </div>
        )}

        <Modal
          isOpen={modalOpen.editTweet}
          onRequestClose={() => setModalOpen({ editTweet: false })}
          className="tweet__editModal"
          overlayClassName="tweet__editOverlay"
        >
          <EditTweet
            tweetid={
              tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id
            }
            setModalOpen={setModalOpen}
            oneTweet={oneTweet}
          />
        </Modal>
        <div className="tweet__wrapper">
          {tweet.retweeted_by && (
            <div className="tweet__retweetedContainer">
              <CachedRoundedIcon className="tweet__retweetedIcon" />
              <h5 className="tweet__retweeter">
                {tweet.retweeted_by.retweeter.name} Retweeted
              </h5>
            </div>
          )}
          {tweet.replied_to && (
            <div className="tweet__repliedContainer">
              <ChatBubbleOutlineRoundedIcon className="tweet__repliedIcon" />
              <h5 className="tweet__repliedTo">
                Reply to {tweet.replied_to.tweeter.name}
              </h5>
            </div>
          )}

          <div className="tweet__container">
            <Avatar className="tweet__avatar" src={tweet.tweeter.avatar.url} />
            <div className="tweet__content">
              <div className="tweet__header">
                <div className="tweet__names">
                  <h5 className="tweet__name">{tweet.tweeter.name}</h5>
                  &nbsp;
                  <h5 className="tweet__username">@{tweet.tweeter.username}</h5>
                  &nbsp;
                  <h5 className="tweet__createdOn">
                    · {moment(tweet.created_on).fromNow()}
                  </h5>
                </div>
                <Button
                  style={{ visibility: showOptions ? "hidden" : "visible" }}
                  className="tweet__optionsButton"
                  onClick={handleOptions}
                >
                  <MoreHorizIcon className="tweet__optionsIcon" />
                </Button>
              </div>
              <div className="tweet__body">
                {tweet.text && <h5 className="tweet__text">{tweet.text}</h5>}
                {tweet.image.url && (
                  <img src={tweet.image.url} alt="" className="tweet__image" />
                )}
              </div>
              <div className="tweet__footer">
                <Button
                  className="tweet__replyButton"
                  onClick={handleReply}
                  style={{ backgroundColor: "transparent" }}
                  disableRipple
                >
                  <ChatBubbleOutlineRoundedIcon
                    className="tweet__replyIcon"
                    style={{
                      color:
                        tweet.replies
                          .map((reply) => reply.tweet.tweeter)
                          .indexOf(user.user._id) !== -1 && "var(--primary)",
                    }}
                  />
                  <h5
                    className="tweet__replyAmount"
                    style={{
                      color:
                        tweet.replies
                          .map((reply) => reply.tweet.tweeter)
                          .indexOf(user.user._id) !== -1 && "var(--primary)",
                    }}
                  >
                    {tweet.replies.length > 0 && tweet.replies.length}
                  </h5>
                </Button>
                <Button
                  className="tweet__retweetButton"
                  onClick={handleRetweet}
                  style={{ backgroundColor: "transparent" }}
                  disableRipple
                >
                  <CachedRoundedIcon
                    className="tweet__retweetIcon"
                    style={{
                      color:
                        tweet.retweets.indexOf(user.user._id) !== -1 &&
                        "var(--retweet)",
                    }}
                  />
                  <h5
                    className="tweet__retweetAmount"
                    style={{
                      color:
                        tweet.retweets.indexOf(user.user._id) !== -1 &&
                        "var(--retweet)",
                    }}
                  >
                    {tweet.retweets.length > 0 && tweet.retweets.length}
                  </h5>
                </Button>
                <Button
                  className="tweet__heartButton"
                  onClick={handleHeart}
                  style={{ backgroundColor: "transparent" }}
                  disableRipple
                >
                  {tweet.hearts.indexOf(user.user._id) === -1 ? (
                    <FavoriteBorderRoundedIcon className="tweet__heartIcon" />
                  ) : (
                    <FavoriteIcon
                      className="tweet__heartIcon"
                      style={{ color: "var(--heart)" }}
                    />
                  )}
                  <h5
                    className="tweet__heartAmount"
                    style={{
                      color:
                        tweet.hearts.indexOf(user.user._id) !== -1 &&
                        "var(--heart)",
                    }}
                  >
                    {tweet.hearts.length > 0 && tweet.hearts.length}
                  </h5>
                </Button>
                <Button
                  className="tweet__shareButton"
                  style={{ backgroundColor: "transparent" }}
                  disableRipple
                >
                  <PublishRoundedIcon
                    className="tweet__shareIcon"
                    onClick={handleShare}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {showReplyBox && (
          <TweetboxReply showReplyBox={showReplyBox} tweet={tweet} />
        )}
      </div>
    </div>
  );
};

export default Tweet;
