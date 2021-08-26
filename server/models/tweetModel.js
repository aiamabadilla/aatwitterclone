import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    maxLength: 200,
  },
  image: {
    url: String,
    filename: String,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  edited_on: {
    type: Date,
    default: Date.now,
  },
  hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweet" }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweet" }],
  tweeter: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  replied_to: { type: mongoose.Schema.Types.ObjectId, ref: "tweet" },
  replies: [
    {
      tweet: { type: mongoose.Schema.Types.ObjectId, ref: "tweet" },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
  ],
  retweeted_by: {
    retweeter: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: "tweet" },
  },
});

const Tweet = mongoose.model("tweet", tweetSchema);
export default Tweet;
