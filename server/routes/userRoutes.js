import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  checkUserAvailability,
  getUser,
  getUsers,
  patchUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/available/:username", checkUserAvailability);
router.get("/:username", getUser);
router.post("/", getUsers);
router.patch("/:username", patchUser);

export default router;
