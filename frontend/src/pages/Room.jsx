import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ChevronUp, X, Copy, Check, MessageCircle,
  Palette, MessageSquare, Play, Share2, LogOut,
  Plus, Send, Smile, Users, Wifi, WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import YouTube from 'react-youtube';
import { searchYouTube, getVideoTitle } from '../services/api';
import EmojiPicker from 'emoji-picker-react';
const COLORS = {
  bg:       "#08050f",
  surface:  "#0e0a1c",
  elevated: "#130e24",
  border:   "rgba(124,58,237,0.16)",
  purple:   "#7c3aed",
  glow:     "rgba(124,58,237,0.3)",
  cyan:     "#22d3ee",
  text:     "#e2d9f3",
  muted:    "rgba(226,217,243,0.42)",
  dim:      "rgba(226,217,243,0.2)",
};

export default function Room() {
  const navigate   = useNavigate();
const chatEndRef = useRef(null);
const playerRef  = useRef(null);

  // ── room state ──
  const [videoId,      setVideoId]      = useState('');
  const [urlInput,     setUrlInput]     = useState('');
  const [chatInput,    setChatInput]    = useState('');
  const [messages,     setMessages]     = useState([]);
  const [queue,        setQueue]        = useState([]);
  const [votes,        setVotes]        = useState(new Set());
  const [roomCode,     setRoomCode]     = useState('');
  const [copied,       setCopied]       = useState(false);
  const [showInvite,   setShowInvite]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab,  setSettingsTab]  = useState('theme');
  const [accent,       setAccent]       = useState('purple');
  const [members,      setMembers]      = useState([]);
  const [connected,    setConnected]    = useState(false);
  const [isTyping,     setIsTyping]     = useState([]);
  const typingTimer = useRef(null);
  const [isHost, setIsHost] = useState(false);
const isSyncingRef = useRef(false);
  const [searchResults,  setSearchResults]  = useState([]);
const [searching,      setSearching]      = useState(false);
const [showSearch,     setShowSearch]     = useState(false);
const searchRef = useRef(null);
const [showEmoji, setShowEmoji] = useState(false);
const emojiRef = useRef(null);
  // ── current user ──
  const currentUser = (() => {
  try { return JSON.parse(localStorage.getItem("user")) || {}; }
  catch { return {}; }
})();

  const accentHex = {
    purple:'#7c3aed', cyan:'#22d3ee',
    amber:'#f59e0b',  green:'#10b981',
  }[accent];

  // ── Load room + connect socket ──
  useEffect(() => {
    const stored = localStorage.getItem("currentRoom");
    if (stored) {
      try {
        const room = JSON.parse(stored);
        setRoomCode(room.code || '');
        if (room.currentVideo?.videoId) setVideoId(room.currentVideo.videoId);
        if (room.members) {
          setMembers([{
  id:      currentUser._id || currentUser.id || "me",
  name:    currentUser.username || "You",
  initial: (currentUser.username || "Y")[0].toUpperCase(),
  color:   currentUser.avatar?.color || "#7c3aed",
  status:  "watching",
  isHost:  true,
}]);
        }

        // Connect socket
        const token = localStorage.getItem("token");
        if (token && room.code) {
          const socket = connectSocket(token);

const doJoin = () => {
  setConnected(true);
  socket.emit("join-room", { roomCode: room.code });
};

// If already connected, join immediately
if (socket.connected) {
  doJoin();
} else {
  socket.on("connect", doJoin);
}
          socket.on("disconnect", () => setConnected(false));

          // ── Chat ──
          socket.on("new-message", (msg) => {
            setMessages(prev => [...prev, {
              id:      msg.id || Date.now(),
              user:    msg.user,
              initial: msg.initial || msg.user[0].toUpperCase(),
              color:   msg.color || "#7c3aed",
              text:    msg.text,
              time:    new Date(msg.time).toLocaleTimeString('en', {
                hour:'2-digit', minute:'2-digit',
              }),
            }]);
          });

          // ── System messages ──
          socket.on("system-message", (data) => {
            setMessages(prev => [...prev, {
              id:      Date.now(),
              user:    "System",
              initial: "S",
              color:   "#6b7280",
              text:    data.text,
              time:    new Date(data.time).toLocaleTimeString('en', {
                hour:'2-digit', minute:'2-digit',
              }),
              isSystem: true,
            }]);
          });

          // ── Members ──
          socket.on("user-joined", (data) => {
            setMembers(prev => {
              const exists = prev.find(m => m.id === data.user.id);
              if (exists) return prev;
              return [...prev, {
                id:      data.user.id,
                name:    data.user.username,
                initial: data.user.username[0].toUpperCase(),
                color:   data.user.avatar?.color || "#7c3aed",
                status:  "watching",
                isHost:  false,
              }];
            });
          });

          socket.on("user-left", (data) => {
            setMembers(prev => prev.filter(m => m.name !== data.username));
          });

          // ── Host status ──
socket.on("host-status", ({ isHost: hostStatus }) => {
  setIsHost(hostStatus);
});

// ── Video sync ──
socket.on("video-play", ({ timestamp }) => {
  if (!playerRef.current?.seekTo) return;
  isSyncingRef.current = true;
  playerRef.current.seekTo(timestamp, true);
  playerRef.current.playVideo();
  setTimeout(() => (isSyncingRef.current = false), 500);
});

socket.on("video-pause", ({ timestamp }) => {
  if (!playerRef.current?.seekTo) return;
  isSyncingRef.current = true;
  playerRef.current.seekTo(timestamp, true);
  playerRef.current.pauseVideo();
  setTimeout(() => (isSyncingRef.current = false), 500);
});

          socket.on("video-change", ({ videoId: vid }) => {
  if (vid) setVideoId(vid); // ✅ updates iframe for ALL users
});
          socket.on("video-seek", ({ timestamp }) => {
  if (!playerRef.current?.seekTo) return;
  isSyncingRef.current = true;
  playerRef.current.seekTo(timestamp, true);
  setTimeout(() => (isSyncingRef.current = false), 500);
});
          // ── Queue ──
          socket.on("queue-add", (video) => {
            setQueue(prev => {
              const exists = prev.find(v => v.vid === video.videoId);
              if (exists) return prev;
              return [...prev, {
                id:      Date.now(),
                vid:     video.videoId,
                title:   video.title || `Video (${video.videoId?.substring(0,8)}…)`,
                rank:    prev.length + 1,
                addedBy: video.addedBy,
              }];
            });
          });

          // ── Typing ──
          socket.on("user-typing", ({ username }) => {
            setIsTyping(prev => [...new Set([...prev, username])]);
          });

          socket.on("user-stop-typing", ({ username }) => {
            setIsTyping(prev => prev.filter(u => u !== username));
          });
        }
      } catch(e) { console.error(e); }
    }

    return () => {
      const socket = getSocket();
      const code   = (() => {
        try { return JSON.parse(localStorage.getItem("currentRoom"))?.code; }
        catch { return null; }
      })();
      if (socket && code) {
        socket.emit("leave-room", { roomCode: code });
      }
      disconnectSocket();
    };
  }, []);

 

