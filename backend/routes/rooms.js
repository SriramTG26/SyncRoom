import express from "express";
import Room from "../models/Room.js";
import Message from "../models/Message.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// @POST /api/rooms/create
router.post("/create", protect, async (req, res) => {
  try {
    const { name, type, maxMembers, code } = req.body;

    const existing = await Room.findOne({ code });
    if (existing) {
      return res.status(400).json({
        success: false, message: "Room code already exists",
      });
    }

    const room = await Room.create({
      name, type, maxMembers, code,
      host: req.user._id,
      members: [{ user: req.user._id }],
    });

    await room.populate("host", "username avatar");

    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/rooms/join
router.post("/join", protect, async (req, res) => {
  try {
    const { code } = req.body;

    const room = await Room.findOne({ code: code.toUpperCase(), isActive: true })
      .populate("host", "username avatar")
      .populate("members.user", "username avatar isOnline");

    if (!room) {
      return res.status(404).json({
        success: false, message: "Room not found",
      });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({
        success: false, message: "Room is full",
      });
    }

    const alreadyMember = room.members.find(
      m => m.user._id.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      room.members.push({ user: req.user._id });
      await room.save();
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/rooms/:code
router.get("/:code", protect, async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code })
      .populate("host", "username avatar")
      .populate("members.user", "username avatar isOnline")
      .populate("queue.addedBy", "username");

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/rooms/:code/messages
router.get("/:code/messages", protect, async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const messages = await Message.find({ room: room._id })
      .populate("user", "username avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;