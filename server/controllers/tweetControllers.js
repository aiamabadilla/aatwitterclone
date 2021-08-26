import Pusher from "pusher";
import dotenv from "dotenv";

import tweetModel from "../models/tweetModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: process.env.PUSHER_USETLS,
});

export const postTweet = async (req, res) => {
  const { tweeter, text, image } = req.body;
  try {
    if (!text && !image) {
      return res
        .status(400)
        .json({ error: "Unsuccessfully posted a tweet: No text and image." });
    }

    const newTweet = new tweetModel({
      tweeter: tweeter,
      text: text,
      image: {
        url: "",
        filename: "",
      },
    });

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: `twitterclone/${tweeter}/tweets`,
      });
      newTweet.image.url = uploadResponse.url;
      newTweet.image.filename = uploadResponse.public_id;
    }

    const savedTweet = await newTweet.save();

    const pushTweet = await tweetModel
      .findById(savedTweet._id)
      .populate("tweeter", ["-password", "-refresh_token"])
      .populate("replies", ["-password", "-refresh_token"])
      .populate("replied_to", ["-password", "-refresh_token"]);

    // pusher.trigger("tweetPosts", "update", {});
    const events = [
      {
        channel: "tweetPosts",
        name: "update",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateShow",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateReplies",
        data: {},
      },
    ];
    pusher.triggerBatch(events);

    res.status(201).json({ message: "Successfully posted a tweet." });
  } catch (error) {
    console.log(error);
  }
};

export const getTweets = async (req, res) => {
  try {
    const allTweets = await tweetModel
      .find({
        replied_to: { $not: { $ne: undefined } },
      })
      .populate("tweeter", ["-password", "-refresh_token"])
      .populate("hearts.heart")
      .populate("retweets.retweet")
      .populate("replies.tweet")
      .populate("replies.user", ["-password", "-refresh_token"])
      .populate("replied_to")
      .populate({
        path: "retweeted_by",
        populate: {
          path: "retweeter tweet",
          select: ["-password", "-refresh_token"],
          populate: {
            path: "tweeter",
            select: ["-password", "-refresh_token"],
          },
        },
      });

    res.status(200).json(allTweets);
  } catch (error) {
    console.log(error);
  }
};

export const getTweetReplies = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({
        message: "Unsuccesful in getting tweet replies. Invalid tweet.",
      });
    }

    const allTweetReplies = await tweetModel
      .find({ replied_to: id })
      .populate("tweeter", ["-password", "-refresh_token"])
      .populate("replies", ["-password", "-refresh_token"])
      .populate({
        path: "replies",
        populate: {
          path: "tweet",
          populate: {
            path: "tweeter",
            select: ["-password", "-refresh_token"],
          },
        },
      })
      .populate({
        path: "replied_to",
        populate: { path: "tweeter", select: ["-password", "-refresh_token"] },
      });

    const test = allTweetReplies.forEach((reply) => {});

    res.status(200).json(allTweetReplies);
  } catch (error) {
    console.log(error);
  }
};

export const getTweet = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ error: "Unsuccessful to get tweet. Invalid id." });
    }

    const oneTweet = await tweetModel
      .findById(id)
      .populate("tweeter", ["-password", "-refresh_token"])
      .populate("hearts.heart")
      .populate("retweets.retweet")
      .populate("replies.tweet")
      .populate("replies.user", ["-password", "-refresh_token"])
      .populate("replied_to")
      .populate("retweeted_by.retweeter", ["-password", "-refresh_token"])
      .populate("retweeted_by.tweet");
    res.status(200).json(oneTweet);
  } catch (error) {
    console.log(error);
    res.status(200).json({});
  }
};

