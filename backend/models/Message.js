import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, "Message max 500 characters"],
  },
  type: {
    type: String,
    enum: ["text", "system", "reaction"],
    default: "text",
  },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);