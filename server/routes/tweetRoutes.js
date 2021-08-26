import express from "express";

import {
  postTweet,
  getTweets,
  getTweet,
  getTweetReplies,
  deleteTweet,
  patchTweet,
  heartTweet,
  retweetTweet,
  replyTweet,
} from "../controllers/tweetControllers.js";

const router = express.Router();

router.post("/", postTweet);
router.get("/", getTweets);
router.get("/:id/replies", getTweetReplies);
router.get("/:id", getTweet);
router.delete("/:id", deleteTweet);
router.patch("/:id", patchTweet);
router.patch("/:userid/:tweetid/heart", heartTweet);
router.patch("/:userid/:tweetid/retweet", retweetTweet);
router.patch("/:userid/:tweetid/reply", replyTweet);
export default router;