export const deleteTweet = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ error: "Unsuccessful to delete tweet. Invalid id." });
    }

    const findRetweets = await tweetModel.find({ "retweeted_by.tweet": id });
    const deletedTweetIds = [id];
    findRetweets.forEach(async (retweet) => {
      deletedTweetIds.push(retweet._id);
      const destroyRetweet = await tweetModel.findByIdAndDelete(retweet._id);
    });

    const findUserHearts = await userModel.find({ hearts: id });

    findUserHearts.forEach(async (user) => {
      const destroyUserHeart = await userModel.findByIdAndUpdate(user._id, {
        hearts: user.hearts.filter((heart) => heart === id),
      });
    });

    const findUserRetweets = await userModel.find({ retweets: id });

    findUserRetweets.forEach(async (user) => {
      const destroyUserRetweet = await userModel.findByIdAndUpdate(user._id, {
        retweets: user.retweets.filter((retweet) => retweet === id),
      });
    });

    const destroyTweet = await tweetModel.findByIdAndDelete(id);

    if (destroyTweet.image.filename !== "") {
      const uploadResponse = await cloudinary.uploader.destroy(
        destroyTweet.image.filename
      );
    }

    const updatedUser = await userModel.findById(destroyTweet.tweeter._id);

    // pusher.trigger("tweetPosts", "update", {});
    const events = [
      {
        channel: "tweetPosts",
        name: "update",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateShow",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateReplies",
        data: {},
      },
    ];
    pusher.triggerBatch(events);

    res.status(201).json({ message: "Successfully deleted tweet." });
  } catch (error) {
    console.log(error);
  }
};

export const patchTweet = async (req, res) => {
  const { id } = req.params;
  const { user, tweet, preview } = req.body;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "Unsuccesful to edit tweet. Invalid id." });
    }

    if (preview !== "" && preview !== tweet.image.url) {
      if (tweet.image.filename !== "") {
        const destroyRes = await cloudinary.uploader.destroy(
          tweet.image.filename
        );
      }

      const uploadRes = await cloudinary.uploader.upload(preview, {
        folder: `twitterclone/${user.user._id}/tweets`,
      });

      tweet.image.url = uploadRes.url;
      tweet.image.filename = uploadRes.public_id;
    }

    if (preview === "" && tweet.image.filename !== "") {
      const destroyRes = await cloudinary.uploader.destroy(
        tweet.image.filename
      );
      tweet.image.url = "";
      tweet.image.filename = "";
    }

    if (tweet.text === "" && tweet.image.filename === "") {
      return res
        .status(400)
        .json({ message: "Unsuccessful to edit tweet. No text or image." });
    }

    tweet.edited_on = Date.now();

    const updateTweet = await tweetModel.findByIdAndUpdate(id, tweet);

    const findRetweets = await tweetModel.find({ "retweeted_by.tweet": id });

    findRetweets.forEach(async (retweet) => {
      await tweetModel.findByIdAndUpdate(retweet._id, {
        image: tweet.image,
        text: tweet.text,
        edited_on: tweet.edited_on,
      });
    });

    const events = [
      {
        channel: "tweetPosts",
        name: "update",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateShow",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateReplies",
        data: {},
      },
    ];
    pusher.triggerBatch(events);

    res.status(201).json(tweet);
  } catch (error) {
    console.log(error);
  }
};

export const heartTweet = async (req, res) => {
  const { user, tweet, user_hearts, tweet_hearts } = req.body;
  try {
    if (!user || !tweet) {
      res.status(400).json({
        message: "Unsuccesful in hearting tweet. Invalid user and tweet.",
      });
    }

    const heartUser = await userModel.findByIdAndUpdate(user, {
      hearts: user_hearts,
    });

    const heartTweet = await tweetModel.findByIdAndUpdate(tweet, {
      hearts: tweet_hearts,
    });

    const findRetweetsUserIds = await tweetModel.find({
      "retweeted_by.tweet": tweet,
    });

    findRetweetsUserIds.forEach(async (retweet) => {
      await tweetModel.findByIdAndUpdate(retweet._id, {
        hearts: tweet_hearts,
      });
    });

    const newHeartUser = await userModel.findById(user);
    const heartTweets = await tweetModel
      .find({
        "retweeted_by.tweet": tweet,
      })
      .populate("replies")
      .populate("replied_to");
    const newHeartTweet = await tweetModel
      .findById(tweet)
      .populate("replies")
      .populate("replied_to");
    heartTweets.push(newHeartTweet);

    // pusher.trigger("tweetPosts", "update", {});
    const events = [
      {
        channel: "tweetPosts",
        name: "update",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateShow",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateReplies",
        data: {},
      },
    ];
    pusher.triggerBatch(events);

    res.status(201).json({ user: newHeartUser, tweet: newHeartTweet });
  } catch (error) {
    console.log(error);
  }
};

