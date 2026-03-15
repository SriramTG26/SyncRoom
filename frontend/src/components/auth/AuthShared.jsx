import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const BG_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  size: (i % 3) + 1.2,
  duration: 10 + (i % 8),
  delay: (i * 0.4) % 7,
  color: i % 3 === 0 ? "#7C3AED" : i % 3 === 1 ? "#22D3EE" : "#818CF8",
}))

export const RINGS = [
  { size: 320, opacity: 0.06, delay: 0 },
  { size: 520, opacity: 0.04, delay: 0.5 },
  { size: 740, opacity: 0.025, delay: 1 },
]

export function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  shake,
  hint,
  children,
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -7, 7, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className="relative"
    >
      <AnimatePresence>
        {focused && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow:
                "0 0 0 2px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.15)",
            }}
          />
        )}
      </AnimatePresence>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 pt-6 pb-2 rounded-xl text-sm text-white outline-none"
        style={{
          background: focused
            ? "rgba(124,58,237,0.07)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${
            focused
              ? "rgba(124,58,237,0.55)"
              : shake
              ? "rgba(239,68,68,0.5)"
              : "rgba(255,255,255,0.09)"
          }`,
        }}
      />

      <label
        htmlFor={id}
        className="absolute left-4 pointer-events-none transition-all duration-200"
        style={{
          top: active ? "7px" : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? "9px" : "13px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </label>

      {hint && active && (
        <span className="absolute right-3 top-2 text-[9px] uppercase text-purple-300">
          {hint}
        </span>
      )}

      {children && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {children}
        </div>
      )}
    </motion.div>
  )
}

export function OrbitRing({ radius, count, color, duration }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i
        const rad = (angle * Math.PI) / 180
        const cx = 50 + radius * Math.cos(rad)
        const cy = 50 + radius * Math.sin(rad)

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              width: 3,
              height: 3,
              background: color,
              boxShadow: `0 0 6px ${color}`,
              transform: "translate(-50%,-50%)",
              opacity: 0.6,
            }}
          />
        )
      })}
    </motion.div>
  )
}