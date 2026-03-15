import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageParticles({ count = 55 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: i % 4 === 0 ? "#7c3aed"
             : i % 4 === 1 ? "#22d3ee"
             : i % 4 === 2 ? "#a78bfa"
             : "#4f46e5",
        size: 1.2 + Math.random() * 2.2,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 7,
        driftX: (Math.random() - 0.5) * 80,
        driftY: 100 + Math.random() * 160,
      }))
    );
  }, [count]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      pointerEvents: "none", overflow: "hidden", zIndex: 0,
    }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            left: p.x, top: p.y,
          }}
          animate={{
            y: [0, -p.driftY, 0],
            x: [0, p.driftX, 0],
            opacity: [0, 0.85, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}