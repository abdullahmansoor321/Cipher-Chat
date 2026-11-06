import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 123456 => $dnjasdkasj_?dmsakmk
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // before CR:
      // generateToken(newUser._id, res);
      // await newUser.save();

      // after CR:
      // Persist user first, then issue auth cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // never tell the client which one is incorrect: password or email
    if (!user.password) {
    return res.status(400).json({
      message: "This account uses Google sign-in",
    });
  }  

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    // 1. Make sure Google sent us a token
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // 2. Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    // 3. Read the verified user's information
    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email || !payload.email_verified) {
      return res.status(401).json({ message: "Invalid Google account" });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const fullName = payload.name || email.split("@")[0];
    const profilePic = payload.picture || "";

    // 4. Check whether this Google account already exists
    let user = await User.findOne({ googleId });

    // 5. If not, check whether this email belongs to another account
    if (!user) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: "An account with this email already exists. Please log in with your password.",
        });
      }

      // 6. Create a new Google user
      user = await User.create({
        googleId,
        email,
        fullName,
        profilePic,
      });
    }

    // 7. Issue our existing Cipher-Chat JWT cookie
    generateToken(user._id, res);

    // 8. Send user information to React
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in Google auth:", error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
};


export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
