import Message from "../models/Message.js";
import Room from "../models/Room.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// In-memory room state (persists while server is alive)
const roomHosts = new Map(); // roomCode -> socket.id of host

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
      socket.data.roomCode = roomCode; // store for disconnect

      await User.findByIdAndUpdate(socket.user._id, { isOnline: true });

      // First person in room becomes host
      const roomSockets = await io.in(roomCode).fetchSockets();
      if (roomSockets.length === 1) {
        roomHosts.set(roomCode, socket.id);
        socket.emit("host-status", { isHost: true });
      } else {
        socket.emit("host-status", { isHost: false });
      }

      socket.to(roomCode).emit("user-joined", {
        user: {
          id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
      });

      io.to(roomCode).emit("system-message", {
        text: `${socket.user.username} joined the room`,
        time: new Date(),
      });
    });

    // ── CHAT MESSAGE ──
    socket.on("send-message", async ({ roomCode, text }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() });
if (!room) {
  console.error(`Room not found for code: ${roomCode}`);
  return;
}

        const message = await Message.create({
          room: room._id,
          user: socket.user._id,
          text,
        });

        await message.populate("user", "username avatar");

        // ✅ io.to sends to ALL users including sender
        io.to(roomCode).emit("new-message", {
          id: message._id,
          user: message.user.username,
          initial: message.user.username[0].toUpperCase(),
          color: message.user.avatar?.color,
          text: message.text,
          time: message.createdAt,
        });
      } catch (err) {
        console.error("Message error:", err);
      }
    });

    // ── VIDEO SYNC (host only) ──
    socket.on("video-change", ({ roomCode, videoId }) => {
  const host = roomHosts.get(roomCode);
  // Allow if host, OR if no host assigned yet (first video)
  if (host && host !== socket.id) return;
  // If no host yet, assign this socket as host
  if (!host) {
    roomHosts.set(roomCode, socket.id);
    socket.emit("host-status", { isHost: true });
  }
  io.to(roomCode).emit("video-change", { videoId });
});
    socket.on("video-play", ({ roomCode, timestamp }) => {
      if (roomHosts.get(roomCode) !== socket.id) return;
      // socket.to so host doesn't double-trigger
      socket.to(roomCode).emit("video-play", { timestamp });
    });

    socket.on("video-pause", ({ roomCode, timestamp }) => {
      if (roomHosts.get(roomCode) !== socket.id) return;
      socket.to(roomCode).emit("video-pause", { timestamp });
    });

    socket.on("video-seek", ({ roomCode, timestamp }) => {
      if (roomHosts.get(roomCode) !== socket.id) return;
      socket.to(roomCode).emit("video-seek", { timestamp });
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
      handleHostTransfer(io, socket, roomCode);
    });

    // ── DISCONNECT ──
    socket.on("disconnect", async () => {
      console.log(`❌ Disconnected: ${socket.user?.username}`);
      await User.findByIdAndUpdate(socket.user?._id, {
        isOnline: false,
        lastSeen: Date.now(),
      });

      const roomCode = socket.data.roomCode;
      if (roomCode) handleHostTransfer(io, socket, roomCode);
    });
  });
};

// Transfer host if current host leaves
async function handleHostTransfer(io, socket, roomCode) {
  if (roomHosts.get(roomCode) !== socket.id) return;

  const remaining = await io.in(roomCode).fetchSockets();
  if (remaining.length === 0) {
    roomHosts.delete(roomCode);
    return;
  }

  const newHost = remaining[0];
  roomHosts.set(roomCode, newHost.id);
  newHost.emit("host-status", { isHost: true });
  io.to(roomCode).emit("system-message", {
    text: `${newHost.data?.username || "Someone"} is now the host`,
    time: new Date(),
  });
}