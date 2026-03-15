import express from "express";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// @GET /api/users/search?q=username
router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, users: [] });

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { email:    { $regex: q, $options: "i" } },
      ],
      _id: { $ne: req.user._id },
    }).select("username email avatar isOnline").limit(10);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/users/profile/:username
router.get("/profile/:username", protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password -friendRequests");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;