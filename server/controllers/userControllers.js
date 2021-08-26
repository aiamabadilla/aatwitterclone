import Pusher from "pusher";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: process.env.PUSHER_USETLS,
});

import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  // sendRefreshToken,
  sendTokens,
} from "../utils/token.js";

import userModel from "../models/userModel.js";
import tweetModel from "../models/tweetModel.js";

export const patchUser = async (req, res) => {
  const {
    followers_count,
    following_count,
    name,
    username,
    verified,
    _id,
    bio,
    birthday,
    avatar,
    banner,
    newBanner,
    newAvatar,
  } = req.body;
  // req.body.protected;
  try {
    if (!_id) {
      res.status(400).json({ message: "Invalid user id." });
    }

    if (newBanner) {
      if (banner.filename !== "") {
        await cloudinary.uploader.destroy(banner.filename);
      }
      const uploadResponse = await cloudinary.uploader.upload(newBanner, {
        folder: `twitterclone/${_id}`,
      });
      banner.url = uploadResponse.url;
      banner.filename = uploadResponse.public_id;
    }

    if (newAvatar) {
      if (avatar.filename !== "") {
        await cloudinary.uploader.destroy(avatar.filename);
      }
      const uploadResponse = await cloudinary.uploader.upload(newAvatar, {
        folder: `twitterclone/${_id}`,
      });
      avatar.url = uploadResponse.url;
      avatar.filename = uploadResponse.public_id;
    }

    await userModel.findByIdAndUpdate(_id, {
      banner: banner,
      avatar: avatar,
      name: name,
      bio: bio,
      birthday: birthday,
    });

    const findUser = await userModel.findOne({ _id: _id });

    res.status(201).json(findUser);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const findUser = await userModel
      .findOne({ username: username })
      .select(["-password", "-refresh_token"]);

    if (!findUser) {
      res.status(200).json({});
    }

    res.status(201).json(findUser);
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (req, res) => {
  const { search } = req.body;
  try {
    const findUsers = await userModel
      .find({ name: search })
      .select(["-password", "-refresh_token"]);

    return res.status(200).json(findUsers);
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (req, res) => {
  const { name, username, password, vPassword, birthday } = req.body;
  try {
    if (!name || !username || !password || !vPassword) {
      return res.status(400).json({ message: "All fields must be entered." });
    }
    const checkUser = await userModel.findOne({ username: username });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "User with this username already exists." });
    }
    if (password !== vPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      username,
      password: hashedPassword,
      birthday: birthday,
    });
    await newUser.save();
    return res.status(201).json({ message: "User was successfully created." });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(201).json({ accesstoken: "" });
    }

    const checkUser = await userModel.findOne({ username: username });
    if (!checkUser) {
      return res.status(201).json({ accesstoken: "" });
    }

    const validatedPassword = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!validatedPassword) {
      return res.status(201).json({ accesstoken: "" });
    }

    const accesstoken = createAccessToken(checkUser._id);
    const refreshtoken = createRefreshToken(checkUser._id);

    const updateUser = await userModel
      .findByIdAndUpdate(checkUser._id, {
        refresh_token: refreshtoken,
      })
      .select(["-password", "-refresh_token"]);

    // sendRefreshToken(res, refreshtoken);
    // sendAccessToken(res, accesstoken, updateUser);
    sendTokens(res, refreshtoken, accesstoken, updateUser);
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async (req, res) => {
  // res.clearCookie("refreshtoken", {
  //   path: "/api/tokens/refresh",
  // });

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

  return res.status(200).json(validUser);
};

export const checkUserAvailability = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) {
      return res
        .status(400)
        .json({ message: "Unsuccessful in getting user. No username." });
    }
    const checkUser = await userModel.findOne({ username: username });
    if (!checkUser) {
      return res.status(201).json({ available: true });
    }
    res.status(201).json({ available: false });
  } catch (error) {
    console.log(error);
  }
};
