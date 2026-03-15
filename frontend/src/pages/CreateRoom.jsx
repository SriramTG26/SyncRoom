import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createRoom as createRoomAPI } from "../services/api";
import {
  Play, Hash, Copy, Check, Globe, Lock,
  Users, ArrowLeft, Zap, ChevronRight,
  Share2, ListVideo, ThumbsUp, MessageSquare,
  Crown, ShieldCheck, MicOff, UserPlus
} from "lucide-react";
import PageParticles from "../components/PageParticles";

const C = {
  bg:      "#08050f",
  surface: "#0e0a1c",
  card:    "#110d20",
  border:  "rgba(124,58,237,0.16)",
  purple:  "#7c3aed",
  glow:    "rgba(124,58,237,0.3)",
  cyan:    "#22d3ee",
  text:    "#e2d9f3",
  muted:   "rgba(226,217,243,0.42)",
  dim:     "rgba(226,217,243,0.2)",
};

const PUBLIC_PERKS = [
  { icon: <Globe size={13}/>,        text: "Anyone with the link joins instantly — no approval" },
  { icon: <ListVideo size={13}/>,    text: "Open queue — every member can add videos" },
  { icon: <ThumbsUp size={13}/>,     text: "Community voting decides what plays next" },
  { icon: <MessageSquare size={13}/>,text: "Open chat — all members message freely" },
  { icon: <Share2 size={13}/>,       text: "One-tap sharing via WhatsApp, link & social" },
];

const PRIVATE_PERKS = [
  { icon: <Lock size={13}/>,        text: "Code-gated — only invited members can enter" },
  { icon: <Crown size={13}/>,       text: "Host-only queue — you control what plays" },
  { icon: <ShieldCheck size={13}/>, text: "Kick & ban — remove anyone instantly" },
  { icon: <Users size={13}/>,       text: "Strict member cap — no overflow allowed" },
  { icon: <MicOff size={13}/>,      text: "Mute members — host silences any chatter" },
];

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.07 }}};
const fadeUp  = {
  hidden:{ opacity:0, y:14, filter:"blur(4px)" },
  show:{   opacity:1, y:0,  filter:"blur(0px)",
    transition:{ type:"spring", stiffness:280, damping:26 }},
};

