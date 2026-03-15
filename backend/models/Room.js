import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Room name is required"],
    trim: true,
    maxlength: [50, "Room name max 50 characters"],
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  maxMembers: {
    type: Number,
    default: 10,
    min: 2,
    max: 50,
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  }],
  currentVideo: {
    videoId:   { type: String, default: "" },
    title:     { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    isPlaying: { type: Boolean, default: false },
    timestamp: { type: Number, default: 0 },
    lastSyncAt:{ type: Date, default: Date.now },
  },
  queue: [{
    videoId:   { type: String, required: true },
    title:     { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    addedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    votes:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    addedAt:   { type: Date, default: Date.now },
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);