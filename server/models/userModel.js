import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  protected: {
    type: Boolean,
    required: true,
    default: false,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  followers_count: {
    type: Number,
    required: true,
    default: 0,
  },
  following_count: {
    type: Number,
    required: true,
    default: 0,
  },
  created_on: {
    type: Date,
    default: new Date(),
  },
  bio: {
    type: String,
    maxLength: 200,
    default: "",
  },
  avatar: {
    url: { type: String, default: "" },
    filename: { type: String, default: "" },
  },
  banner: {
    url: { type: String, default: "" },
    filename: { type: String, default: "" },
  },
  refresh_token: String,
  birthday: Date,
  retweets: [{ type: mongoose.Types.ObjectId, ref: "tweet" }],
  hearts: [{ type: mongoose.Types.ObjectId, ref: "tweet" }],
});

const User = mongoose.model("user", userSchema);
export default User;
