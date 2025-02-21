import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  setUsername,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Auth API!");
});
router.get("/check-auth", verifyToken, checkAuth);
router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/set-username", verifyToken, setUsername);

export default router;
