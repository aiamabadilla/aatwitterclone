import React, { useState, useRef, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import TextareaAutosize from "react-textarea-autosize";

import CropOriginalOutlinedIcon from "@material-ui/icons/CropOriginalOutlined";
import GifOutlinedIcon from "@material-ui/icons/GifOutlined";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import EventIcon from "@material-ui/icons/Event";
import CloseIcon from "@material-ui/icons/Close";

import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";

import { replyPostTweet } from "../../../../api";
import { UserContext } from "../../../AppRouter";

import "../../../../styles/pages/body/Home/TweetboxReply.css";

const normalise = (value, min, max) => ((value - min) * 100) / (max - min);

const TweetboxReply = ({ showReplyBox, tweet, tweetid }) => {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const [replyTweet, setReplyTweet] = useState({
    tweeter: user.user._id,
    text: "",
    image: "",
    replyToTweet: tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id,
  });

  const [preview, setPreview] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageUpload = useRef(null);

  const handleReplyTweetSubmit = (e) => {
    e.preventDefault();

    setUploading(true);
    replyPostTweet(replyTweet)
      .then((res) => {
        setUploading(false);
        setReplyTweet({
          tweeter: user.user._id,
          text: "",
          image: "",
          replyToTweet: tweet.retweeted_by
            ? tweet.retweeted_by.tweet._id
            : tweet._id,
        });
        setPreview("");
        if (!tweetid) {
          console.log("noob");
          history.push(
            `/${tweet.tweeter.username}/${
              tweet.retweeted_by ? tweet.retweeted_by.tweet._id : tweet._id
            }`
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  const handleDeletePreview = (e) => {
    setPreview("");
  };

  useEffect(() => {
    if (uploadImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setReplyTweet({ ...replyTweet, image: reader.result });
      };
      reader.readAsDataURL(uploadImage);
    } else {
      setPreview("");
    }
    // eslint-disable-next-line
  }, [uploadImage]);

  return (
    <div className="tweetboxreply">
      {showReplyBox.tweetid === tweet.retweeted_by
        ? tweet.retweeted_by.tweet
        : tweet._id &&
          showReplyBox.replying && (
            <div className="tweetboxreply">
              {uploading && (
                <CircularProgress className="tweetboxreply__uploadProgress" />
              )}
              <form
                action=""
                onSubmit={handleReplyTweetSubmit}
                className="tweetboxreply__form"
              >
                <div className="form__header">
                  <Avatar className="form__avatar" src={user.user.avatar.url} />
                </div>
                <div className="form__body">
                  <div className="form__preview">
                    <TextareaAutosize
                      className="form__textInput"
                      type="text"
                      name="text"
                      id="text"
                      maxLength="200"
                      value={replyTweet.text}
                      placeholder={`Replying to ${tweet.tweeter.name}...`}
                      onChange={(e) =>
                        setReplyTweet({
                          ...replyTweet,
                          [e.target.name]: e.target.value,
                        })
                      }
                    ></TextareaAutosize>
                    {preview && (
                      <>
                        <img
                          src={preview}
                          alt=""
                          className="form__imagePreview"
                        />
                        <Button
                          className="form__imagePreviewCloseButton"
                          onClick={handleDeletePreview}
                        >
                          <CloseIcon className="form__imagePreviewCloseIcon" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="form__footer">
                    <div className="form__actions">
                      <Button
                        className="form__button"
                        onClick={(e) => imageUpload.current.click()}
                      >
                        <CropOriginalOutlinedIcon className="form__icon" />
                        <input
                          name="image"
                          id="image"
                          type="file"
                          accept="image/*"
                          ref={imageUpload}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.type.substr(0, 5) === "image") {
                              setUploadImage(file);
                            } else {
                              setUploadImage(null);
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </Button>
                      <Button className="form__button">
                        <GifOutlinedIcon className="form__icon" />
                      </Button>
                      <Button className="form__button">
                        <PollOutlinedIcon className="form__icon" />
                      </Button>
                      <Button className="form__button">
                        <InsertEmoticonIcon className="form__icon" />
                      </Button>
                      <Button className="form__button">
                        <EventIcon className="form__icon" />
                      </Button>
                    </div>
                    <div className="form__limitSubmit">
                      <CircularProgress
                        value={normalise(replyTweet.text.length, 0, 200)}
                        variant="determinate"
                        className="form__textLimit"
                      />
                      <Button
                        disabled={!replyTweet.text && !replyTweet.image}
                        className="form__submit"
                        type="submit"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
    </div>
  );
};

export default TweetboxReply;
