import { motion } from "framer-motion";

export default function BackgroundFX() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top purple glow */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%",
        transform: "translateX(-50%)",
        width: "800px", height: "500px",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 70%)",
        filter: "blur(40px)"
      }}/>
      {/* Bottom right cyan glow */}
      <div style={{
        position: "absolute", bottom: "-100px", right: "-100px",
        width: "500px", height: "500px",
        background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)",
        filter: "blur(40px)"
      }}/>
      {/* Bottom left purple */}
      <div style={{
        position: "absolute", bottom: "10%", left: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)",
        filter: "blur(40px)"
      }}/>
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.045 }}>
        <defs>
          <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
      {/* Pulsing rings centered */}
      {[300, 500, 720].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/5"
          style={{
            width: size, height: size,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)"
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}