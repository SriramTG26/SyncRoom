import Message from "../models/Message.js";
import Room from "../models/Room.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const initSocket = (io) => {

  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Connected: ${socket.user?.username}`);

    // ── JOIN ROOM ──
    socket.on("join-room", async ({ roomCode }) => {
      socket.join(roomCode);
      await User.findByIdAndUpdate(socket.user._id, { isOnline: true });

      socket.to(roomCode).emit("user-joined", {
        user: {
          id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
      });

      // Send system message
      io.to(roomCode).emit("system-message", {
        text: `${socket.user.username} joined the room`,
        time: new Date(),
      });
    });

    // ── CHAT MESSAGE ──
    socket.on("send-message", async ({ roomCode, text }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const message = await Message.create({
          room: room._id,
          user: socket.user._id,
          text,
        });

        await message.populate("user", "username avatar");

        io.to(roomCode).emit("new-message", {
          id: message._id,
          user: message.user.username,
          initial: message.user.username[0].toUpperCase(),
          color: message.user.avatar.color,
          text: message.text,
          time: message.createdAt,
        });
      } catch (err) {
        console.error("Message error:", err);
      }
    });

    // ── VIDEO SYNC ──
    socket.on("video-play", ({ roomCode, timestamp }) => {
      socket.to(roomCode).emit("video-play", { timestamp });
    });

    socket.on("video-pause", ({ roomCode, timestamp }) => {
      socket.to(roomCode).emit("video-pause", { timestamp });
    });

    socket.on("video-seek", ({ roomCode, timestamp }) => {
      socket.to(roomCode).emit("video-seek", { timestamp });
    });

    socket.on("video-change", ({ roomCode, videoId }) => {
  // ✅ io.to broadcasts to ALL users in room including sender
  io.to(roomCode).emit("video-change", { videoId });
});// ── Video seek — syncs timestamp for ALL users ──
socket.on("video-seek", ({ roomCode, timestamp }) => {
  socket.to(roomCode).emit("video-seek", { timestamp });
});

// ── Video play sync ──
socket.on("video-play", ({ roomCode, timestamp }) => {
  socket.to(roomCode).emit("video-play", { timestamp });
});

// ── Video pause sync ──
socket.on("video-pause", ({ roomCode, timestamp }) => {
  socket.to(roomCode).emit("video-pause", { timestamp });
});

    // ── QUEUE ──
    socket.on("queue-add", ({ roomCode, video }) => {
      io.to(roomCode).emit("queue-add", {
        ...video,
        addedBy: socket.user.username,
      });
    });

    socket.on("queue-vote", ({ roomCode, videoId }) => {
      io.to(roomCode).emit("queue-vote", {
        videoId,
        userId: socket.user._id,
        username: socket.user.username,
      });
    });

    // ── TYPING ──
    socket.on("typing-start", ({ roomCode }) => {
      socket.to(roomCode).emit("user-typing", {
        username: socket.user.username,
      });
    });

    socket.on("typing-stop", ({ roomCode }) => {
      socket.to(roomCode).emit("user-stop-typing", {
        username: socket.user.username,
      });
    });

    // ── LEAVE ROOM ──
    socket.on("leave-room", async ({ roomCode }) => {
      socket.leave(roomCode);
      socket.to(roomCode).emit("user-left", {
        username: socket.user.username,
      });
      io.to(roomCode).emit("system-message", {
        text: `${socket.user.username} left the room`,
        time: new Date(),
      });
    });

    // ── DISCONNECT ──
    socket.on("disconnect", async () => {
      console.log(`❌ Disconnected: ${socket.user?.username}`);
      await User.findByIdAndUpdate(socket.user?._id, {
        isOnline: false,
        lastSeen: Date.now(),
      });
    });
  });
};