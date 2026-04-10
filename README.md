# SyncRoom 🎬

**Watch YouTube videos together in real-time — perfectly synchronized.**

SyncRoom lets users create a room, invite friends, and watch any YouTube video in perfect sync. The host controls playback (play, pause, seek), and all guests stay in sync automatically — no lag, no manual refreshing.

🔗 **Live Demo:** [sync-room-xi.vercel.app](https://sync-room-xi.vercel.app)  
💻 **GitHub:** [github.com/SriramTG26/SyncRoom](https://github.com/SriramTG26/SyncRoom)

---

## Features

- 🔐 **JWT Authentication** — secure login/signup with token-based auth and bcrypt password hashing
- 🏠 **Room System** — create or join rooms via unique room codes
- 🎥 **Real-time Video Sync** — host controls play, pause, and seek; all guests sync instantly via Socket.io
- 👑 **Automatic Host Transfer** — if the host leaves, host role passes to the next user automatically
- 💬 **Live Chat** — real-time messaging with typing indicators and emoji picker
- 🗳️ **Video Queue & Voting** — users can add videos to a queue and vote on what plays next
- 🟢 **Online Presence** — see who's currently in the room and track user online/offline status
- ✨ **Polished UI** — animated landing page with Framer Motion, GSAP, and particle effects

---

## Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React 19 + Vite | UI framework |
| Tailwind CSS | Styling |
| Socket.io Client | Real-time communication |
| React YouTube | YouTube player integration |
| Framer Motion + GSAP | Animations |
| Axios | API calls |
| React Router v7 | Client-side routing |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express | REST API server |
| Socket.io | WebSocket real-time engine |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Authentication & password hashing |
| Express Validator | Input validation |

---

## How It Works

1. User signs up / logs in → receives a JWT token
2. Token is passed in Socket.io handshake for authenticated socket connections
3. User creates a room → gets a unique room code
4. First user to join becomes the **host**
5. Host plays/pauses/seeks a YouTube video → Socket.io broadcasts the event to all users in the room
6. If the host disconnects, the server automatically promotes the next connected user to host
7. All chat messages are persisted to MongoDB

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/SriramTG26/SyncRoom.git
cd SyncRoom

# Backend
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, PORT
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
SyncRoom/
├── backend/
│   ├── config/       # MongoDB connection
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # User, Room, Message schemas
│   ├── routes/       # Auth, room, user REST APIs
│   ├── socket/       # Socket.io event handlers
│   └── server.js
└── frontend/
    └── src/
        ├── components/   # ChatPanel, VideoPlayer, UserList, etc.
        ├── pages/        # Landing, Dashboard, Room, CreateRoom
        └── services/     # API calls & socket connection
```

---

## Author

**Sriram TG** — B.E CSE, Madras Institute of Technology, Chennai  
[LinkedIn][((https://www.linkedin.com/in/sriramtg))] · [GitHub](https://github.com/SriramTG26)