export const retweetTweet = async (req, res) => {
  const { tweet, user, retweeted_by, tweet_retweets, user_retweets, retweet } =
    req.body;
  try {
    const updateTweetUserIds = await tweetModel.findByIdAndUpdate(tweet, {
      retweets: tweet_retweets,
    });

    const findRetweetsUserIds = await tweetModel.find({
      "retweeted_by.tweet": tweet,
    });

    findRetweetsUserIds.forEach(async (retweet) => {
      await tweetModel.findByIdAndUpdate(retweet._id, {
        retweets: tweet_retweets,
      });
    });

    const updateUserTweetIds = await userModel.findByIdAndUpdate(user, {
      retweets: user_retweets,
    });

    if (retweet) {
      const originalTweet = await tweetModel.findById(tweet);
      const retweeter = await userModel.findById(user);

      const retweetTweet = new tweetModel({
        tweeter: originalTweet.tweeter,
        text: originalTweet.text,
        image: originalTweet.image,
        created_on: originalTweet.created_on,
        edited_on: originalTweet.edited_on,
        replies: originalTweet.replies,
        hearts: originalTweet.hearts,
        retweets: originalTweet.retweets,
        retweeted_by: {
          retweeter: user,
          tweet: tweet,
        },
      });

      retweetTweet.save();

      const updatedTweets = await tweetModel
        .find({
          "retweeted_by.tweet": tweet,
        })
        .populate("replies")
        .populate("replied_to");
      const updatedTweet = await tweetModel
        .findById(tweet)
        .populate("replies")
        .populate("replied_to");

      updatedTweets.push(updatedTweet);
    } else if (!retweet) {
      const destroyRetweet = await tweetModel.findOneAndDelete({
        "retweeted_by.retweeter": user,
        "retweeted_by.tweet": tweet,
      });
      const updatedTweets = await tweetModel
        .find({
          "retweeted_by.tweet": tweet,
        })
        .populate("replies")
        .populate("replied_to");

      const updatedTweet = await tweetModel
        .findById(tweet)
        .populate("replies")
        .populate("replied_to");

      updatedTweets.push(updatedTweet);
    }
    // pusher.trigger("tweetPosts", "update", {});
    const events = [
      {
        channel: "tweetPosts",
        name: "update",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateShow",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateReplies",
        data: {},
      },
    ];
    pusher.triggerBatch(events);

    res.status(201).json({ body: req.body });
  } catch (error) {
    console.log(error);
  }
};

export const replyTweet = async (req, res) => {
  const { tweeter, text, image, replyToTweet } = req.body;
  try {
    if (!text && !image) {
      return res
        .status(400)
        .json({ error: "Unsuccessfully posted a tweet: No text and image." });
    }
    const newTweet = new tweetModel({
      tweeter: tweeter,
      text: text,
      image: {
        url: "",
        filename: "",
      },
    });

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: `twitterclone/${tweeter}/tweets`,
      });
      newTweet.image.url = uploadResponse.url;
      newTweet.image.filename = uploadResponse.public_id;
    }

    if (replyToTweet) {
      newTweet.replied_to = replyToTweet;
      const findReplyToTweet = await tweetModel
        .findById(replyToTweet)
        .populate("replies", ["-password", "-refresh_token"])
        .populate("replied_to", ["-password", "-refresh_token"]);

      findReplyToTweet.replies.push({ tweet: newTweet._id, user: tweeter._id });
      await tweetModel.findByIdAndUpdate(replyToTweet, {
        replies: findReplyToTweet.replies,
      });
    }

    await newTweet.save();

    const findRetweets = await tweetModel.find({
      "retweeted_by.tweet": replyToTweet,
    });

    findRetweets.forEach(async (tweet) => {
      tweet.replies.push({ tweet: newTweet, user: tweeter });
      await tweetModel.findByIdAndUpdate(tweet._id, {
        replies: tweet.replies,
      });
    });

    // pusher.trigger("tweetPosts", "update", {});
    const events = [
      {
        channel: "tweetPosts",
        name: "update",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateShow",
        data: {},
      },
      {
        channel: "tweetPosts",
        name: "updateReplies",
        data: {},
      },
    ];
    pusher.triggerBatch(events);

    res.status(201).json({ message: "Successfully replied a tweet." });
  } catch (error) {
    console.log(error);
  }
};
