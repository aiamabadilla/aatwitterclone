import jwt from "jsonwebtoken";

import {
  createAccessToken,
  createRefreshToken,
  // sendRefreshToken,
} from "../utils/token.js";

import userModel from "../models/userModel.js";

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  // const token = req.cookies.refreshtoken;
  const validUser = {
    refreshtoken: "",
    accesstoken: "",
    user: {
      created_on: "",
      followers_count: 0,
      following_count: 0,
      name: "",
      protected: false,
      username: "",
      verified: false,
      _id: "",
      bio: "",
      birthday: "",
      avatar: { url: "", filename: "" },
      banner: { url: "", filename: "" },
      hearts: [],
      retweets: [],
    },
  };
  if (!token) {
    return res.send(validUser);
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.send(validUser);
  }
  const checkUser = await userModel.findOne({ _id: payload.userid });
  if (!checkUser) {
    return res.send(validUser);
  }
  if (checkUser.refresh_token !== token) {
    return res.send(validUser);
  }
  const accesstoken = createAccessToken(checkUser._id);
  const refreshtoken = createRefreshToken(checkUser._id);
  const updateUser = await userModel.findByIdAndUpdate(checkUser._id, {
    refresh_token: refreshtoken,
  });
  // sendRefreshToken(res, refreshtoken);
  return res.send({
    refreshtoken,
    accesstoken,
    user: {
      created_on: updateUser.created_on,
      followers_count: updateUser.followers_count,
      following_count: updateUser.following_count,
      name: updateUser.name,
      protected: updateUser.protected,
      username: updateUser.username,
      verified: updateUser.verified,
      _id: updateUser._id,
      bio: updateUser.bio,
      birthday: updateUser.birthday,
      avatar: updateUser.avatar,
      banner: updateUser.banner,
      hearts: updateUser.hearts,
      retweets: updateUser.retweets,
    },
  });
};