export default function CreateRoom() {
  const navigate = useNavigate();

  const [roomName,   setRoomName]   = useState("");
  const [roomCode]                  = useState(generateCode);
  const [maxMembers, setMaxMembers] = useState(10);
  const [roomType,   setRoomType]   = useState("public");
  const [copied,     setCopied]     = useState(false);
  const [creating,   setCreating]   = useState(false);
  const [done,       setDone]       = useState(false);
  const [createError, setCreateError] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

 const handleCreate = async () => {
    if (!roomName.trim()) return;
    setCreating(true);
    setCreateError("");

    try {
      const data = await createRoomAPI({
        name: roomName.trim(),
        code: roomCode,
        type: roomType,
        maxMembers,
      });

      // Save room to localStorage for Room page to use
      localStorage.setItem("currentRoom", JSON.stringify(data.room));
      setDone(true);
      setTimeout(()=>navigate("/room"), 800);

    } catch (err) {
      setCreating(false);
      setCreateError(err.message);
    }
  };

  const activePerks = roomType === "public" ? PUBLIC_PERKS : PRIVATE_PERKS;

  return (
    <div style={{
      minHeight:"100vh", background:C.bg, color:C.text,
      fontFamily:"system-ui,sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      position:"relative", overflowY:"auto",
    }}>

      {/* bg glows */}
      <div style={{
        position:"fixed", top:"-15%", left:"50%", transform:"translateX(-50%)",
        width:700, height:420, pointerEvents:"none",
        background:"radial-gradient(ellipse,rgba(124,58,237,0.2) 0%,transparent 70%)",
        filter:"blur(50px)", zIndex:0,
      }}/>
      <div style={{
        position:"fixed", bottom:"-10%", right:"-5%",
        width:400, height:400, pointerEvents:"none",
        background:"radial-gradient(ellipse,rgba(34,211,238,0.1) 0%,transparent 70%)",
        filter:"blur(40px)", zIndex:0,
      }}/>
      <svg style={{
        position:"fixed", inset:0, width:"100%", height:"100%",
        opacity:0.035, zIndex:0, pointerEvents:"none",
      }}>
        <defs>
          <pattern id="d" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#d)"/>
      </svg>

      <PageParticles count={50}/>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:20, width:"100%",
        height:52, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 24px",
        background:"rgba(14,10,28,0.88)",
        backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{
            width:30, height:30, borderRadius:9,
            background:`linear-gradient(135deg,${C.purple},${C.cyan})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 0 12px ${C.glow}`,
          }}>
            <Play size={13} fill="white" color="white" style={{marginLeft:2}}/>
          </div>
          <span style={{fontWeight:800, fontSize:15, letterSpacing:"-0.02em"}}>
            Sync<span style={{color:"#a78bfa"}}>room</span>
          </span>
        </div>

        <motion.button
          whileHover={{scale:1.04, x:-2}} whileTap={{scale:0.95}}
          onClick={()=>navigate("/dashboard")}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"6px 14px", borderRadius:8,
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)",
            color:C.muted, fontSize:12, fontWeight:600, cursor:"pointer",
          }}>
          <ArrowLeft size={13}/> Back
        </motion.button>
      </nav>

      {/* ── CONTENT ── */}
      <div style={{
        position:"relative", zIndex:1,
        width:"100%", maxWidth:560,
        padding:"36px 24px 60px",
      }}>

        {/* heading */}
        <motion.div
          initial={{opacity:0, y:-16}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.5, ease:"easeOut"}}
          style={{textAlign:"center", marginBottom:28}}
        >
          <h1 style={{
            fontSize:"2rem", fontWeight:900,
            letterSpacing:"-0.03em", color:"white", marginBottom:8,
          }}>
            Create Your{" "}
            <span style={{
              background:"linear-gradient(135deg,#a78bfa,#22d3ee)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>Watch Room</span>
          </h1>
          <p style={{fontSize:13, color:C.muted}}>
            Set up your room and start watching together
          </p>
        </motion.div>

        {/* ── CARD ── */}
        <motion.div
          initial={{opacity:0, y:24, scale:0.97}}
          animate={{opacity:1, y:0, scale:1}}
          transition={{type:"spring", stiffness:240, damping:26, delay:0.1}}
        >
          <div style={{
            padding:"1px", borderRadius:18,
            background:"linear-gradient(135deg,rgba(124,58,237,0.7),rgba(79,70,229,0.4),rgba(34,211,238,0.5))",
          }}>
            <div style={{
              borderRadius:17, background:C.card,
              position:"relative", overflow:"hidden",
            }}>

              {/* shimmer top line */}
              <motion.div style={{
                position:"absolute", top:0, left:0, right:0, height:"2px",
                background:"linear-gradient(90deg,transparent,#7c3aed,#22d3ee,transparent)",
                backgroundSize:"200% 100%",
              }}
                animate={{backgroundPosition:["0%","200%"]}}
                transition={{duration:3, repeat:Infinity, ease:"linear"}}
              />

              <motion.div
                variants={stagger} initial="hidden" animate="show"
                style={{padding:"28px 28px 32px"}}
              >

                {/* ── ROOM NAME ── */}
                <motion.div variants={fadeUp} style={{marginBottom:20}}>
                  <label style={{
                    display:"block", fontSize:9, fontWeight:800,
                    letterSpacing:"0.16em", color:C.dim,
                    textTransform:"uppercase", marginBottom:8,
                  }}>Room Name</label>
                  <div style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"11px 14px", borderRadius:11,
                    background:"rgba(255,255,255,0.04)",
                    border:`1px solid ${roomName
                      ?"rgba(124,58,237,0.45)"
                      :"rgba(255,255,255,0.08)"}`,
                    transition:"border 0.2s",
                  }}>
                    <Hash size={14} color={C.dim} style={{flexShrink:0}}/>
                    <input
                      value={roomName}
                      onChange={e=>setRoomName(e.target.value)}
                      placeholder="e.g. Friday Night Movies"
                      style={{
                        flex:1, background:"none", border:"none",
                        outline:"none", color:"white", fontSize:13,
                      }}
                    />
                  </div>
                </motion.div>

                {/* ── ROOM CODE ── */}
                <motion.div variants={fadeUp} style={{marginBottom:20}}>
                  <label style={{
                    display:"block", fontSize:9, fontWeight:800,
                    letterSpacing:"0.16em", color:C.dim,
                    textTransform:"uppercase", marginBottom:8,
                  }}>Room Code (Auto-Generated)</label>
                  <div style={{
                    display:"flex", alignItems:"center",
                    justifyContent:"space-between",
                    padding:"11px 14px", borderRadius:11,
                    background:"rgba(124,58,237,0.07)",
                    border:"1px solid rgba(124,58,237,0.25)",
                  }}>
                    <span style={{
                      fontSize:18, fontWeight:900, letterSpacing:"0.2em",
                      background:"linear-gradient(135deg,#a78bfa,#22d3ee)",
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    }}>{roomCode}</span>
                    <motion.button
                      whileHover={{scale:1.05}} whileTap={{scale:0.9}}
                      onClick={copyCode}
                      style={{
                        display:"flex", alignItems:"center", gap:5,
                        padding:"5px 12px", borderRadius:7,
                        background:`linear-gradient(135deg,${C.purple},#4f46e5)`,
                        border:"none", cursor:"pointer",
                        color:"white", fontSize:11, fontWeight:700,
                      }}>
                      {copied ? <Check size={12}/> : <Copy size={12}/>}
                      {copied ? "Copied" : "Copy"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* ── MAX MEMBERS ── */}
                <motion.div variants={fadeUp} style={{marginBottom:20}}>
                  <div style={{
                    display:"flex", alignItems:"center",
                    justifyContent:"space-between", marginBottom:8,
                  }}>
                    <label style={{
                      fontSize:9, fontWeight:800,
                      letterSpacing:"0.16em", color:C.dim,
                      textTransform:"uppercase",
                    }}>Max Members</label>
                    <span style={{fontSize:13, fontWeight:800, color:"white"}}>
                      <span style={{
                        fontSize:16,
                        background:"linear-gradient(135deg,#a78bfa,#22d3ee)",
                        WebkitBackgroundClip:"text",
                        WebkitTextFillColor:"transparent",
                      }}>{maxMembers}</span>
                      <span style={{fontSize:11, color:C.muted, fontWeight:400}}> people</span>
                    </span>
                  </div>

                  <div style={{display:"flex", alignItems:"center", gap:8}}>
                    <motion.button whileTap={{scale:0.88}}
                      onClick={()=>setMaxMembers(m=>Math.max(2,m-1))}
                      style={{
                        width:30, height:30, borderRadius:7, flexShrink:0,
                        background:"rgba(255,255,255,0.06)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        cursor:"pointer", color:C.muted,
                        display:"flex", alignItems:"center",
                        justifyContent:"center",
                        fontSize:16, fontWeight:700,
                      }}>−</motion.button>

                    <div style={{flex:1, position:"relative", height:6}}>
                      <div style={{
                        position:"absolute", inset:0, borderRadius:3,
                        background:"rgba(255,255,255,0.08)",
                      }}/>
                      <motion.div
                        layout
                        transition={{type:"spring", stiffness:300, damping:28}}
                        style={{
                          position:"absolute", left:0, top:0, bottom:0,
                          borderRadius:3,
                          background:"linear-gradient(90deg,#7c3aed,#22d3ee)",
                          width:`${((maxMembers-2)/(50-2))*100}%`,
                        }}
                      />
                    </div>

                    <motion.button whileTap={{scale:0.88}}
                      onClick={()=>setMaxMembers(m=>Math.min(50,m+1))}
                      style={{
                        width:30, height:30, borderRadius:7, flexShrink:0,
                        background:"rgba(255,255,255,0.06)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        cursor:"pointer", color:C.muted,
                        display:"flex", alignItems:"center",
                        justifyContent:"center",
                        fontSize:16, fontWeight:700,
                      }}>+</motion.button>
                  </div>

                  {/* dot indicators */}
                  <div style={{display:"flex", gap:4, marginTop:7}}>
                    {Array.from({length:10},(_,i)=>i+1).map(d=>(
                      <motion.div key={d}
                        animate={{
                          background: d <= Math.ceil(((maxMembers-2)/(50-2))*10)
                            ? "#7c3aed" : "rgba(255,255,255,0.1)",
                          boxShadow: d <= Math.ceil(((maxMembers-2)/(50-2))*10)
                            ? "0 0 6px rgba(124,58,237,0.6)" : "none",
                        }}
                        transition={{duration:0.2}}
                        style={{flex:1, height:3, borderRadius:2}}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* ── ROOM TYPE ── */}
                <motion.div variants={fadeUp} style={{marginBottom:20}}>
                  <label style={{
                    display:"block", fontSize:9, fontWeight:800,
                    letterSpacing:"0.16em", color:C.dim,
                    textTransform:"uppercase", marginBottom:8,
                  }}>Room Type</label>

                  <div style={{
                    display:"grid", gridTemplateColumns:"1fr 1fr",
                    gap:8, marginBottom:12,
                  }}>
                    {[
                      { id:"public",  icon:<Globe size={18}/>,
                        label:"Public",  sub:"Anyone with the link" },
                      { id:"private", icon:<Lock size={18}/>,
                        label:"Private", sub:"Code-only access" },
                    ].map(t=>(
                      <motion.button key={t.id}
                        whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                        onClick={()=>setRoomType(t.id)}
                        style={{
                          padding:"16px 14px", borderRadius:11,
                          cursor:"pointer", textAlign:"left",
                          background:roomType===t.id
                            ?"rgba(124,58,237,0.14)"
                            :"rgba(255,255,255,0.03)",
                          border:`1.5px solid ${roomType===t.id
                            ?"rgba(124,58,237,0.5)"
                            :"rgba(255,255,255,0.07)"}`,
                          transition:"all 0.18s",
                          display:"flex", flexDirection:"column", gap:7,
                        }}>
                        <div style={{
                          color:roomType===t.id?"#a78bfa":C.dim,
                          transition:"color 0.18s",
                        }}>{t.icon}</div>
                        <div style={{fontSize:13,fontWeight:800,color:"white"}}>
                          {t.label}
                        </div>
                        <div style={{fontSize:11,color:C.dim}}>{t.sub}</div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Dynamic perks */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={roomType}
                      initial={{opacity:0, y:8}}
                      animate={{opacity:1, y:0}}
                      exit={{opacity:0, y:-8}}
                      transition={{duration:0.22}}
                      style={{
                        padding:"14px 16px", borderRadius:11,
                        background:roomType==="public"
                          ?"rgba(124,58,237,0.07)"
                          :"rgba(34,211,238,0.06)",
                        border:`1px solid ${roomType==="public"
                          ?"rgba(124,58,237,0.22)"
                          :"rgba(34,211,238,0.2)"}`,
                      }}>
                      <p style={{
                        fontSize:9, fontWeight:800,
                        letterSpacing:"0.12em", textTransform:"uppercase",
                        color:roomType==="public"?"#a78bfa":C.cyan,
                        marginBottom:10,
                      }}>
                        {roomType==="public"
                          ?"✦ Public Room Includes"
                          :"✦ Private Room Includes"}
                      </p>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {activePerks.map((perk,i)=>(
                          <motion.div key={i}
                            initial={{opacity:0, x:-8}}
                            animate={{opacity:1, x:0}}
                            transition={{delay:i*0.06}}
                            style={{
                              display:"flex", alignItems:"center",
                              gap:10, fontSize:12, color:C.muted,
                            }}>
                            <div style={{
                              color:roomType==="public"?"#a78bfa":C.cyan,
                              flexShrink:0,
                            }}>{perk.icon}</div>
                            {perk.text}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* ── SUMMARY ── */}
                <motion.div variants={fadeUp} style={{marginBottom:18}}>
                  <div style={{
                    padding:"10px 14px", borderRadius:10,
                    background:"rgba(34,211,238,0.06)",
                    border:"1px solid rgba(34,211,238,0.18)",
                    fontSize:12, color:C.muted,
                    display:"flex", alignItems:"center", gap:8,
                  }}>
                    <Users size={13} color={C.cyan} style={{flexShrink:0}}/>
                    <span>
                      {roomName
                        ? <><span style={{color:"white",fontWeight:700}}>
                            "{roomName}"
                          </span> — </>
                        : "Your room — "
                      }
                      <span style={{
                        color:roomType==="public"?"#a78bfa":C.cyan,
                        fontWeight:600,
                      }}>{roomType}</span>
                      {" · up to "}
                      <span style={{color:"white",fontWeight:700}}>
                        {maxMembers} people
                      </span>
                      {" · all features included"}
                    </span>
                  </div>
                </motion.div>

                {/* ── CREATE BUTTON ── */}
                <motion.div variants={fadeUp}>
                  <motion.button
                    whileHover={{scale:1.02, filter:"brightness(1.1)"}}
                    whileTap={{scale:0.97}}
                    onClick={handleCreate}
                    disabled={!roomName.trim()}
                    style={{
                      width:"100%", height:50, borderRadius:13,
                      border:"none",
                      cursor:roomName.trim()?"pointer":"not-allowed",
                      background:done
                        ?"linear-gradient(135deg,#10b981,#059669)"
                        :roomName.trim()
                          ?"linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)"
                          :"rgba(255,255,255,0.06)",
                      boxShadow:roomName.trim()&&!done
                        ?"0 0 30px rgba(124,58,237,0.4)":"none",
                      color:roomName.trim()?"white":"rgba(255,255,255,0.3)",
                      fontSize:14, fontWeight:800,
                      display:"flex", alignItems:"center",
                      justifyContent:"center", gap:8,
                      letterSpacing:"0.03em",
                      transition:"background 0.35s, box-shadow 0.35s",
                    }}>
                    <AnimatePresence mode="wait">
                      {done ? (
                        <motion.span key="done"
                          initial={{scale:0}} animate={{scale:1}}
                          transition={{type:"spring",stiffness:400,damping:18}}
                          style={{fontSize:18}}>✓</motion.span>
                      ) : creating ? (
                        <motion.div key="spin"
                          animate={{rotate:360}}
                          transition={{
                            duration:0.65, repeat:Infinity, ease:"linear",
                          }}
                          style={{
                            width:18, height:18, borderRadius:"50%",
                            border:"2.5px solid rgba(255,255,255,0.25)",
                            borderTopColor:"white", opacity:1,
                          }}
                        />
                      ) : (
                        <motion.span key="label"
                          initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                          exit={{opacity:0,y:-4}}
                          style={{
                            display:"flex", alignItems:"center", gap:7,
                          }}>
                          <Zap size={15} fill="white"/>
                          Create Room
                          <ChevronRight size={14}/>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {createError && (
                    <motion.div
                      initial={{opacity:0,y:-6}}
                      animate={{opacity:1,y:0}}
                      style={{
                        padding:"10px 14px",borderRadius:9,marginBottom:10,
                        background:"rgba(244,63,94,0.1)",
                        border:"1px solid rgba(244,63,94,0.3)",
                        color:"#f43f5e",fontSize:12,fontWeight:500,
                        textAlign:"center",
                      }}>
                      {createError}
                    </motion.div>
                  )}
                  {!roomName.trim() && (
                    <p style={{
                      textAlign:"center", fontSize:10,
                      color:C.dim, marginTop:7,
                    }}>
                      Enter a room name to continue
                    </p>
                  )}
                </motion.div>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}