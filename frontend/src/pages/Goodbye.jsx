import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Star, Heart, Sparkles } from "lucide-react";
import PageParticles from "../components/PageParticles";
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#22d3ee" : "#a78bfa",
  duration: 4 + Math.random() * 5,
  delay: Math.random() * 4,
}));

const STATS = [
  { label: "Watch Sessions", value: "1", suffix: "" },
  { label: "Hours Synced",   value: "0.5", suffix: "h" },
  { label: "Vibe Rating",    value: "100", suffix: "%" },
];

export default function Goodbye() {
  const navigate  = useNavigate();
  const [counter, setCounter] = useState(8);
  const [phase,   setPhase]   = useState("goodbye"); // goodbye → redirecting

  useEffect(() => {
    const tick = setInterval(() => {
      setCounter(c => {
        if (c <= 1) {
          clearInterval(tick);
          setPhase("redirecting");
          setTimeout(() => navigate("/dashboard"), 900);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [navigate]);

  return (
   <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative",
      background:
        "radial-gradient(ellipse at 50% 20%, rgba(124,58,237,0.22) 0%, transparent 55%)," +
        "radial-gradient(ellipse at 85% 85%, rgba(34,211,238,0.12) 0%, transparent 50%)," +
        "#050114",
      fontFamily: "system-ui, sans-serif",
    }}>
      <PageParticles count={60} />
      {/* Particles */}
      {PARTICLES.map(p => (
        <motion.div key={p.id}
          style={{
            position:"absolute", borderRadius:"50%",
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size*3}px ${p.color}`,
            left: `${p.x}%`, top: `${p.y}%`,
          }}
          animate={{ y:[0,-120,0], opacity:[0,0.8,0] }}
          transition={{ duration:p.duration, repeat:Infinity, delay:p.delay, ease:"easeInOut" }}
        />
      ))}

      {/* Dot grid */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.04}}>
        <defs>
          <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>

      <AnimatePresence mode="wait">
        {phase === "goodbye" ? (
          <motion.div key="goodbye"
            initial={{ opacity:0, scale:0.9, y:30 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.95, y:-20 }}
            transition={{ type:"spring", stiffness:240, damping:26 }}
            style={{
              position:"relative", zIndex:10,
              display:"flex", flexDirection:"column", alignItems:"center",
              padding:"0 24px", maxWidth:520, width:"100%", textAlign:"center",
            }}
          >
            {/* Logo */}
            <motion.div
              style={{
                width:72, height:72, borderRadius:20,
                background:"linear-gradient(135deg,#7c3aed,#22d3ee)",
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:24,
              }}
              animate={{
                boxShadow:[
                  "0 0 24px rgba(124,58,237,0.5),0 0 48px rgba(124,58,237,0.2)",
                  "0 0 48px rgba(124,58,237,1),0 0 80px rgba(124,58,237,0.4)",
                  "0 0 24px rgba(124,58,237,0.5),0 0 48px rgba(124,58,237,0.2)",
                ],
                rotate:[0,3,-3,0],
              }}
              transition={{ duration:3, repeat:Infinity }}
            >
              <Play size={30} fill="white" color="white" style={{marginLeft:3}}/>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.15, duration:0.6 }}
              style={{
                fontSize:"2.4rem", fontWeight:900,
                letterSpacing:"-0.03em", color:"white",
                lineHeight:1.1, marginBottom:10,
              }}
            >
              Until next time,{" "}
              <span style={{
                background:"linear-gradient(135deg,#a78bfa,#22d3ee)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
              }}>
                Syncer
              </span>
              <motion.span
                animate={{ rotate:[0,15,-10,15,0] }}
                transition={{ duration:1.2, delay:0.8, repeat:Infinity, repeatDelay:2 }}
                style={{ display:"inline-block", marginLeft:8 }}
              >
                👋
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.28 }}
              style={{ fontSize:15, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:32 }}
            >
              Thanks for syncing with your crew on{" "}
              <span style={{color:"#a78bfa",fontWeight:700}}>Syncroom</span>.
              <br/>Your vibes were immaculate. Come back soon.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.4 }}
              style={{
                display:"flex", gap:10, marginBottom:36, width:"100%",
              }}
            >
              {STATS.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity:0, scale:0.85 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.45 + i*0.08, type:"spring", stiffness:280 }}
                  style={{
                    flex:1, padding:"14px 10px", borderRadius:14,
                    background:"rgba(124,58,237,0.08)",
                    border:"1px solid rgba(124,58,237,0.2)",
                    textAlign:"center",
                  }}
                >
                  <div style={{
                    fontSize:22, fontWeight:900, color:"white",
                    background:"linear-gradient(135deg,#a78bfa,#22d3ee)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>
                    {s.value}{s.suffix}
                  </div>
                  <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.35)",
                    textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Heart row */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.6 }}
              style={{
                display:"flex", alignItems:"center", gap:6,
                marginBottom:32, fontSize:12,
                color:"rgba(255,255,255,0.35)",
              }}
            >
              {[...Array(5)].map((_,i) => (
                <motion.div key={i}
                  animate={{ scale:[1,1.3,1] }}
                  transition={{ duration:0.6, delay:0.7 + i*0.1, repeat:Infinity, repeatDelay:2.5 }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" style={{opacity:0.85}}/>
                </motion.div>
              ))}
              <span style={{marginLeft:6}}>Rated 5 stars by your squad</span>
            </motion.div>

            {/* Countdown ring + button */}
            <motion.div
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.7 }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}
            >
              {/* SVG countdown ring */}
              <div style={{ position:"relative", width:72, height:72 }}>
                <svg width="72" height="72" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="36" cy="36" r="30"
                    fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="4"/>
                  <motion.circle cx="36" cy="36" r="30"
                    fill="none" stroke="url(#ringGrad)" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*30}`}
                    strokeDashoffset={`${2*Math.PI*30 * (1 - counter/8)}`}
                    style={{ transition:"stroke-dashoffset 0.9s ease" }}
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed"/>
                      <stop offset="100%" stopColor="#22d3ee"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position:"absolute", inset:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <span style={{
                    fontSize:20, fontWeight:900, color:"white",
                    background:"linear-gradient(135deg,#a78bfa,#22d3ee)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>{counter}</span>
                </div>
              </div>

              <span style={{fontSize:12, color:"rgba(255,255,255,0.35)"}}>
                Redirecting to dashboard…
              </span>

              {/* Manual CTA */}
              <motion.button
                whileHover={{ scale:1.04, filter:"brightness(1.12)" }}
                whileTap={{ scale:0.96 }}
                onClick={() => navigate("/dashboard")}
                style={{
                  padding:"11px 28px", borderRadius:12,
                  background:"linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)",
                  boxShadow:"0 0 28px rgba(124,58,237,0.4)",
                  border:"none", cursor:"pointer",
                  color:"white", fontSize:13, fontWeight:800,
                  display:"flex", alignItems:"center", gap:8,
                  letterSpacing:"0.03em",
                }}
              >
                <Sparkles size={15}/>
                Back to Dashboard
              </motion.button>
            </motion.div>

            {/* Bottom tagline */}
            <motion.p
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.9 }}
              style={{
                marginTop:28, fontSize:11,
                color:"rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", gap:5,
              }}
            >
              Made with <Heart size={10} fill="#f43f5e" color="#f43f5e"/> by the Syncroom team
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="redirecting"
            initial={{ opacity:0, scale:0.8 }}
            animate={{ opacity:1, scale:1 }}
            style={{ zIndex:10, textAlign:"center" }}
          >
            <motion.div
              style={{
                width:60, height:60, borderRadius:16, margin:"0 auto 16px",
                background:"linear-gradient(135deg,#7c3aed,#22d3ee)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}
              animate={{ rotate:360 }}
              transition={{ duration:0.8, ease:"easeInOut" }}
            >
              <Play size={24} fill="white" color="white"/>
            </motion.div>
            <p style={{color:"rgba(255,255,255,0.5)", fontSize:13}}>Heading to dashboard…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}