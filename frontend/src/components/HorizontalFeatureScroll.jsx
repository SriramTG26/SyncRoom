import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Zap, MessageSquare, Lock, Music, Clock, Share2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { icon: Zap,           color: "#7c3aed", title: "Real-Time Sync",   desc: "Every play, pause, seek instantly broadcast to every member." },
  { icon: MessageSquare, color: "#22d3ee", title: "Live Chat",         desc: "Chat while watching. Timestamps are clickable sync links." },
  { icon: Lock,          color: "#a78bfa", title: "Private Rooms",     desc: "Unique codes only. Your watch party, your rules." },
  { icon: Music,         color: "#4f46e5", title: "Shared Queue",      desc: "Anyone adds videos. Everyone votes. Playlist builds itself." },
  { icon: Clock,         color: "#06b6d4", title: "Timestamp Links",   desc: "Click 3:22 in chat — everyone jumps there instantly." },
  { icon: Share2,        color: "#7c3aed", title: "Instant Invites",   desc: "Share your code. Friends join in seconds." },
];

export default function HorizontalFeatureScroll() {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    // Amount to scroll horizontally
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 96);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "rgba(0,0,0,0.2)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>

      {/* Section label */}
      <div style={{
        position: "absolute", top: 40, left: 48, zIndex: 10,
      }}>
        <p style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
          What's inside
        </p>
        <h2 style={{
          fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
          fontSize: "clamp(2rem,3.5vw,3rem)",
          fontWeight: 900, letterSpacing: "-0.04em", color: "white", lineHeight: 1,
        }}>
          Every feature you need
          <span style={{ display: "block", background: "linear-gradient(135deg,#7c3aed,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            — actually in the app.
          </span>
        </h2>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 36, left: 48, zIndex: 10,
        display: "flex", alignItems: "center", gap: 10,
        color: "rgba(237,233,248,0.3)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
      }}>
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}>
          ──────→
        </motion.div>
        Scroll to explore
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 20,
          paddingLeft: 48,
          paddingRight: 48,
          height: "100%",
          alignItems: "center",
          width: "max-content",
        }}>

        {/* Intro text card */}
        <div style={{
          width: 380,
          flexShrink: 0,
          paddingTop: 100,
        }}>
          <p style={{ fontSize: 15, color: "rgba(237,233,248,0.42)", lineHeight: 1.85, maxWidth: 320 }}>
            Built from scratch for real-time group watching.
            <br/><br/>
            <span style={{ color: "rgba(237,233,248,0.7)", fontWeight: 600 }}>
              Every feature listed here is actually in the app — no fluff.
            </span>
          </p>
        </div>

        {/* Feature cards */}
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            whileHover={{ y: -12, boxShadow: `0 32px 64px ${card.color}22` }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            style={{
              width: 300,
              flexShrink: 0,
              padding: "32px 28px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(14px)",
              cursor: "default",
              transition: "border-color 0.2s",
              marginTop: i % 2 === 0 ? -40 : 40,  // alternating height
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${card.color}44`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
            <motion.div
              style={{
                width: 54, height: 54, borderRadius: 16,
                background: `${card.color}18`,
                border: `1px solid ${card.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}
              whileHover={{ scale: 1.18, rotate: 8 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <card.icon size={24} style={{ color: card.color }} />
            </motion.div>
            <h3 style={{
              fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
              fontSize: 18, fontWeight: 900, color: "white",
              marginBottom: 10, letterSpacing: "-0.03em",
            }}>{card.title}</h3>
            <p style={{ fontSize: 13, color: "rgba(237,233,248,0.42)", lineHeight: 1.75 }}>{card.desc}</p>
            <div style={{
              marginTop: 20, height: 2, borderRadius: 2,
              background: `linear-gradient(90deg,${card.color}88,transparent)`,
            }}/>
          </motion.div>
        ))}

        {/* End spacer */}
        <div style={{ width: 200, flexShrink: 0 }} />
      </div>
    </section>
  );
}