// auto-scroll chat
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
}, [messages]);
  useEffect(() => {
  const handler = (e) => {
    if (emojiRef.current && !emojiRef.current.contains(e.target)) {
      setShowEmoji(false);
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

  // ── Handlers ──
  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const extractVideoId = (url) => {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : null;
  };
  // ── ADD THESE 3 FUNCTIONS RIGHT HERE ──

const parseTimestamp = (text) => {
  try {
    const match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    if (match[3] !== undefined) {
      return parseInt(match[1])*3600 + parseInt(match[2])*60 + parseInt(match[3]);
    }
    return parseInt(match[1])*60 + parseInt(match[2]);
  } catch {
    return null;
  }
};

const seekToTimestamp = (seconds) => {
  try {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
    const socket = getSocket();
    if (socket && roomCode) {
      socket.emit("video-seek", { roomCode, timestamp: seconds });
    }
  } catch(e) {
    console.error("Seek error:", e);
  }
};

const renderMessageText = (text) => {
  if (!text) return <span>{text}</span>;
  const timestampRegex = /\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let hasMatch = false;

  while ((match = timestampRegex.exec(text)) !== null) {
    hasMatch = true;
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    const ts = match[1];
    const seconds = parseTimestamp(ts);
    if (seconds !== null) {
      parts.push(
        <span
          key={`ts-${match.index}`}
          onClick={() => seekToTimestamp(seconds)}
          style={{
            display:"inline-flex", alignItems:"center", gap:3,
            color: COLORS.cyan,
            background: "rgba(34,211,238,0.12)",
            border: "1px solid rgba(34,211,238,0.25)",
            borderRadius: 5,
            padding: "1px 6px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: "0.04em",
            margin: "0 2px",
          }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(34,211,238,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(34,211,238,0.12)"}
        >
          ⏱ {ts}
        </span>
      );
    } else {
      parts.push(
        <span key={`ts-text-${match.index}`}>{ts}</span>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (!hasMatch) return <span>{text}</span>;

  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end">{text.slice(lastIndex)}</span>
    );
  }

  return <>{parts}</>;
};
  const onPlayerReady = (e) => {
  playerRef.current = e.target;
};

const onPlayerStateChange = (e) => {
  if (isSyncingRef.current) return;
  if (!isHost) return;
  const socket = getSocket();
  if (!socket || !roomCode) return;
  const timestamp = playerRef.current.getCurrentTime();
  if (e.data === window.YT.PlayerState.PLAYING) {
    socket.emit("video-play", { roomCode, timestamp });
  }
  if (e.data === window.YT.PlayerState.PAUSED) {
    socket.emit("video-pause", { roomCode, timestamp });
  }
};
  const handleSearch = async () => {
  const trimmed = urlInput.trim();
  if (!trimmed) return;
  const vid = extractVideoId(trimmed);
  if (vid) {
    await addToQueue(vid);
    setUrlInput('');
    setShowSearch(false);
    return;
  }
  setSearching(true);
  setShowSearch(true);
  const results = await searchYouTube(trimmed);
  setSearchResults(results);
  setSearching(false);
};

const addToQueue = async (vid, title) => {
  if (!vid) return;
  const realTitle = title || (await getVideoTitle(vid))?.title || `Video (${vid.substring(0,8)}…)`;
  // Only add to queue if a video is already playing
// First video plays directly, doesn't go to queue
if (videoId) {
  const newItem = {
    id:    Date.now(),
    vid,
    title: realTitle,
    rank:  queue.length + 1,
  };
  setQueue(prev => [...prev, newItem]);
}
  if (!videoId) {
  const socket = getSocket();
  if (socket && roomCode) {
    socket.emit("video-change", { roomCode, videoId: vid });
  } else {
    // Socket not ready yet, set locally as fallback
    setVideoId(vid);
  }
}
  setShowSearch(false);
  setSearchResults([]);
  setUrlInput('');
  const socket = getSocket();
  if (socket && roomCode) {
    socket.emit("queue-add", { roomCode, video: { videoId: vid, title: realTitle } });
  }
};

  const playNow = (vid) => {
  if (!isHost) return; // only host can change video
  // Don't setVideoId here — wait for echo back so all users sync
  const socket = getSocket();
  if (socket && roomCode) {
    socket.emit("video-change", { roomCode, videoId: vid });
  }
};

  const toggleVote = (id) => {
    setVotes(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const removeFromQueue = (id) => {
    setQueue(prev => prev.filter(v => v.id !== id).map((v,i) => ({...v, rank:i+1})));
  };

  const sendMsg = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const socket = getSocket();

    if (socket?.connected && roomCode) {
      // emit to server — server will broadcast back to all including sender
      socket.emit("send-message", { roomCode, text: trimmed });
    } else {
      // fallback: local only if socket not connected
      setMessages(prev => [...prev, {
        id:      Date.now(),
        user:    currentUser.username || "You",
        initial: (currentUser.username || "Y")[0].toUpperCase(),
        color:   accentHex,
        text:    trimmed,
        time:    new Date().toLocaleTimeString('en', {
          hour:'2-digit', minute:'2-digit',
        }),
      }]);
    }

    setChatInput('');

    // stop typing
    const socket2 = getSocket();
    if (socket2 && roomCode) {
      socket2.emit("typing-stop", { roomCode });
    }
  };

  const handleTyping = (e) => {
    setChatInput(e.target.value);
    const socket = getSocket();
    if (socket && roomCode) {
      socket.emit("typing-start", { roomCode });
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        socket.emit("typing-stop", { roomCode });
      }, 1500);
    }
  };

  const handleLeave = () => {
    const socket = getSocket();
    if (socket && roomCode) {
      socket.emit("leave-room", { roomCode });
    }
    disconnectSocket();
    navigate("/goodbye");
  };

  const onlineCount = members.length || 1;

  const Pill = ({ children, color=COLORS.dim, bg="rgba(255,255,255,0.04)", border="rgba(255,255,255,0.08)" }) => (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:bg, border:`1px solid ${border}`, fontSize:11, color, fontWeight:600 }}>
      {children}
    </div>
  );

  return (
    <div style={{ height:"100vh", width:"100%", display:"flex", flexDirection:"column", background:COLORS.bg, color:COLORS.text, fontFamily:"system-ui,sans-serif", overflow:"hidden" }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{ height:52, minHeight:52, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px", background:COLORS.surface, borderBottom:`1px solid ${COLORS.border}`, zIndex:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${COLORS.purple},${COLORS.cyan})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 12px ${COLORS.glow}` }}>
            <Play size={13} fill="white" color="white" style={{ marginLeft:2 }}/>
          </div>
          <span style={{ fontWeight:800, fontSize:15, letterSpacing:"-0.02em" }}>
            Sync<span style={{ color:"#a78bfa" }}>room</span>
          </span>

          {/* Connection status */}
          <div style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"3px 9px", borderRadius:20,
            background: connected ? "rgba(16,185,129,0.09)" : "rgba(244,63,94,0.09)",
            border:`1px solid ${connected ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`,
            fontSize:10, fontWeight:600,
            color: connected ? "#10b981" : "#f43f5e",
          }}>
            <motion.div
              style={{ width:5, height:5, borderRadius:"50%", background: connected?"#10b981":"#f43f5e" }}
              animate={{ opacity:[1,0.3,1] }}
              transition={{ duration:1.5, repeat:Infinity }}
            />
            {connected ? "Live" : "Connecting…"}
          </div>
        </div>

        {/* Room code */}
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:COLORS.muted }}>
          Room Code
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:8, background:"rgba(124,58,237,0.14)", border:"1px solid rgba(124,58,237,0.28)" }}>
            <span style={{ fontWeight:800, fontSize:13, color:"white", letterSpacing:"0.06em" }}>{roomCode || "------"}</span>
            <motion.button whileTap={{ scale:0.82 }} onClick={copyCode}
              style={{ background:"none", border:"none", cursor:"pointer", color:copied?COLORS.cyan:COLORS.muted, display:"flex" }}>
              {copied ? <Check size={12}/> : <Copy size={12}/>}
            </motion.button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
            onClick={() => setShowInvite(true)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, background:"rgba(124,58,237,0.14)", border:"1px solid rgba(124,58,237,0.28)", color:"white" }}>
            <Share2 size={12}/> Share
          </motion.button>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
            onClick={handleLeave}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:COLORS.muted }}>
            <LogOut size={12}/> Leave
          </motion.button>
        </div>
      </nav>

      {/* ══ BODY ══ */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* ── LEFT: Members ── */}
        <aside style={{ width:190, minWidth:190, display:"flex", flexDirection:"column", background:COLORS.surface, borderRight:`1px solid ${COLORS.border}` }}>
          <div style={{ padding:"12px 14px 8px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.15em", color:COLORS.dim, textTransform:"uppercase" }}>Members</span>
            <span style={{ fontSize:10, fontWeight:700, color:COLORS.cyan, padding:"2px 7px", borderRadius:10, background:"rgba(34,211,238,0.09)", border:"1px solid rgba(34,211,238,0.2)" }}>
              {onlineCount} online
            </span>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"0 6px 6px" }} className="no-scrollbar">
            {members.length === 0 ? (
              <div style={{ margin:"16px 8px", padding:"14px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px dashed rgba(255,255,255,0.08)", textAlign:"center", color:COLORS.dim, fontSize:11 }}>
                No members yet.<br/>Invite your squad!
              </div>
            ) : members.map(m => (
              <div key={m.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 8px", borderRadius:9, cursor:"default", transition:"background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                <div style={{ position:"relative" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"white" }}>
                    {m.initial}
                  </div>
                  <div style={{ position:"absolute", bottom:0, right:0, width:8, height:8, borderRadius:"50%", background: m.status==="offline" ? "#4b5563" : "#10b981", border:`1.5px solid ${COLORS.surface}` }}/>
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:m.status==="offline" ? COLORS.dim : COLORS.text }}>
                      {m.name}
                    </span>
                    {m.isHost && (
                      <span style={{ fontSize:8, fontWeight:800, color:accentHex, padding:"1px 5px", borderRadius:4, background:`${accentHex}22`, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                        HOST
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize:10, color:COLORS.dim, textTransform:"capitalize" }}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:"10px 8px", borderTop:`1px solid ${COLORS.border}`, display:"flex", flexDirection:"column", gap:6 }}>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => setShowInvite(true)}
              style={{ width:"100%", padding:"9px 0", borderRadius:9, background:`linear-gradient(135deg,${COLORS.purple},#4f46e5)`, boxShadow:`0 0 16px ${COLORS.glow}`, border:"none", cursor:"pointer", color:"white", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Plus size={12}/> Invite Friends
            </motion.button>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => setShowSettings(true)}
              style={{ width:"100%", padding:"8px 0", borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer", color:COLORS.muted, fontSize:11, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Palette size={12}/> Settings
            </motion.button>
          </div>
        </aside>

        {/* ── CENTRE: Video + Queue ── */}
        <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, background:COLORS.bg }}>

          {/* Sub-header */}
<div style={{ padding:"8px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${COLORS.border}`, background:COLORS.surface, position:"relative" }}>
  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
    <Pill color={COLORS.muted}>
      <Users size={11}/> {onlineCount} watching
    </Pill>
    <Pill color="#10b981" bg="rgba(16,185,129,0.08)" border="rgba(16,185,129,0.2)">
      <motion.div style={{ width:5, height:5, borderRadius:"50%", background:"#10b981" }}
        animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }}/>
      {connected ? "All Synced" : "Syncing…"}
    </Pill>
  </div>

  {/* Search bar */}
  <div ref={searchRef} style={{ flex:1, position:"relative" }}>
    <div style={{ display:"flex", alignItems:"center", gap:0 }}>
      <Search size={13} style={{ position:"absolute", left:11, color:COLORS.dim, pointerEvents:"none", zIndex:1 }}/>
      <input
        value={urlInput}
        onChange={e => { setUrlInput(e.target.value); if(!e.target.value) { setShowSearch(false); setSearchResults([]); }}}
        onKeyDown={e => e.key==="Enter" && handleSearch()}
        placeholder="Search YouTube or paste a URL…"
        style={{
          width:"100%", padding:"8px 110px 8px 32px",
          borderRadius:9, fontSize:12, color:"white", outline:"none",
          background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.08)",
          transition:"border 0.18s",
        }}
        onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
        onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"}
      />
      <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
        onClick={handleSearch}
        style={{
          position:"absolute", right:3,
          padding:"5px 13px", borderRadius:7,
          background:`linear-gradient(135deg,${COLORS.purple},#4f46e5)`,
          border:"none", cursor:"pointer",
          color:"white", fontSize:11, fontWeight:700,
          display:"flex", alignItems:"center", gap:5,
        }}>
        {searching ? "…" : <><Search size={11}/> Search</>}
      </motion.button>
    </div>

    {/* Search results dropdown */}
    <AnimatePresence>
      {showSearch && (
        <motion.div
          initial={{ opacity:0, y:6, scale:0.98 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:6, scale:0.98 }}
          transition={{ duration:0.15 }}
          style={{
            position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
            borderRadius:12, overflow:"hidden",
            background:COLORS.elevated,
            border:`1px solid ${COLORS.border}`,
            boxShadow:`0 16px 40px rgba(0,0,0,0.5)`,
            zIndex:50,
          }}>
          {/* header */}
          <div style={{ padding:"10px 14px 6px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", color:COLORS.dim, textTransform:"uppercase" }}>
              YouTube Results
            </span>
            <button onClick={()=>{ setShowSearch(false); setSearchResults([]); }}
              style={{ background:"none", border:"none", cursor:"pointer", color:COLORS.dim, display:"flex" }}>
              <X size={13}/>
            </button>
          </div>

          {searching ? (
            <div style={{ padding:"20px", textAlign:"center", color:COLORS.dim, fontSize:12 }}>
              Searching…
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ padding:"20px", textAlign:"center", color:COLORS.dim, fontSize:12 }}>
              No results found
            </div>
          ) : (
            <div style={{ maxHeight:320, overflowY:"auto" }} className="no-scrollbar">
              {searchResults.map((r, i) => (
                <motion.div key={r.videoId}
                  initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.04 }}
                  onClick={() => addToQueue(r.videoId, r.title)}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 14px", cursor:"pointer",
                    transition:"background 0.15s",
                    borderTop: i>0 ? `1px solid ${COLORS.border}` : "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  {/* thumbnail */}
                  <div style={{ width:80, height:48, borderRadius:7, overflow:"hidden", flexShrink:0, background:"#000" }}>
                    <img src={r.thumbnail} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt=""/>
                  </div>
                  {/* info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontSize:12, fontWeight:600, color:COLORS.text,
                      overflow:"hidden", textOverflow:"ellipsis",
                      display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
                      lineHeight:1.4,
                    }}>{r.title}</div>
                    <div style={{ fontSize:10, color:COLORS.dim, marginTop:3 }}>{r.channel}</div>
                  </div>
                  {/* add button */}
                  <motion.div whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
                    style={{
                      width:30, height:30, borderRadius:8, flexShrink:0,
                      background:`linear-gradient(135deg,${COLORS.purple},#4f46e5)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 0 10px ${COLORS.glow}`,
                    }}>
                    <Plus size={14} color="white"/>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>

          {/* Video — 72% */}
<div style={{ flex:"0 0 72%", padding:"12px 14px 8px", display:"flex", flexDirection:"column", minHeight:0 }}>
  <div style={{ flex:1, borderRadius:14, overflow:"hidden", background:"#000", border:`1px solid ${COLORS.border}`, boxShadow:`0 0 32px rgba(124,58,237,0.1)`, position:"relative" }}>
   {videoId ? (
  <YouTube
    videoId={videoId}
    style={{ width:"100%", height:"100%" }}
    iframeClassName="w-full h-full"
    onReady={onPlayerReady}
    onStateChange={onPlayerStateChange}
    opts={{
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        controls: isHost ? 1 : 0,
      },
    }}
  />
) : (
  <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:COLORS.dim }}>
    <div style={{ width:52, height:52, borderRadius:14, background:"rgba(124,58,237,0.12)", border:`1px dashed rgba(124,58,237,0.3)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Play size={20} color={COLORS.purple}/>
    </div>
    <div style={{ textAlign:"center" }}>
      <p style={{ fontSize:13, fontWeight:600, color:COLORS.muted, marginBottom:4 }}>No video playing</p>
      <p style={{ fontSize:11, color:COLORS.dim }}>Search YouTube above to get started</p>
    </div>
  </div>
)}
  </div>
</div>

          {/* Queue — 28% */}
<div style={{ flex:"0 0 28%", display:"flex", flexDirection:"column", padding:"0 14px 12px", minHeight:0 }}>
            <div style={{ flex:1, display:"flex", flexDirection:"column", borderRadius:12, overflow:"hidden", background:COLORS.surface, border:`1px solid ${COLORS.border}` }}>
              <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${COLORS.border}`, flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Play size={11} fill={accentHex} color={accentHex}/>
                  <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.14em", color:COLORS.dim, textTransform:"uppercase" }}>Up Next</span>
                  <span style={{ fontSize:10, fontWeight:700, color:accentHex, padding:"1px 7px", borderRadius:10, background:`${accentHex}18`, border:`1px solid ${accentHex}30` }}>
                    {queue.length}
                  </span>
                </div>
                {queue.length > 0 && <span style={{ fontSize:10, color:COLORS.dim }}>Click thumbnail to play now</span>}
              </div>

              <div style={{ flex:1, overflowY:"auto", padding:"6px 8px" }} className="no-scrollbar">
                {queue.length === 0 ? (
                  <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, color:COLORS.dim, padding:"16px 0" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"rgba(124,58,237,0.08)", border:`1px dashed rgba(124,58,237,0.25)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Plus size={16} color={COLORS.purple}/>
                    </div>
                    <p style={{ fontSize:11, color:COLORS.dim, textAlign:"center" }}>Queue is empty.<br/>Add a YouTube URL above.</p>
                  </div>
                ) : queue.map((v,i) => (
                  <motion.div key={v.id}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:i*0.05 }}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 8px", borderRadius:9, cursor:"pointer", transition:"background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.07)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    <div style={{ width:20, height:20, borderRadius:5, flexShrink:0, background:`${accentHex}1a`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:accentHex }}>
                      {v.rank}
                    </div>
                    <div onClick={() => playNow(v.vid)}
                      style={{ width:60, height:36, borderRadius:6, overflow:"hidden", background:"rgba(255,255,255,0.05)", flexShrink:0, cursor:"pointer", position:"relative" }}>
                      <img src={`https://img.youtube.com/vi/${v.vid}/mqdefault.jpg`}
                        style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.85 }} alt=""/>
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Play size={14} fill="white" color="white" style={{ opacity:0.9 }}/>
                      </div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:COLORS.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{v.title}</div>
                      {v.addedBy && <div style={{ fontSize:9, color:COLORS.dim, marginTop:2 }}>by {v.addedBy}</div>}
                    </div>
                    <motion.button whileTap={{ scale:0.82 }} onClick={() => toggleVote(v.id)}
                      style={{ width:28, height:28, borderRadius:7, flexShrink:0, background:votes.has(v.id)?`${accentHex}22`:"rgba(255,255,255,0.04)", border:`1px solid ${votes.has(v.id)?accentHex+"44":"rgba(255,255,255,0.07)"}`, cursor:"pointer", color:votes.has(v.id)?accentHex:COLORS.dim, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.18s" }}>
                      <ChevronUp size={14} strokeWidth={2.5}/>
                    </motion.button>
                    <motion.button whileTap={{ scale:0.82 }} onClick={() => removeFromQueue(v.id)}
                      style={{ width:22, height:22, borderRadius:5, flexShrink:0, background:"transparent", border:"none", cursor:"pointer", color:COLORS.dim, display:"flex", alignItems:"center", justifyContent:"center", transition:"color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color="#f43f5e"}
                      onMouseLeave={e => e.currentTarget.style.color=COLORS.dim}
                    >
                      <X size={12}/>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* ── RIGHT: Live Chat ── */}
        <aside style={{ width:290, minWidth:290, display:"flex", flexDirection:"column", background:COLORS.surface, borderLeft:`1px solid ${COLORS.border}` }}>
          <div style={{ padding:"13px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${COLORS.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <motion.div style={{ width:7, height:7, borderRadius:"50%", background:"#10b981" }}
                animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }}/>
              <span style={{ fontWeight:800, fontSize:13 }}>Live Chat</span>
            </div>
            <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:10, background:`${accentHex}18`, border:`1px solid ${accentHex}30`, color:accentHex }}>
              {messages.length}
            </span>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"10px 10px 6px", display:"flex", flexDirection:"column", gap:8 }} className="no-scrollbar">
            {messages.length === 0 ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, color:COLORS.dim }}>
                <MessageSquare size={22} style={{ opacity:0.3 }}/>
                <p style={{ fontSize:11, textAlign:"center" }}>No messages yet.<br/>Say something!</p>
              </div>
            ) : messages.map((msg, i) => (
              <motion.div key={msg.id}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.2 }}
                style={{ display:"flex", gap:8, alignItems:"flex-start" }}
              >
                {msg.isSystem ? (
                  <div style={{ width:"100%", textAlign:"center", fontSize:10, color:COLORS.dim, padding:"4px 8px", borderRadius:6, background:"rgba(255,255,255,0.03)" }}>
                    {msg.text}
                  </div>
                ) : (
                  <>
                    <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, background:msg.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"white" }}>
                      {msg.initial}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:3 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:msg.color }}>{msg.user}</span>
                        <span style={{ fontSize:9, color:COLORS.dim }}>{msg.time}</span>
                      </div>
                     <div style={{ padding:"7px 10px", borderRadius:"4px 10px 10px 10px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)", fontSize:12, color:COLORS.text, lineHeight:1.6, wordBreak:"break-word" }}>
  {renderMessageText(msg.text)}
