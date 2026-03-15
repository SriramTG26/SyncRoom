import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Play, ArrowRight, UserCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket } from "../../services/socket";
import BackgroundFX from "./BackgroundFX";
import Particles from "./Particles";
import { loginUser, registerUser } from "../../services/api";

export default function AuthCard() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === "/signup" ? "signup" : "login");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [username, setUsername]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setIdentifier(""); setEmail(""); setPassword(""); setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;
      if (mode === "login") {
        data = await loginUser({ identifier, password });
      } else {
        data = await registerUser({ username, email, password });
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      connectSocket(data.token);
setDone(true);
const pendingCode = localStorage.getItem("joinCode");
if (pendingCode) {
  localStorage.removeItem("joinCode");
  setTimeout(async () => {
    try {
      const { joinRoom } = await import("../../services/api");
      const result = await joinRoom(pendingCode);
      localStorage.setItem("currentRoom", JSON.stringify(result.room));
      navigate("/room");
    } catch {
      navigate("/dashboard");
    }
  }, 800);
} else {
  setTimeout(() => navigate("/dashboard"), 800);
}

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  /* stagger children */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { type: "spring", stiffness: 320, damping: 28 } },
    exit:   { opacity: 0, y: -14, filter: "blur(4px)", transition: { duration: 0.18 } },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% -8%, rgba(124,58,237,0.32) 0%, transparent 54%)," +
          "radial-gradient(ellipse at 88% 98%, rgba(34,211,238,0.15) 0%, transparent 50%)," +
          "radial-gradient(ellipse at 8% 80%, rgba(79,70,229,0.12) 0%, transparent 45%)," +
          "#050114",
      }}
    >
      <BackgroundFX />
      <Particles />

      {/* ── Logo ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: -30, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 }}
        style={{ marginBottom: "32px" }}
      >
        <motion.div
          style={{
            position: "absolute",
            width: 90, height: 90,
            borderRadius: "24px",
            background: "rgba(124,58,237,0.18)",
            filter: "blur(14px)",
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{
            width: 64, height: 64, borderRadius: "20px",
            background: "linear-gradient(135deg,#7c3aed,#22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 1,
          }}
          whileHover={{ scale: 1.08, rotate: 4 }}
          animate={{
            boxShadow: [
              "0 0 24px rgba(124,58,237,0.6), 0 0 48px rgba(124,58,237,0.2)",
              "0 0 42px rgba(124,58,237,1.0), 0 0 80px rgba(124,58,237,0.4)",
              "0 0 24px rgba(124,58,237,0.6), 0 0 48px rgba(124,58,237,0.2)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <Play size={24} fill="white" className="text-white ml-0.5" />
        </motion.div>

        <motion.h1
          style={{
            fontSize: "2.4rem", fontWeight: 900,
            letterSpacing: "-0.02em", color: "white",
            marginTop: "14px", lineHeight: 1,
          }}
          initial={{ opacity: 0, letterSpacing: "0.15em" }}
          animate={{ opacity: 1, letterSpacing: "-0.02em" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          Sync<span style={{ color: "#a78bfa" }}>room</span>
        </motion.h1>

        <motion.div
          style={{
            marginTop: "10px",
            padding: "5px 14px", borderRadius: "20px",
            background: "rgba(124,58,237,0.14)",
            border: "1px solid rgba(124,58,237,0.3)",
            fontSize: "11px", color: "rgba(255,255,255,0.55)",
            display: "flex", alignItems: "center", gap: "6px",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 300 }}
        >
          <motion.span
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }}
            animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
            >
              {mode === "signup" ? "Create your free account" : "Welcome back"}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Card ── */}
      <motion.div
        className="relative z-10 w-full px-4"
        style={{ maxWidth: "430px" }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.15 }}
      >
        <div style={{
          padding: "1px", borderRadius: "20px",
          background: "linear-gradient(135deg,rgba(124,58,237,0.8),rgba(79,70,229,0.45),rgba(34,211,238,0.6))",
        }}>
          <div style={{
            borderRadius: "19px",
            background: "rgba(6,3,16,0.95)",
            backdropFilter: "blur(32px)",
            overflow: "hidden",
            position: "relative",
          }}>
            <motion.div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: "linear-gradient(90deg,transparent,#7c3aed,#22d3ee,transparent)",
              backgroundSize: "200% 100%",
            }}
              animate={{ backgroundPosition: ["0%", "200%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            />

            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "80%", height: "1px",
              background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.5),transparent)",
            }} />

            <div style={{ padding: "28px 28px 26px" }}>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`heading-${mode}`}
                  initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ marginBottom: "20px" }}
                >
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "white", marginBottom: "4px" }}>
                    {mode === "signup" ? "Create Account" : "Sign In"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>
                    {mode === "signup" ? (
                      <>Already have an account?{" "}
                        <button onClick={() => switchMode("login")} style={{
                          color: "#a78bfa", background: "none", border: "none",
                          cursor: "pointer", fontSize: "12px", fontWeight: 700,
                        }}>Sign In</button>
                      </>
                    ) : (
                      <>New here?{" "}
                        <button onClick={() => switchMode("signup")} style={{
                          color: "#a78bfa", background: "none", border: "none",
                          cursor: "pointer", fontSize: "12px", fontWeight: 700,
                        }}>Create an account</button>
                      </>
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                >
                  {mode === "signup" && (
                    <motion.div variants={item}>
                      <FloatingInput id="username" label="Username" type="text"
                        value={username} onChange={e => setUsername(e.target.value)} />
                    </motion.div>
                  )}

                  <motion.div variants={item}>
                    <FloatingInput
                      id="email"
                      label={mode === "login" ? "Username or Email" : "Email"}
                      type="text"
                      value={mode === "login" ? identifier : email}
                      onChange={e => mode === "login" ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <FloatingInput id="password" label="Password"
                      type={showPass ? "text" : "password"}
                      value={password} onChange={e => setPassword(e.target.value)}>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setShowPass(!showPass)}
                        style={{ color: "rgba(255,255,255,0.38)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                        <AnimatePresence mode="wait">
                          <motion.span key={showPass ? "off" : "on"}
                            initial={{ opacity: 0, rotate: -15, scale: 0.7 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 15, scale: 0.7 }}
                            transition={{ duration: 0.18 }}>
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </FloatingInput>
                  </motion.div>

                  {/* error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: "10px 14px", borderRadius: 9,
                        background: "rgba(244,63,94,0.1)",
                        border: "1px solid rgba(244,63,94,0.3)",
                        color: "#f43f5e", fontSize: 12, fontWeight: 500,
                      }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* submit */}
                  <motion.div variants={item}>
                    <motion.button
                      whileHover={{ scale: 1.025, filter: "brightness(1.15)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleSubmit}
                      style={{
                        width: "100%", height: "46px", marginTop: "2px",
                        borderRadius: "12px", border: "none", cursor: "pointer",
                        background: done
                          ? "linear-gradient(135deg,#10b981,#059669)"
                          : "linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)",
                        boxShadow: done
                          ? "0 0 28px rgba(16,185,129,0.45)"
                          : "0 0 28px rgba(124,58,237,0.42)",
                        color: "white", fontWeight: 800, fontSize: "13px",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        letterSpacing: "0.04em",
                        transition: "background 0.4s, box-shadow 0.4s",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {done ? (
                          <motion.span key="done"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            style={{ fontSize: "18px" }}>
                            ✓
                          </motion.span>
                        ) : loading ? (
                          <motion.div key="spin"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                            style={{
                              width: 18, height: 18, borderRadius: "50%",
                              border: "2.5px solid rgba(255,255,255,0.25)",
                              borderTopColor: "white", opacity: 1,
                            }}
                          />
                        ) : (
                          <motion.span key="label"
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                            {mode === "signup" && <UserCircle2 size={15} />}
                            {mode === "login" ? "Sign In" : "Create Account"}
                            <motion.span
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                              <ArrowRight size={14} />
                            </motion.span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>

                  {/* divider */}
                  <motion.div variants={item} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0 2px" }}>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>
                      or continue with
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                  </motion.div>

                  {/* Google */}
                  <motion.div variants={item}>
                    <motion.button
                      whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.07)" }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      style={{
                        width: "100%", height: "42px", borderRadius: "11px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "rgba(255,255,255,0.72)", fontSize: "12px", fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        cursor: "pointer", transition: "background 0.2s",
                        letterSpacing: "0.02em",
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.39 29.5 1.5 24 1.5 14.82 1.5 7.02 6.98 3.44 14.77l7.12 5.53C12.27 14.08 17.64 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.74H24v9h12.44c-.54 2.9-2.18 5.36-4.65 7.02l7.12 5.53C43.06 37.28 46.1 31.36 46.1 24.5z"/>
                        <path fill="#FBBC05" d="M10.56 28.3A14.58 14.58 0 0 1 9.5 24c0-1.49.26-2.93.72-4.28L3.1 14.19A22.45 22.45 0 0 0 1.5 24c0 3.52.84 6.85 2.32 9.81l6.74-5.51z"/>
                        <path fill="#34A853" d="M24 46.5c5.5 0 10.12-1.82 13.49-4.95l-7.12-5.53C28.6 37.7 26.44 38.5 24 38.5c-6.36 0-11.73-4.58-13.44-10.72l-7.12 5.53C7.02 41.02 14.82 46.5 24 46.5z"/>
                      </svg>
                      Continue with Google
                    </motion.button>
                  </motion.div>

                  {/* Guest */}
                  <motion.div variants={item}>
                    <motion.button
                      whileHover={{ color: "rgba(255,255,255,0.62)", scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      style={{
                        width: "100%", padding: "7px 0",
                        background: "none", border: "none", cursor: "pointer",
                        color: "rgba(255,255,255,0.26)", fontSize: "11px", fontWeight: 500,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        transition: "color 0.2s",
                      }}
                    >
                      <Play size={11} fill="currentColor" />
                      Enter as Guest
                    </motion.button>
                  </motion.div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Floating label input ── */
function FloatingInput({ id, label, type, value, onChange, children }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 2px rgba(124,58,237,0.55), 0 0 20px rgba(124,58,237,0.15)"
            : "0 0 0 0px transparent",
        }}
        transition={{ duration: 0.18 }}
        style={{ position: "absolute", inset: 0, borderRadius: "11px", pointerEvents: "none" }}
      />
      <input
        id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: active ? "19px 16px 7px" : "13px 16px",
          borderRadius: "11px",
          fontSize: "13px", color: "white", outline: "none",
          background: focused ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.08)"}`,
          transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          paddingRight: children ? "42px" : "16px",
        }}
      />
      <label
        htmlFor={id}
        style={{
          position: "absolute", left: "16px",
          pointerEvents: "none",
          transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
          top: active ? "6px" : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? "9px" : "12.5px",
          letterSpacing: active ? "0.09em" : "0.01em",
          color: focused ? "rgba(167,139,250,0.85)" : "rgba(255,255,255,0.36)",
          fontWeight: active ? 700 : 400,
        }}
      >
        {label}
      </label>
      {children && (
        <div style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)" }}>
          {children}
        </div>
      )}
    </div>
  );
}