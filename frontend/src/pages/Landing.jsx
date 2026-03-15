import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HorizontalFeatureScroll from "../components/HorizontalFeatureScroll";import {
  Play, Zap, ArrowRight, Users, MessageSquare,
  Lock, Music, Share2, Hash, LogIn,
  ChevronDown, Clock
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

// ── Marquee (used ONCE) ──
function Marquee({ items, direction = 1, speed = 35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.scrollWidth / 2;
    gsap.to(el, {
      x: direction > 0 ? -w : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(v => {
          const n = parseFloat(v);
          return direction > 0 ? n % w : ((-n) % w) * -1;
        })
      }
    });
    return () => gsap.killTweensOf(el);
  }, []);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div ref={ref} style={{ display: "flex", gap: 48, width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 48, flexShrink: 0 }}>
            <span style={{
              fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 900,
              letterSpacing: "-0.04em", whiteSpace: "nowrap",
              color: i % 4 < 2 ? "white" : "transparent",
              WebkitTextStroke: i % 4 < 2 ? "none" : "1.5px rgba(237,233,248,0.18)",
              fontFamily: "system-ui,sans-serif",
            }}>{item}</span>
            <motion.div
              style={{ width: 10, height: 10, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scroll reveal ──
function Rev({ children, y = 50, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Floating blob ──
function Blob({ size, color, x, y, duration = 8, delay = 0, shape = "circle" }) {
  return (
    <motion.div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size,
      borderRadius: shape === "circle" ? "50%" : shape === "squircle" ? "38%" : shape === "ring" ? "50%" : "28%",
      background: shape === "ring" ? "transparent" : color,
      border: shape === "ring" ? `${size * 0.12}px solid ${color}` : "none",
      boxShadow: `0 0 ${size * 0.5}px ${color}55`,
      pointerEvents: "none", zIndex: 0,
    }}
      animate={{ y: [0, -20, 8, -12, 0], x: [0, 10, -8, 6, 0], rotate: [0, 15, -10, 8, 0], scale: [1, 1.06, 0.96, 1.04, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }} />
  );
}

// ── Feature pill ──
function Pill({ text, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 200, damping: 16 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 18px", borderRadius: 12,
        background: color, color: "white",
        fontSize: 14, fontWeight: 800,
        boxShadow: `0 8px 30px ${color}66`,
        userSelect: "none",
      }}>{text}</motion.div>
  );
}

// ── Animated SVG Character ──
function WaveCharacter({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.7 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.3, type: "spring", stiffness: 120, damping: 18 }}
      style={{ position: "relative", width: 160, flexShrink: 0 }}>
      <svg viewBox="0 0 160 260" width={160} height={260} style={{ overflow: "visible" }}>
        {/* Shadow */}
        <ellipse cx="80" cy="252" rx="40" ry="8" fill="rgba(124,58,237,0.25)" />

        {/* Body */}
        <motion.ellipse cx="80" cy="180" rx="36" ry="44"
          fill="url(#bodyGrad)"
          animate={{ scaleY: [1, 1.02, 0.99, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />

        {/* Shirt detail */}
        <motion.ellipse cx="80" cy="185" rx="28" ry="35"
          fill="url(#shirtGrad)"
          animate={{ scaleY: [1, 1.02, 0.99, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />

        {/* Logo on shirt */}
        <motion.rect x="70" y="178" width="20" height="14" rx="4" fill="rgba(255,255,255,0.2)"
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
        <polygon points="74,182 74,189 81,185" fill="white" opacity="0.9" />

        {/* Left leg */}
        <motion.rect x="58" y="216" width="18" height="36" rx="9"
          fill="#5b21b6"
          animate={{ rotate: [-3, 3, -3] }}
          style={{ transformOrigin: "67px 216px" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
        {/* Left shoe */}
        <motion.ellipse cx="64" cy="251" rx="12" ry="7" fill="#1a0533"
          animate={{ rotate: [-3, 3, -3] }}
          style={{ transformOrigin: "67px 216px" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />

        {/* Right leg */}
        <motion.rect x="84" y="216" width="18" height="36" rx="9"
          fill="#5b21b6"
          animate={{ rotate: [3, -3, 3] }}
          style={{ transformOrigin: "93px 216px" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
        {/* Right shoe */}
        <motion.ellipse cx="96" cy="251" rx="12" ry="7" fill="#1a0533"
          animate={{ rotate: [3, -3, 3] }}
          style={{ transformOrigin: "93px 216px" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />

        {/* Left arm — pointing right */}
        <motion.g
          animate={{ rotate: [-10, -5, -10] }}
          style={{ transformOrigin: "52px 172px" }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="28" y="165" width="28" height="14" rx="7" fill="url(#bodyGrad)" />
          {/* Left hand */}
          <circle cx="25" cy="172" r="9" fill="url(#skinGrad)" />
        </motion.g>

        {/* Right arm — wave arm */}
        <motion.g
          animate={{ rotate: [0, -30, 0, -20, 0] }}
          style={{ transformOrigin: "108px 168px" }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="108" y="161" width="28" height="14" rx="7" fill="url(#bodyGrad)" transform="rotate(-30 122 168)" />
          {/* Right hand waving */}
          <motion.g
            animate={{ rotate: [0, 20, -10, 20, 0] }}
            style={{ transformOrigin: "136px 152px" }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}>
            <circle cx="136" cy="152" r="9" fill="url(#skinGrad)" />
            {/* Fingers */}
            <rect x="130" y="142" width="5" height="10" rx="2.5" fill="url(#skinGrad)" />
            <rect x="137" y="140" width="5" height="11" rx="2.5" fill="url(#skinGrad)" />
            <rect x="143" y="143" width="4" height="9" rx="2" fill="url(#skinGrad)" />
          </motion.g>
        </motion.g>

        {/* Neck */}
        <rect x="72" y="122" width="16" height="16" rx="6" fill="url(#skinGrad)" />

        {/* Head */}
        <motion.g
          animate={{ rotate: [-4, 4, -4] }}
          style={{ transformOrigin: "80px 100px" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          {/* Head shape */}
          <ellipse cx="80" cy="96" rx="32" ry="34" fill="url(#skinGrad)" />

          {/* Hair */}
          <ellipse cx="80" cy="66" rx="32" ry="12" fill="#1a0533" />
          <ellipse cx="80" cy="62" rx="28" ry="10" fill="#2d1b4e" />
          {/* Hair highlight */}
          <ellipse cx="70" cy="65" rx="10" ry="4" fill="#4c1d95" opacity="0.7" />

          {/* Eyes */}
          <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.5, 1] }}>
            <ellipse cx="68" cy="94" rx="6" ry="7" fill="white" />
            <ellipse cx="92" cy="94" rx="6" ry="7" fill="white" />
            <circle cx="69" cy="95" r="4" fill="#1a0533" />
            <circle cx="93" cy="95" r="4" fill="#1a0533" />
            <circle cx="71" cy="93" r="1.5" fill="white" />
            <circle cx="95" cy="93" r="1.5" fill="white" />
          </motion.g>

          {/* Eyebrows */}
          <path d="M62 85 Q68 82 74 85" stroke="#1a0533" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M86 85 Q92 82 98 85" stroke="#1a0533" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Big smile */}
          <motion.path
            d="M68 108 Q80 120 92 108"
            stroke="#1a0533" strokeWidth="2.5" fill="none" strokeLinecap="round"
            animate={{ d: ["M68 108 Q80 120 92 108", "M66 106 Q80 124 94 106", "M68 108 Q80 120 92 108"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />

          {/* Teeth */}
          <path d="M70 110 Q80 118 90 110 L88 114 Q80 120 72 114 Z" fill="white" opacity="0.8" />

          {/* Blush */}
          <ellipse cx="62" cy="103" rx="7" ry="4" fill="#f43f5e" opacity="0.25" />
          <ellipse cx="98" cy="103" rx="7" ry="4" fill="#f43f5e" opacity="0.25" />

          {/* Glasses */}
          <circle cx="68" cy="94" r="9" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.6" />
          <circle cx="92" cy="94" r="9" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.6" />
          <line x1="77" y1="94" x2="83" y2="94" stroke="#7c3aed" strokeWidth="2" opacity="0.6" />
          <line x1="59" y1="90" x2="56" y2="88" stroke="#7c3aed" strokeWidth="2" opacity="0.6" />
          <line x1="101" y1="90" x2="104" y2="88" stroke="#7c3aed" strokeWidth="2" opacity="0.6" />
        </motion.g>

        {/* Speech bubble */}
        <motion.g
          initial={{ opacity: 0, scale: 0, x: 0 }}
          animate={inView ? {
            opacity: [0, 1, 1, 1, 0],
            scale: [0.5, 1, 1, 1, 0.8],
          } : {}}
          transition={{ duration: 3, delay: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: "backOut" }}
          style={{ transformOrigin: "120px 50px" }}>
          <rect x="88" y="28" width="72" height="36" rx="12" fill="#7c3aed" />
          <polygon points="96,64 88,74 108,64" fill="#7c3aed" />
          <text x="124" y="44" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="system-ui">Click it!</text>
          <text x="124" y="56" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontFamily="system-ui">👇 Create room</text>
        </motion.g>

        {/* Gradients */}
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sparkle particles around character */}
      {[
        { x: -10, y: 40, delay: 0 },
        { x: 150, y: 60, delay: 0.5 },
        { x: 140, y: 180, delay: 1 },
        { x: -5, y: 160, delay: 1.5 },
      ].map((p, i) => (
        <motion.div key={i}
          style={{ position: "absolute", left: p.x, top: p.y, width: 8, height: 8, borderRadius: "50%", background: i % 2 === 0 ? "#a78bfa" : "#22d3ee" }}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, delay: p.delay, repeat: Infinity, repeatDelay: 1.5 }} />
      ))}
    </motion.div>
  );
}

// ── Animated count-up number ──
function CountUp({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const inc = end / 60;
    const t = setInterval(() => {
      start += inc;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 25);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{val}{suffix}</span>;
}
const FEATURES = [
  { icon: Zap, title: "Real-Time Sync", desc: "Every play, pause, seek — instantly broadcast to every member. Zero drift.", color: "#7c3aed" },
  { icon: MessageSquare, title: "Live Chat", desc: "Chat while watching. Type 3:15 and it becomes a clickable timestamp link for everyone.", color: "#22d3ee" },
  { icon: Lock, title: "Private Rooms", desc: "Unique room codes only. Share with your crew, nobody else gets in.", color: "#a78bfa" },
  { icon: Music, title: "Shared Queue", desc: "Anyone adds videos. Everyone votes. The playlist builds itself.", color: "#4f46e5" },
  { icon: Clock, title: "Timestamp Links", desc: "Click any timestamp in chat — everyone jumps to that exact moment, synced.", color: "#06b6d4" },
  { icon: Share2, title: "Instant Invites", desc: "Share your code. Friends join in seconds. No friction, no waiting.", color: "#7c3aed" },
];

const STEPS = [
  { icon: Play, num: "01", title: "Create a room", desc: "Sign up, create a room, get a unique code in seconds.", color: "#7c3aed" },
  { icon: Users, num: "02", title: "Invite your crew", desc: "Share the code. Friends join instantly.", color: "#22d3ee" },
  { icon: Music, num: "03", title: "Search & queue", desc: "Search YouTube inside the app. Everyone sees the queue.", color: "#a78bfa" },
  { icon: MessageSquare, num: "04", title: "Watch & chat live", desc: "Perfect sync for all. Chat, react, share timestamps.", color: "#4f46e5" },
];

const MARQUEE_ITEMS = ["Watch Together", "Real-Time Sync", "Private Rooms", "Live Chat", "Shared Queue", "Timestamp Links", "Zero Lag", "Instant Invites"];

export default function Landing() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [codeErr, setCodeErr] = useState(false);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  const headRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroO = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // GSAP char animation on hero title
  useEffect(() => {
    if (!headRef.current) return;
    const chars = headRef.current.querySelectorAll(".ch");
    gsap.fromTo(chars,
      { y: 110, opacity: 0, rotationX: -90, transformOrigin: "bottom center" },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.05, ease: "back.out(1.6)", delay: 0.4, clearProps: "transform" }
    );
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) { setCodeErr(true); setTimeout(() => setCodeErr(false), 600); return; }
    localStorage.setItem("joinCode", roomCode.trim().toUpperCase());
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07040f", color: "#ede9f8", overflowX: "hidden", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#07040f; }
        ::-webkit-scrollbar-thumb { background:rgba(124,58,237,0.4); border-radius:3px; }
        .ch { display:inline-block; transform-origin:bottom center; }
        .disp { font-family:'Cabinet Grotesk',system-ui,sans-serif !important; }
        .card-hover { transition: border-color 0.2s, box-shadow 0.2s; }
        .card-hover:hover { border-color: rgba(124,58,237,0.4) !important; }
      `}</style>

      {/* NAVBAR */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: 64, background: "rgba(7,4,15,0.85)", backdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div whileHover={{ scale: 1.04 }} onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <motion.div
            style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 22px rgba(124,58,237,0.55)" }}
            animate={{ boxShadow: ["0 0 22px rgba(124,58,237,0.55)", "0 0 38px rgba(124,58,237,0.9)", "0 0 22px rgba(124,58,237,0.55)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            <Play size={15} fill="white" color="white" style={{ marginLeft: 2 }} />
          </motion.div>
          <div>
            <div className="disp" style={{ fontWeight: 900, fontSize: 19, letterSpacing: "-0.04em", lineHeight: 1 }}>
              Sync<span style={{ color: "#a78bfa" }}>room</span>
            </div>
            <div style={{ fontSize: 8, color: "rgba(237,233,248,0.28)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Watch Together</div>
          </div>
        </motion.div>

        <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[["Features", "#features"], ["How it works", "#how-it-works"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: "rgba(237,233,248,0.45)", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(237,233,248,0.45)"}>{l}</a>
          ))}
        </nav>

        <motion.button whileHover={{ scale: 1.06, boxShadow: "0 0 36px rgba(124,58,237,0.7)" }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/login")}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 22px", borderRadius: 11, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontSize: 13, fontWeight: 700, boxShadow: "0 0 22px rgba(124,58,237,0.45)", transition: "box-shadow 0.3s" }}>
          <Zap size={13} /> Get Started
        </motion.button>
      </motion.header>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 80 }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 60%), #07040f" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025, zIndex: 0, pointerEvents: "none" }}>
          <defs><pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Blobs */}
        <Blob size={120} color="#7c3aed" x="8%" y="15%" duration={7} shape="circle" />
        <Blob size={80} color="#22d3ee" x="82%" y="12%" duration={9} delay={1} shape="squircle" />
        <Blob size={60} color="#a78bfa" x="90%" y="55%" duration={6} delay={0.5} shape="circle" />
        <Blob size={100} color="#4f46e5" x="5%" y="65%" duration={8} delay={1.5} shape="squircle" />
        <Blob size={50} color="#22d3ee" x="75%" y="78%" duration={5} delay={2} shape="circle" />
        <Blob size={90} color="#7c3aed" x="15%" y="80%" duration={10} delay={0.8} shape="ring" />
        <Blob size={40} color="#f59e0b" x="45%" y="8%" duration={6} delay={3} shape="squircle" />

        {/* Feature pills */}
        <motion.div style={{ position: "absolute", left: "5%", top: "26%", zIndex: 3 }}
          initial={{ opacity: 0, x: -60, rotate: -12 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 150 }}>
          <motion.div animate={{ y: [0, -12, 0], rotate: [-8, -4, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Pill text="⚡ Real-Time Sync" color="#7c3aed" />
          </motion.div>
        </motion.div>

        <motion.div style={{ position: "absolute", right: "4%", top: "20%", zIndex: 3 }}
          initial={{ opacity: 0, x: 60, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 6 }}
          transition={{ delay: 1.4, duration: 0.8, type: "spring", stiffness: 150 }}>
          <motion.div animate={{ y: [0, -14, 4, -8, 0], rotate: [6, 2, 8, 4, 6] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <Pill text="💬 Live Chat" color="#0891b2" />
          </motion.div>
        </motion.div>

        <motion.div style={{ position: "absolute", right: "7%", bottom: "26%", zIndex: 3 }}
          initial={{ opacity: 0, x: 40, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: 5 }}
          transition={{ delay: 1.6, duration: 0.8, type: "spring", stiffness: 150 }}>
          <motion.div animate={{ y: [0, -10, 6, -6, 0], rotate: [5, 9, 3, 7, 5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <Pill text="🎵 Shared Queue" color="#4f46e5" />
          </motion.div>
        </motion.div>

        <motion.div style={{ position: "absolute", left: "4%", bottom: "28%", zIndex: 3 }}
          initial={{ opacity: 0, x: -40, rotate: 8 }}
          animate={{ opacity: 1, x: 0, rotate: -6 }}
          transition={{ delay: 1.8, duration: 0.8, type: "spring", stiffness: 150 }}>
          <motion.div animate={{ y: [0, -8, 4, -6, 0], rotate: [-6, -2, -9, -4, -6] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
            <Pill text="⏱ Timestamps" color="#0e7490" />
          </motion.div>
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: 900, y: heroY, opacity: heroO }}>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 20, marginBottom: 32, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", fontSize: 12, fontWeight: 600 }}>
            <motion.div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }}
              animate={{ opacity: [1, 0.2, 1], scale: [1, 0.6, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            Real-time YouTube watch parties
          </motion.div>

          {/* GSAP char title */}
          <div style={{ marginBottom: 24, overflow: "hidden", perspective: 800 }}>
            <div ref={headRef} className="disp" style={{ fontSize: "clamp(4rem,10vw,8.5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.92, color: "white" }}>
              {"Watch".split("").map((c, i) => (
                <span key={i} className="ch" style={{ display: "inline-block" }}>{c === " " ? "\u00A0" : c}</span>
              ))}
              <br />
              <span style={{ background: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 40%,#22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {"Together".split("").map((c, i) => (
                  <span key={i} className="ch" style={{ display: "inline-block" }}>{c}</span>
                ))}
              </span>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{ fontSize: 18, color: "rgba(237,233,248,0.48)", maxWidth: 440, lineHeight: 1.8, marginBottom: 44, fontWeight: 400 }}>
            Create a room, invite your crew, and watch YouTube in real-time sync with live chat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 44 }}>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 70px rgba(124,58,237,0.7)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "15px 36px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontSize: 15, fontWeight: 800, boxShadow: "0 0 40px rgba(124,58,237,0.5)", letterSpacing: "-0.01em", transition: "box-shadow 0.3s" }}>
              Create a Room <ArrowRight size={17} />
            </motion.button>
          </motion.div>

          {/* Room code input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7 }}
            style={{ width: "100%", maxWidth: 380 }}>
            <p style={{ fontSize: 10, color: "rgba(237,233,248,0.25)", marginBottom: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>Already have a room code?</p>
            <form onSubmit={handleJoin} style={{ display: "flex", gap: 8 }}>
              <motion.div animate={codeErr ? { x: [-7, 7, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }} style={{ flex: 1, position: "relative" }}>
                <Hash size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(237,233,248,0.3)", pointerEvents: "none" }} />
                <input value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} maxLength={8} placeholder="Room code..."
                  style={{ width: "100%", padding: "11px 14px 11px 32px", borderRadius: 10, outline: "none", background: "rgba(255,255,255,0.05)", border: `1px solid ${codeErr ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.09)"}`, color: "white", fontSize: 13, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em", boxSizing: "border-box", transition: "border 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.55)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"} />
              </motion.div>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} type="submit"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 10, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.38)", cursor: "pointer", color: "#c4b5fd", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                <LogIn size={13} /> Join
              </motion.button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            style={{ marginTop: 52, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(237,233,248,0.18)", fontSize: 10 }}>
            <span style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <ChevronDown size={14} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE — used only once */}
      <div style={{ padding: "56px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.25)", overflow: "hidden" }}>
        <div style={{ marginBottom: 18 }}>
          <Marquee items={MARQUEE_ITEMS} direction={1} speed={38} />
        </div>
        <Marquee items={[...MARQUEE_ITEMS].reverse()} direction={-1} speed={30} />
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "120px 48px", position: "relative", overflow: "hidden" }}>
        <Blob size={300} color="rgba(124,58,237,0.04)" x="-5%" y="10%" duration={12} shape="circle" />
        <Blob size={200} color="rgba(34,211,238,0.04)" x="85%" y="60%" duration={10} shape="circle" />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Rev>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 20, marginBottom: 16, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Simple by design
              </div>
              <h2 className="disp" style={{ fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.05em", color: "white", marginBottom: 16 }}>
                Up and running in{" "}
                <span style={{ background: "linear-gradient(135deg,#7c3aed,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>4 steps</span>
              </h2>
              <p style={{ fontSize: 15, color: "rgba(237,233,248,0.38)", maxWidth: 420, margin: "0 auto", lineHeight: 1.8 }}>
                No plugins. No setup. Just a room code and your friends.
              </p>
            </div>
          </Rev>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {STEPS.map((s, i) => (
              <Rev key={s.title} y={60} delay={i * 0.1}>
                <motion.div className="card-hover"
                  whileHover={{ y: -12, boxShadow: `0 28px 56px ${s.color}22` }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  style={{ padding: "36px 28px", borderRadius: 22, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden", cursor: "default" }}>
                  <div className="disp" style={{ position: "absolute", top: 16, right: 20, fontSize: 64, fontWeight: 900, color: `${s.color}12`, lineHeight: 1, letterSpacing: "-0.06em" }}>{s.num}</div>
                  <motion.div
                    style={{ width: 56, height: 56, borderRadius: 17, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}
                    whileHover={{ scale: 1.15, background: `${s.color}30` }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    <s.icon size={26} style={{ color: s.color }} />
                  </motion.div>
                  <h3 className="disp" style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 10, letterSpacing: "-0.03em" }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(237,233,248,0.4)", lineHeight: 1.75 }}>{s.desc}</p>
                  <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${s.color}66,transparent)` }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }} />
                </motion.div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      <HorizontalFeatureScroll />
      {/* APP MOCKUP */}
      <section style={{ padding: "80px 48px 120px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <Rev>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 20, marginBottom: 14, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.22)", color: "#a78bfa", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                See it live
              </div>
              <h2 className="disp" style={{ fontSize: "clamp(2rem,4vw,3.4rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "white" }}>
                Your room, your vibe
              </h2>
            </div>
          </Rev>

          <Rev y={40} delay={0.1}>
            <motion.div
              whileHover={{ boxShadow: "0 0 80px rgba(124,58,237,0.2), 0 40px 80px rgba(0,0,0,0.6)" }}
              style={{ borderRadius: 22, overflow: "hidden", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 0 50px rgba(124,58,237,0.1), 0 30px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ef4444", "#eab308", "#22c55e"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.65 }} />)}
                </div>
                <div style={{ flex: 1, maxWidth: 320, margin: "0 16px", padding: "4px 14px", borderRadius: 6, background: "rgba(255,255,255,0.05)", fontSize: 11, color: "rgba(237,233,248,0.32)", fontFamily: "monospace" }}>syncroom.app/room/XKCD42</div>
                <motion.div style={{ padding: "3px 12px", borderRadius: 7, background: "rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 11, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.08em" }}
                  animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }}>LIVE</motion.div>
              </div>

              <div style={{ display: "flex", minHeight: 400 }}>
                <div style={{ flex: 1, background: "#000", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a0533 0%,#0d1a2b 50%,#0a1428 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 32px,rgba(255,255,255,0.05) 32px,rgba(255,255,255,0.05) 33px)" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <motion.div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(255,0,0,0.5)" }}
                        animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 40px rgba(255,0,0,0.5)", "0 0 60px rgba(255,0,0,0.8)", "0 0 40px rgba(255,0,0,0.5)"] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <div style={{ width: 0, height: 0, marginLeft: 6, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "22px solid white" }} />
                      </motion.div>
                      <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, fontFamily: "monospace" }}>2:14 / 12:30</span>
                    </div>
                    <motion.div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.28)", fontSize: 11, fontWeight: 600 }}
                      animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                      <motion.div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                      All Synced
                    </motion.div>
                    <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: "rgba(0,0,0,0.5)", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                      <motion.div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
                      3 watching
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 18px", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 4, background: "rgba(255,255,255,0.1)", position: "relative", overflow: "hidden" }}>
                      <motion.div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#7c3aed,#22d3ee)" }}
                        animate={{ width: ["30%", "60%"] }} transition={{ duration: 14, ease: "linear", repeat: Infinity }} />
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(237,233,248,0.32)", fontFamily: "monospace", flexShrink: 0 }}>2:14</span>
                  </div>
                </div>

                <div style={{ width: 280, display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(255,255,255,0.05)", background: "rgba(14,10,28,0.5)" }}>
                  <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <motion.div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Live Chat</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(124,58,237,0.18)", color: "#a78bfa", fontWeight: 700 }}>3 online</span>
                  </div>
                  <div style={{ flex: 1, padding: "14px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
                    {[
                      { user: "Alex", color: "#7c3aed", text: "omg this part 😂" },
                      { user: "Maya", color: "#22d3ee", text: "WAIT did you see that??" },
                      { user: "Jordan", color: "#4f46e5", text: "jump to ⏱ 3:22 trust me" },
                      { user: "Sam", color: "#a78bfa", text: "already there 💀" },
                    ].map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.18 + 0.4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>{m.user[0]}</div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.user}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "rgba(237,233,248,0.62)", paddingLeft: 26, lineHeight: 1.5 }}>{m.text}</p>
                      </motion.div>
                    ))}
                    <motion.div style={{ display: "flex", gap: 3, paddingLeft: 26 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      {[0, 1, 2].map(i => <motion.div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(237,233,248,0.32)" }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />)}
                    </motion.div>
                  </div>
                  <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <span style={{ fontSize: 11, color: "rgba(237,233,248,0.22)", flex: 1 }}>Message the room...</span>
                      <span style={{ fontSize: 14 }}>😊</span>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(124,58,237,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ArrowRight size={11} color="#a78bfa" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Rev>
        </div>
      </section>

      {/* ── FINAL CTA with CHARACTER ── */}
      <section style={{ padding: "100px 48px 130px", position: "relative", overflow: "hidden" }}>
        <Blob size={150} color="#7c3aed" x="5%" y="10%" duration={8} shape="circle" />
        <Blob size={100} color="#22d3ee" x="85%" y="70%" duration={7} delay={1} shape="squircle" />
        <Blob size={80} color="#a78bfa" x="88%" y="5%" duration={9} delay={2} shape="ring" />
        <motion.div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, borderRadius: "50%", background: "rgba(124,58,237,0.07)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

        <div ref={ctaRef} style={{
  maxWidth: 700, margin: "0 auto",
  position: "relative", zIndex: 1,
  textAlign: "center",
}}>
  <Rev>
    <h2 className="disp" style={{
      fontSize: "clamp(2.8rem,5.5vw,5rem)",
      fontWeight: 900,
      letterSpacing: "-0.05em",
      color: "white",
      lineHeight: 1.05,
      marginBottom: 20,
    }}>
      Ready to watch{" "}
      <span style={{
        background: "linear-gradient(135deg,#7c3aed,#22d3ee)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>together?</span>
    </h2>
    <motion.p
      initial={{ opacity:0, y:20 }}
      animate={ctaInView ? { opacity:1, y:0 } : {}}
      transition={{ delay:0.4, duration:0.7 }}
      style={{ fontSize:16, color:"rgba(237,233,248,0.4)", marginBottom:40, lineHeight:1.8 }}>
      Create a room in seconds. Share the code. Watch together.
    </motion.p>
    <motion.button
      initial={{ opacity:0, y:20, scale:0.9 }}
      animate={ctaInView ? { opacity:1, y:0, scale:1 } : {}}
      transition={{ delay:0.6, duration:0.7, type:"spring" }}
      whileHover={{ scale:1.08, boxShadow:"0 0 80px rgba(124,58,237,0.7)" }}
      whileTap={{ scale:0.96 }}
      onClick={() => navigate("/login")}
      style={{
        display:"inline-flex", alignItems:"center", gap:10,
        padding:"18px 48px", borderRadius:15, border:"none", cursor:"pointer",
        background:"linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)",
        color:"white", fontSize:17, fontWeight:800,
        boxShadow:"0 0 50px rgba(124,58,237,0.5)",
        letterSpacing:"-0.02em",
      }}>
      Create Your Room <ArrowRight size={19}/>
    </motion.button>
  </Rev>
</div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={12} fill="white" color="white" style={{ marginLeft: 1 }} />
          </div>
          <span className="disp" style={{ fontWeight: 900, fontSize: 15, letterSpacing: "-0.02em" }}>
            Sync<span style={{ color: "#a78bfa" }}>room</span>
          </span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(237,233,248,0.18)" }}>© 2026 Syncroom. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Help"].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: "rgba(237,233,248,0.26)", textDecoration: "none", transition: "color 0.2s", fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(237,233,248,0.26)"}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}