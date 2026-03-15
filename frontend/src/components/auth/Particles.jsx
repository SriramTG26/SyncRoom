import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#22d3ee" : "#818cf8",
        size: 1.5 + (i % 3) * 0.6,
        duration: 7 + Math.random() * 7,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 60,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            left: p.x, top: p.y,
          }}
          animate={{
            y: [0, -160, 0],
            x: [0, p.drift, 0],
            opacity: [0, 0.9, 0],
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