import React, { useState, useRef, useEffect, useContext } from "react";
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

import { postTweet } from "../../../../api";
import { UserContext } from "../../../AppRouter";

import "../../../../styles/pages/body/Home/Tweetbox.css";

const normalise = (value, min, max) => ((value - min) * 100) / (max - min);

const Tweetbox = () => {
  const [user] = useContext(UserContext);
  const [tweet, setTweet] = useState({
    tweeter: user.user._id,
    text: "",
    image: "",
  });
  const [preview, setPreview] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageUpload = useRef(null);

  const handleTweetSubmit = (e) => {
    e.preventDefault();

    setUploading(true);

    postTweet(tweet)
      .then((res) => {
        setUploading(false);
        setTweet({
          tweeter: user.user._id,
          text: "",
          image: "",
        });
        setPreview("");
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
        setTweet({ ...tweet, image: reader.result });
      };
      reader.readAsDataURL(uploadImage);
    } else {
      setPreview("");
    }
    // eslint-disable-next-line
  }, [uploadImage]);

  return (
    <div className="tweetbox">
      {uploading && <CircularProgress className="tweetbox__uploadProgress" />}
      <form action="" onSubmit={handleTweetSubmit} className="tweetbox__form">
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
              value={tweet.text}
              placeholder="What's happening?"
              onChange={(e) =>
                setTweet({ ...tweet, [e.target.name]: e.target.value })
              }
            ></TextareaAutosize>
            {preview && (
              <>
                <img src={preview} alt="" className="form__imagePreview" />
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
                value={normalise(tweet.text.length, 0, 200)}
                variant="determinate"
                className="form__textLimit"
              />
              <Button
                disabled={!tweet.text && !tweet.image}
                className="form__submit"
                type="submit"
              >
                Tweet
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;
