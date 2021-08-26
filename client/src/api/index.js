import axios from "axios";

const url = "https://aatwitterclone.herokuapp.com/api";
// const url = "http://localhost:8000/api";

// USER API ROUTES

// get users
// followers list
// following list
// likes list
// reply list
// retweet list
// searching?

// get user
// from followers list
// from following list
// from likes list
// from reply list
// from retweet list
// from searching?

// check username availability
export const checkUserAvailability = (username) =>
  axios.get(`${url}/users/available/${username}`);
// register user
export const registerUser = (data) => axios.post(`${url}/users/register`, data);
// login user
export const loginUser = (data) =>
  axios.post(`${url}/users/login`, data, { withCredentials: true });
// logout user
export const logoutUser = () =>
  axios.post(`${url}/users/logout`, null, { withCredentials: true });
// continously checking authorization
export const checkRefreshToken = (token) =>
  axios.post(`${url}/tokens/refresh`, token, { withCredentials: true });
// get user
export const getUser = (username) => axios.get(`${url}/users/${username}`);
// get users
export const getUsers = (data) => axios.post(`${url}/users`, data);
// editing user and settings
export const patchUser = (data) =>
  axios.patch(`${url}/users/${data.username}`, data);
// delete user

// TWEET API ROUTES
// heart tweet
export const heartTweet = (data) =>
  axios.patch(`${url}/tweets/${data.user}/${data.tweet}/heart`, data);
// retweet tweet
export const retweetTweet = (data) =>
  axios.patch(`${url}/tweets/${data.user}/${data.tweet}/retweet`, data);
// reply to tweet
export const replyPostTweet = (data) =>
  axios.patch(
    `${url}/tweets/${data.tweeter._id}/${data.replyToTweet}/reply`,
    data
  );
// get tweet replies
export const getTweetReplies = (tweet) =>
  axios.get(`${url}/tweets/${tweet}/replies`);
// get tweets
export const getTweets = () => axios.get(`${url}/tweets`);
// get tweet
export const getTweet = (tweetid) => axios.get(`${url}/tweets/${tweetid}`);
// post tweet
export const postTweet = (data) => axios.post(`${url}/tweets`, data);
// patch tweet
export const patchTweet = (data) =>
  axios.patch(`${url}/tweets/${data.tweet._id}`, data);
// delete tweet
export const deleteTweet = (tweetid) =>
  axios.delete(`${url}/tweets/${tweetid}`);
