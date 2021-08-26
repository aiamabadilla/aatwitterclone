import jwt from "jsonwebtoken";

export const createAccessToken = (userid) => {
  return jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userid) => {
  return jwt.sign({ userid }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// export const sendRefreshToken = (res, refreshtoken) => {
//   res.cookie("refreshtoken", refreshtoken, {
//     httpOnly: true,
//     path: "/api/tokens/refresh",
//   });
// };

export const sendAccessToken = (res, accesstoken, user) => {
  return res.status(200).send({
    accesstoken,
    user,
  });
};

export const sendTokens = (res, refreshtoken, accesstoken, user) => {
  return res.status(200).send({
    refreshtoken,
    accesstoken,
    user,
  });
};