</div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
            {/* Typing indicator */}
            {isTyping.length > 0 && (
              <div style={{ fontSize:10, color:COLORS.dim, fontStyle:"italic", paddingLeft:8 }}>
                {isTyping.join(", ")} {isTyping.length===1?"is":"are"} typing…
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>

          <div style={{ padding:"10px", borderTop:`1px solid ${COLORS.border}`, flexShrink:0, position:"relative" }}>

  {/* Emoji Picker */}
  <AnimatePresence>
    {showEmoji && (
      <motion.div
        ref={emojiRef}
        initial={{ opacity:0, y:8, scale:0.96 }}
        animate={{ opacity:1, y:0, scale:1 }}
        exit={{ opacity:0, y:8, scale:0.96 }}
        transition={{ duration:0.15 }}
        style={{
          position:"absolute", bottom:"calc(100% + 6px)", right:10,
          zIndex:100, borderRadius:12, overflow:"hidden",
          boxShadow:`0 16px 40px rgba(0,0,0,0.6)`,
          border:`1px solid ${COLORS.border}`,
        }}>
        <EmojiPicker
          onEmojiClick={(e) => {
            setChatInput(prev => prev + e.emoji);
            setShowEmoji(false);
          }}
          theme="dark"
          skinTonesDisabled
          height={380}
          width={300}
          previewConfig={{ showPreview: false }}
        />
      </motion.div>
    )}
  </AnimatePresence>

  <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 10px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
    <input
      value={chatInput}
      onChange={handleTyping}
      onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMsg()}
      placeholder="Message the room…"
      style={{ flex:1, background:"none", border:"none", outline:"none", color:"white", fontSize:12 }}
    />
    <motion.button
      whileHover={{ scale:1.1 }} whileTap={{ scale:0.82 }}
      onClick={() => setShowEmoji(v => !v)}
      style={{
        background:"none", border:"none", cursor:"pointer",
        color: showEmoji ? COLORS.cyan : COLORS.dim,
        display:"flex", transition:"color 0.15s",
      }}>
      <Smile size={15}/>
    </motion.button>
    <motion.button
      whileHover={{ scale:1.1 }} whileTap={{ scale:0.82 }}
      onClick={sendMsg}
      style={{ width:26, height:26, borderRadius:7, background:`linear-gradient(135deg,${COLORS.purple},#4f46e5)`, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 8px ${COLORS.glow}` }}>
      <Send size={11} color="white"/>
    </motion.button>
  </div>
</div>
        </aside>
      </div>

      {/* ══ INVITE MODAL ══ */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.78)", backdropFilter:"blur(10px)" }}>
            <motion.div initial={{ scale:0.88, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.88, y:24 }}
              transition={{ type:"spring", stiffness:300, damping:28 }}
              style={{ width:"100%", maxWidth:400, borderRadius:18, padding:26, position:"relative", background:COLORS.elevated, border:`1px solid ${COLORS.border}`, boxShadow:`0 0 60px rgba(124,58,237,0.18)` }}>
              <motion.button whileTap={{ scale:0.85 }} onClick={() => setShowInvite(false)}
                style={{ position:"absolute", top:14, right:14, background:"none", border:"none", cursor:"pointer", color:COLORS.dim, display:"flex" }}>
                <X size={16}/>
              </motion.button>
              <h2 style={{ fontSize:17, fontWeight:800, marginBottom:4 }}>
                Invite your <span style={{ color:"#a78bfa" }}>Squad</span>
              </h2>
              <p style={{ fontSize:11, color:COLORS.muted, marginBottom:18 }}>Share the code with your friends.</p>
              <div style={{ display:"flex", gap:7, marginBottom:10, padding:5, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <input readOnly value={`syncroom.app/join/${roomCode}`}
                  style={{ flex:1, background:"none", border:"none", outline:"none", fontSize:11, color:COLORS.muted, padding:"4px 8px", fontFamily:"monospace" }}/>
                <motion.button whileTap={{ scale:0.9 }} onClick={copyCode}
                  style={{ padding:"6px 13px", borderRadius:8, background:`linear-gradient(135deg,${COLORS.purple},#4f46e5)`, border:"none", cursor:"pointer", color:"white", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                  {copied?<Check size={12}/>:<Copy size={12}/>}
                  {copied?"Copied!":"Copy"}
                </motion.button>
              </div>
              <motion.button
  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
  onClick={() => {
    const msg = `Join my Syncroom watch party! Room code: ${roomCode} — ${window.location.origin}/room`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }}
  style={{ width:"100%", padding:"11px 0", borderRadius:10, background:"#25D366", border:"none", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
  <MessageCircle size={15}/> Share via WhatsApp
</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SETTINGS MODAL ══ */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.78)", backdropFilter:"blur(10px)" }}>
            <motion.div initial={{ scale:0.88, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.88, y:24 }}
              transition={{ type:"spring", stiffness:300, damping:28 }}
              style={{ width:"100%", maxWidth:460, borderRadius:18, overflow:"hidden", display:"flex", height:340, background:COLORS.elevated, border:`1px solid ${COLORS.border}`, boxShadow:`0 0 60px rgba(124,58,237,0.18)` }}>
              <div style={{ width:130, background:COLORS.surface, borderRight:`1px solid ${COLORS.border}`, padding:"16px 8px", display:"flex", flexDirection:"column", gap:3 }}>
                {[{id:"theme",icon:<Palette size={12}/>,label:"Theme"},{id:"chat",icon:<MessageSquare size={12}/>,label:"Chat"}].map(t=>(
                  <button key={t.id} onClick={() => setSettingsTab(t.id)}
                    style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 10px", borderRadius:8, border:"none", cursor:"pointer", background:settingsTab===t.id?`${accentHex}18`:"transparent", color:settingsTab===t.id?accentHex:COLORS.dim, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", transition:"all 0.15s" }}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>
              <div style={{ flex:1, padding:20, position:"relative", overflowY:"auto" }} className="no-scrollbar">
                <button onClick={() => setShowSettings(false)}
                  style={{ position:"absolute", top:14, right:14, background:"none", border:"none", cursor:"pointer", color:COLORS.dim, display:"flex" }}>
                  <X size={16}/>
                </button>
                {settingsTab==="theme" ? (
                  <div>
                    <h3 style={{ fontSize:15, fontWeight:800, marginBottom:14 }}>
                      Visual <span style={{ color:"#a78bfa" }}>Identity</span>
                    </h3>
                    <p style={{ fontSize:9, fontWeight:800, color:COLORS.dim, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>Accent Color</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                      {[{id:"purple",hex:"#7c3aed",label:"Purple"},{id:"cyan",hex:"#22d3ee",label:"Cyan"},{id:"amber",hex:"#f59e0b",label:"Amber"},{id:"green",hex:"#10b981",label:"Green"}].map(c=>(
                        <motion.button key={c.id} whileTap={{ scale:0.95 }} onClick={() => setAccent(c.id)}
                          style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 11px", borderRadius:9, cursor:"pointer", background:accent===c.id?`${c.hex}14`:"rgba(255,255,255,0.03)", border:`1.5px solid ${accent===c.id?c.hex:"rgba(255,255,255,0.07)"}`, color:"white", fontSize:11, fontWeight:600, transition:"all 0.18s" }}>
                          <div style={{ width:12, height:12, borderRadius:"50%", background:c.hex, flexShrink:0, boxShadow:accent===c.id?`0 0 7px ${c.hex}`:"" }}/>
                          {c.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize:15, fontWeight:800, marginBottom:14 }}>
                      Chat <span style={{ color:"#a78bfa" }}>Engine</span>
                    </h3>
                    {[{label:"Show Timestamps",on:true},{label:"Profanity Filter",on:false,disabled:true}].map(s=>(
                      <div key={s.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:9, marginBottom:7, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", opacity:s.disabled?0.4:1 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:COLORS.text, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</span>
                        <div style={{ width:30, height:16, borderRadius:8, position:"relative", background:s.on?`${accentHex}88`:"rgba(255,255,255,0.1)" }}>
                          <div style={{ width:10, height:10, borderRadius:"50%", background:"white", position:"absolute", top:3, left:s.on?16:3, transition:"left 0.2s" }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}