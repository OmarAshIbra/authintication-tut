import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    console.log(name);
    const [fname, ...lnameParts] = name.split(" ");
    const lname = lnameParts.join(" ");
    if (!lname || !fname) {
      throw new Error("Write Your Full Name");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const username = `${email.split("@")[0]}${Math.floor(
      Math.random() * 100000
    )}`
      .toLowerCase()
      .trim();
    const user = await User.create({
      fname,
      lname,
      email,
      username,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 60 minutes
    });
    // jwt token
    await user.save();

    generateTokenAndSetCookie(res, user._id);
    // send email verification email

    return res.status(201).json({
      success: true,
      message: "User created",
      user: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    console.log("Error in the Signup Function");
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = Date.now();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    console.log("Error in the Login Function");
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or Expired  verification code");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    const name = `${user.fname} ${user.lname}`;

    await sendWelcomeEmail(user.email, name);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("Error in the Verify Email Function");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    // Generate a Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // send Reset Password Email
    await sendForgotPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    return res.status(200).json({
      success: true,
      message: "Reset Password Email sent successfully",
    });
  } catch (error) {
    console.log("Error in the Forgot Password Function");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      throw new Error("All fields are required");
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or Expired reset token");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendPasswordResetEmail(user.email);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in the Reset Password Function");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in the Check Auth Function");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setUsername = async (req, res) => {
  const { username } = req.body;
  try {
    if (!username) {
      throw new Error("Username is required");
    }
    const usedUsername = await User.findOne({ username });
    if (usedUsername && usedUsername._id.toString() !== req.userId) {
      throw new Error("Username already taken");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.username = username;
    await user.save();
    sendVerificationEmail(user.email, user.verificationToken);

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    console.log("Error in the Update Username Function");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
