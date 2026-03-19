import { getRooms } from "../services/api";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Play, Plus, Hash, Search, Send, Bell,
  Users, Clock, ChevronRight, X, Check,
  LogOut, Edit3, Shield, Calendar, AlertCircle,
  Zap, ArrowRight, UserCheck, MessageSquare,
  Radio, Star, TrendingUp, Sparkles,
  UserPlus, Info
} from "lucide-react";
import PageParticles from "../components/PageParticles";
import { searchUsers, joinRoom as joinRoomAPI, getRooms } from "../services/api";

const C = {
  bg:      "#07040f",
  surface: "#0c0818",
  card:    "#110d1e",
  cardHi:  "#16102a",
  border:  "rgba(124,58,237,0.13)",
  borderHi:"rgba(124,58,237,0.32)",
  purple:  "#7c3aed",
  purpleL: "#a78bfa",
  glow:    "rgba(124,58,237,0.25)",
  cyan:    "#22d3ee",
  cyanG:   "rgba(34,211,238,0.18)",
  green:   "#10b981",
  amber:   "#f59e0b",
  rose:    "#f43f5e",
  text:    "#ede9f8",
  muted:   "rgba(237,233,248,0.48)",
  dim:     "rgba(237,233,248,0.22)",
  dimmer:  "rgba(237,233,248,0.1)",
};

const AVATARS = [
  { id:"cosmic",    svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1a0533"/><circle cx="50" cy="38" r="20" fill="#7c3aed"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#5b21b6"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2" fill="#1a0533"/><circle cx="59" cy="35" r="2" fill="#1a0533"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 44 Q50 49 56 44" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="35" cy="38" rx="6" ry="4" fill="#9d4edd" opacity="0.7"/><ellipse cx="65" cy="38" rx="6" ry="4" fill="#9d4edd" opacity="0.7"/><circle cx="30" cy="25" r="3" fill="#22d3ee" opacity="0.8"/><circle cx="70" cy="20" r="2" fill="#f59e0b" opacity="0.9"/><path d="M46 26 Q50 20 54 26" stroke="#a78bfa" stroke-width="1.5" fill="none"/></svg>` },
  { id:"surfer",    svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0c2340"/><circle cx="50" cy="38" r="20" fill="#0e7490"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#0891b2"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2" fill="#0c2340"/><circle cx="59" cy="35" r="2" fill="#0c2340"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 45 Q50 50 56 45" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 20 Q50 10 70 20 Q60 30 50 28 Q40 30 30 20Z" fill="#22d3ee" opacity="0.9"/></svg>` },
  { id:"phoenix",   svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1c0a00"/><circle cx="50" cy="38" r="20" fill="#c2410c"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#9a3412"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2.5" fill="#1c0a00"/><circle cx="59" cy="35" r="2.5" fill="#1c0a00"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 45 Q50 51 56 45" stroke="#fed7aa" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M45 18 Q50 8 55 18 Q52 14 50 20 Q48 14 45 18Z" fill="#f97316"/><path d="M40 20 Q44 10 48 20 Q45 15 43 22 Q41 15 40 20Z" fill="#fb923c"/><path d="M52 20 Q56 10 60 20 Q57 15 55 22 Q53 15 52 20Z" fill="#f97316"/></svg>` },
  { id:"nature",    svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#052e16"/><circle cx="50" cy="38" r="20" fill="#166534"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#15803d"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2" fill="#052e16"/><circle cx="59" cy="35" r="2" fill="#052e16"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 45 Q50 51 56 45" stroke="#bbf7d0" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 15 Q58 20 55 28 Q50 22 45 28 Q42 20 50 15Z" fill="#22c55e"/><circle cx="50" cy="15" r="3" fill="#4ade80"/></svg>` },
  { id:"warrior",   svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1a0010"/><circle cx="50" cy="38" r="20" fill="#9f1239"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#be123c"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2.5" fill="#1a0010"/><circle cx="59" cy="35" r="2.5" fill="#1a0010"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 45 Q50 51 56 45" stroke="#fda4af" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 15 Q50 5 72 15 L68 28 Q50 20 32 28Z" fill="#e11d48" opacity="0.9"/><rect x="47" y="5" width="6" height="15" rx="3" fill="#fb7185"/></svg>` },
  { id:"mage",      svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0f0520"/><circle cx="50" cy="38" r="20" fill="#4c1d95"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#5b21b6"/><circle cx="42" cy="34" r="4" fill="#ddd6fe"/><circle cx="58" cy="34" r="4" fill="#ddd6fe"/><circle cx="43" cy="35" r="2.5" fill="#4c1d95"/><circle cx="59" cy="35" r="2.5" fill="#4c1d95"/><circle cx="44" cy="33" r="1" fill="#ddd6fe"/><circle cx="60" cy="33" r="1" fill="#ddd6fe"/><path d="M44 45 Q50 51 56 45" stroke="#c4b5fd" stroke-width="2" fill="none" stroke-linecap="round"/><polygon points="50,5 53,15 63,15 55,21 58,31 50,25 42,31 45,21 37,15 47,15" fill="#7c3aed" opacity="0.9"/><circle cx="50" cy="18" r="4" fill="#a78bfa"/></svg>` },
  { id:"ocean",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0c1a2e"/><circle cx="50" cy="38" r="20" fill="#1e40af"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#1d4ed8"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2" fill="#0c1a2e"/><circle cx="59" cy="35" r="2" fill="#0c1a2e"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 45 Q50 50 56 45" stroke="#bfdbfe" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 22 Q35 15 50 22 Q35 18 20 22Z" fill="#3b82f6" opacity="0.8"/><path d="M50 22 Q65 15 80 22 Q65 18 50 22Z" fill="#60a5fa" opacity="0.7"/></svg>` },
  { id:"solar",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1c1400"/><circle cx="50" cy="38" r="20" fill="#b45309"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#d97706"/><circle cx="42" cy="34" r="4" fill="white"/><circle cx="58" cy="34" r="4" fill="white"/><circle cx="43" cy="35" r="2" fill="#1c1400"/><circle cx="59" cy="35" r="2" fill="#1c1400"/><circle cx="44" cy="34" r="1" fill="white"/><circle cx="60" cy="34" r="1" fill="white"/><path d="M44 45 Q50 51 56 45" stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="50" cy="15" r="8" fill="#fbbf24"/><line x1="50" y1="4" x2="50" y2="1" stroke="#fbbf24" stroke-width="2"/><line x1="65" y1="15" x2="68" y2="15" stroke="#fbbf24" stroke-width="2"/><line x1="35" y1="15" x2="32" y2="15" stroke="#fbbf24" stroke-width="2"/></svg>` },
  { id:"icequeen",  svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0a1628"/><circle cx="50" cy="38" r="20" fill="#1e3a5f"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#1a4a7a"/><circle cx="42" cy="34" r="4" fill="#e0f2fe"/><circle cx="58" cy="34" r="4" fill="#e0f2fe"/><circle cx="43" cy="35" r="2" fill="#0a1628"/><circle cx="59" cy="35" r="2" fill="#0a1628"/><circle cx="44" cy="33" r="1" fill="#e0f2fe"/><circle cx="60" cy="33" r="1" fill="#e0f2fe"/><path d="M44 45 Q50 50 56 45" stroke="#bae6fd" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M25 18 Q50 8 75 18 Q65 25 50 22 Q35 25 25 18Z" fill="#38bdf8"/><line x1="50" y1="5" x2="50" y2="12" stroke="#e0f2fe" stroke-width="2"/><circle cx="50" cy="5" r="2.5" fill="#e0f2fe"/></svg>` },
  { id:"neonpunk",  svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0d0d0d"/><circle cx="50" cy="38" r="20" fill="#1a1a2e"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#16213e"/><circle cx="42" cy="34" r="4" fill="#f0f0f0"/><circle cx="58" cy="34" r="4" fill="#f0f0f0"/><circle cx="43" cy="35" r="2.5" fill="#0d0d0d"/><circle cx="59" cy="35" r="2.5" fill="#0d0d0d"/><circle cx="44" cy="34" r="1" fill="#ff00ff"/><circle cx="60" cy="34" r="1" fill="#00ffff"/><path d="M44 45 Q50 51 56 45" stroke="#ff00ff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 15 L35 8 L40 15 L45 5 L50 15 L55 5 L60 15 L65 8 L70 15" stroke="#ff00ff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>` },
  { id:"forestelf", svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0a1a0a"/><circle cx="50" cy="38" r="20" fill="#14532d"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#166534"/><circle cx="42" cy="34" r="4" fill="#d1fae5"/><circle cx="58" cy="34" r="4" fill="#d1fae5"/><circle cx="43" cy="35" r="2" fill="#0a1a0a"/><circle cx="59" cy="35" r="2" fill="#0a1a0a"/><circle cx="44" cy="33" r="1" fill="#d1fae5"/><circle cx="60" cy="33" r="1" fill="#d1fae5"/><path d="M44 45 Q50 50 56 45" stroke="#a7f3d0" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M32 35 Q28 25 35 20 Q32 30 38 28Z" fill="#22c55e"/><path d="M68 35 Q72 25 65 20 Q68 30 62 28Z" fill="#22c55e"/><circle cx="50" cy="15" r="4" fill="#4ade80"/></svg>` },
  { id:"nomad",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1c1008"/><circle cx="50" cy="38" r="20" fill="#92400e"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#b45309"/><circle cx="42" cy="34" r="4" fill="#fef3c7"/><circle cx="58" cy="34" r="4" fill="#fef3c7"/><circle cx="43" cy="35" r="2" fill="#1c1008"/><circle cx="59" cy="35" r="2" fill="#1c1008"/><circle cx="44" cy="33" r="1" fill="#fef3c7"/><circle cx="60" cy="33" r="1" fill="#fef3c7"/><path d="M44 45 Q50 50 56 45" stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 25 Q50 10 80 25 Q70 18 50 15 Q30 18 20 25Z" fill="#d97706"/></svg>` },
  { id:"storm",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0f0f1a"/><circle cx="50" cy="38" r="20" fill="#1e1b4b"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#312e81"/><circle cx="42" cy="34" r="4" fill="#e0e7ff"/><circle cx="58" cy="34" r="4" fill="#e0e7ff"/><circle cx="43" cy="35" r="2.5" fill="#0f0f1a"/><circle cx="59" cy="35" r="2.5" fill="#0f0f1a"/><circle cx="44" cy="33" r="1" fill="#a5b4fc"/><circle cx="60" cy="33" r="1" fill="#a5b4fc"/><path d="M44 46 Q50 52 56 46" stroke="#c7d2fe" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M25 20 L35 8 L38 18 L48 5 L44 20 L55 10 L50 22 L62 12 L57 24 L70 18 L60 28 L30 28Z" fill="#6366f1" opacity="0.9"/></svg>` },
  { id:"blossom",   svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1a0a0f"/><circle cx="50" cy="38" r="20" fill="#881337"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#9f1239"/><circle cx="42" cy="34" r="4" fill="#ffe4e6"/><circle cx="58" cy="34" r="4" fill="#ffe4e6"/><circle cx="43" cy="35" r="2" fill="#1a0a0f"/><circle cx="59" cy="35" r="2" fill="#1a0a0f"/><circle cx="44" cy="33" r="1" fill="#ffe4e6"/><circle cx="60" cy="33" r="1" fill="#ffe4e6"/><path d="M44 45 Q50 51 56 45" stroke="#fda4af" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="50" cy="14" r="5" fill="#fb7185"/><circle cx="40" cy="18" r="4" fill="#f43f5e"/><circle cx="60" cy="18" r="4" fill="#f43f5e"/><circle cx="35" cy="12" r="3.5" fill="#fb7185"/><circle cx="65" cy="12" r="3.5" fill="#fb7185"/></svg>` },
  { id:"techbot",   svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#050a14"/><circle cx="50" cy="38" r="20" fill="#0f2040"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#0a1a30"/><rect x="38" y="30" width="8" height="8" rx="2" fill="#22d3ee"/><rect x="54" y="30" width="8" height="8" rx="2" fill="#22d3ee"/><rect x="40" y="31" width="4" height="4" rx="1" fill="#0f2040"/><rect x="56" y="31" width="4" height="4" rx="1" fill="#0f2040"/><rect x="41" y="32" width="2" height="2" fill="#22d3ee"/><rect x="57" y="32" width="2" height="2" fill="#22d3ee"/><rect x="42" y="43" width="16" height="4" rx="2" fill="#22d3ee" opacity="0.7"/><rect x="20" y="8" width="60" height="25" rx="8" fill="#0a1528" stroke="#22d3ee" stroke-width="1.5"/><circle cx="50" cy="8" r="3" fill="#22d3ee" opacity="0.8"/></svg>` },
  { id:"shadowfox", svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0d0500"/><circle cx="50" cy="40" r="20" fill="#7c2d12"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#9a3412"/><circle cx="42" cy="36" r="4" fill="#fef9c3"/><circle cx="58" cy="36" r="4" fill="#fef9c3"/><circle cx="43" cy="37" r="2.5" fill="#0d0500"/><circle cx="59" cy="37" r="2.5" fill="#0d0500"/><circle cx="44" cy="36" r="1" fill="#fef9c3"/><circle cx="60" cy="36" r="1" fill="#fef9c3"/><path d="M44 47 Q50 53 56 47" stroke="#fed7aa" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M35 20 L30 5 L42 18Z" fill="#c2410c"/><path d="M65 20 L70 5 L58 18Z" fill="#c2410c"/></svg>` },
  { id:"witch",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#100820"/><circle cx="50" cy="38" r="20" fill="#3b0764"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#4a044e"/><circle cx="42" cy="34" r="4" fill="#f5d0fe"/><circle cx="58" cy="34" r="4" fill="#f5d0fe"/><circle cx="43" cy="35" r="2.5" fill="#100820"/><circle cx="59" cy="35" r="2.5" fill="#100820"/><circle cx="44" cy="33" r="1" fill="#e879f9"/><circle cx="60" cy="33" r="1" fill="#e879f9"/><path d="M44 45 Q50 51 56 45" stroke="#f0abfc" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 22 L45 5 L50 10 L55 5Z" fill="#a21caf"/><path d="M30 22 Q50 12 70 22 Q60 18 50 16 Q40 18 30 22Z" fill="#7e22ce"/><circle cx="50" cy="9" r="4" fill="#e879f9"/></svg>` },
  { id:"titan",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0a0a0a"/><circle cx="50" cy="38" r="20" fill="#374151"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#4b5563"/><circle cx="42" cy="34" r="4" fill="#f9fafb"/><circle cx="58" cy="34" r="4" fill="#f9fafb"/><circle cx="43" cy="35" r="2.5" fill="#0a0a0a"/><circle cx="59" cy="35" r="2.5" fill="#0a0a0a"/><circle cx="44" cy="34" r="1" fill="#f9fafb"/><circle cx="60" cy="34" r="1" fill="#f9fafb"/><path d="M44 46 Q50 52 56 46" stroke="#d1d5db" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 22 Q50 10 78 22 L72 30 Q50 22 28 30Z" fill="#6b7280"/><rect x="46" y="6" width="8" height="18" rx="2" fill="#9ca3af"/></svg>` },
  { id:"dragon",    svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0f0500"/><circle cx="50" cy="38" r="20" fill="#7f1d1d"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#991b1b"/><circle cx="42" cy="34" r="4" fill="#fff7ed"/><circle cx="58" cy="34" r="4" fill="#fff7ed"/><circle cx="43" cy="35" r="2.5" fill="#0f0500"/><circle cx="59" cy="35" r="2.5" fill="#0f0500"/><circle cx="44" cy="34" r="1" fill="#fbbf24"/><circle cx="60" cy="34" r="1" fill="#fbbf24"/><path d="M44 46 Q50 53 56 46" stroke="#fed7aa" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M30 22 L25 8 L36 20Z" fill="#dc2626"/><path d="M70 22 L75 8 L64 20Z" fill="#dc2626"/><path d="M42 18 L38 6 L48 16Z" fill="#ef4444"/><path d="M58 18 L62 6 L52 16Z" fill="#ef4444"/></svg>` },
  { id:"panda",     svg:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#0a0a14"/><circle cx="50" cy="40" r="22" fill="#f8fafc"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#e2e8f0"/><ellipse cx="38" cy="30" rx="9" ry="9" fill="#1e293b"/><ellipse cx="62" cy="30" rx="9" ry="9" fill="#1e293b"/><circle cx="38" cy="30" r="5" fill="#f8fafc"/><circle cx="62" cy="30" r="5" fill="#f8fafc"/><circle cx="38" cy="30" r="3" fill="#0f172a"/><circle cx="62" cy="30" r="3" fill="#0f172a"/><circle cx="39" cy="29" r="1.2" fill="white"/><circle cx="63" cy="29" r="1.2" fill="white"/><ellipse cx="50" cy="46" rx="6" ry="4" fill="#fecdd3"/><path d="M44 44 Q50 50 56 44" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="18" rx="7" ry="8" fill="#1e293b"/><ellipse cx="66" cy="18" rx="7" ry="8" fill="#1e293b"/><ellipse cx="34" cy="18" rx="4" ry="5" fill="#334155"/><ellipse cx="66" cy="18" rx="4" ry="5" fill="#334155"/></svg>` },
];

const AVATARS_WITH_LABELS = [
  {id:"cosmic",label:"Cosmic"},{id:"surfer",label:"Surfer"},
  {id:"phoenix",label:"Phoenix"},{id:"nature",label:"Nature"},
  {id:"warrior",label:"Warrior"},{id:"mage",label:"Mage"},
  {id:"ocean",label:"Ocean"},{id:"solar",label:"Solar"},
  {id:"icequeen",label:"Ice Queen"},{id:"neonpunk",label:"Neon Punk"},
  {id:"forestelf",label:"Forest Elf"},{id:"nomad",label:"Nomad"},
  {id:"storm",label:"Storm"},{id:"blossom",label:"Blossom"},
  {id:"techbot",label:"Tech Bot"},{id:"shadowfox",label:"Shadow Fox"},
  {id:"witch",label:"Witch"},{id:"titan",label:"Titan"},
  {id:"dragon",label:"Dragon"},{id:"panda",label:"Panda"},
];

const RECENT_ROOMS = [
  { code:"XKCD42", name:"Friday Night Vibes", members:4, ago:"2h ago", active:true  },
  { code:"M9QP11", name:"Dev Hangout",         members:2, ago:"1d ago", active:false },
];

const VIBES = {
  morning:   ["Rise & sync,","Fresh start,","Morning crew,"],
  afternoon: ["Crushing it,","Stay locked in,","Midday sync,"],
  evening:   ["Chill hours,","Evening sync,","Settling in,"],
  night:     ["Late night crew,","Midnight sync,","Burning bright,"],
};

// ── notification types with icons / colors
const notifMeta = {
  invite:  { color:"#7c3aed", label:"Room Invite" },
  friend:  { color:"#22d3ee", label:"Friend Request" },
  system:  { color:"#f59e0b", label:"System" },
  joined:  { color:"#10b981", label:"Joined" },
};

export default function Dashboard() {
  const navigate  = useNavigate();
  const bellRef   = useRef(null);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  });

  const username  = user.username || "Syncer";
  const userEmail = user.email    || "";

  // ── states ──
  const [showJoin,        setShowJoin]        = useState(false);
  const [showProfile,     setShowProfile]     = useState(false);
  const [showNotifs,      setShowNotifs]      = useState(false);
  const [joinCode,        setJoinCode]        = useState("");
  const [joinError,       setJoinError]       = useState("");
  const [joiningRoom,     setJoiningRoom]     = useState(false);
  const [friendSearch,    setFriendSearch]    = useState("");
  const [sentInvites,     setSentInvites]     = useState(new Set());
  const [searchResults,   setSearchResults]   = useState([]);
  const [searching,       setSearching]       = useState(false);
  const [editUsername,    setEditUsername]    = useState(username);
  const [saveMsg,         setSaveMsg]         = useState("");
  const [canRename,       setCanRename]       = useState(true);
  const [daysLeft,        setDaysLeft]        = useState(0);
  const [selectedAvatar,  setSelectedAvatar]  = useState(user.avatar?.id || "cosmic");
  const [recentRooms, setRecentRooms] = useState([]);
  const [notifications, setNotifications] = useState([
    { id:1, type:"invite",  from:"Arun",    color:"#7c3aed", title:"Room Invite",     body:"Hey! Join my room tonight 🎬",         time:"2m ago",  read:false, roomCode:"ARUN1" },
    { id:2, type:"invite",  from:"Maya R.", color:"#22d3ee", title:"Room Invite",     body:"Room's open, come watch with us!",      time:"15m ago", read:false, roomCode:"MAYA2" },
    { id:3, type:"friend",  from:"Jordan",  color:"#f59e0b", title:"Friend Request",  body:"Jordan wants to connect with you",      time:"1h ago",  read:true,  roomCode:null },
    { id:4, type:"system",  from:"System",  color:"#f59e0b", title:"Welcome!",        body:"Welcome to Syncroom — start watching!", time:"1d ago",  read:true,  roomCode:null },
  ]);

  const unread = notifications.filter(n => !n.read).length;

  // Close notifs on outside click
  useEffect(() => {
    const handler = (e) => {
      if (showNotifs && bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  useEffect(() => {
  const fetchRooms = async () => {
    try {
      const d = await getRooms();
      setRecentRooms(d.rooms || []);
    } catch {
      setRecentRooms([]);
    }
  };
  fetchRooms();
}, []);// rename cooldown
  useEffect(() => {
    const last = localStorage.getItem("lastRenamed");
    if (last) {
      const days = Math.ceil(7 - (Date.now()-parseInt(last))/(1000*60*60*24));
      if (days > 0) { setCanRename(false); setDaysLeft(days); }
    }
  }, []);

  // friend search
  useEffect(() => {
    if (!friendSearch.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try { const d = await searchUsers(friendSearch); setSearchResults(d.users||[]); }
      catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [friendSearch]);

  const markAllRead = () => setNotifications(p => p.map(n => ({...n, read:true})));
  const dismissNotif = (id) => setNotifications(p => p.filter(n => n.id !== id));
  const acceptInvite = (n) => { markRead(n.id); navigate("/room"); };
  const markRead     = (id) => setNotifications(p => p.map(n => n.id===id?{...n,read:true}:n));

  const saveProfile = () => {
    if (!editUsername.trim()) return;
    const updated = { ...user, username:canRename?editUsername.trim():user.username, avatar:{...user.avatar,id:selectedAvatar} };
    if (canRename && editUsername.trim()!==username) {
      localStorage.setItem("lastRenamed", Date.now().toString());
      setCanRename(false); setDaysLeft(7);
    }
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setSaveMsg("Saved!");
    setTimeout(()=>{ setSaveMsg(""); setShowProfile(false); }, 1000);
  };

  const joinRoom = async () => {
    if (!joinCode.trim()) return;
    setJoiningRoom(true); setJoinError("");
    try {
      const d = await joinRoomAPI(joinCode.trim());
      localStorage.setItem("currentRoom", JSON.stringify(d.room));
      navigate("/room");
    } catch(e) { setJoiningRoom(false); setJoinError(e.message); }
  };

  const sendInvite = (u) => setSentInvites(p => new Set([...p, u._id||u.id]));

  const hour    = new Date().getHours();
  const vibeKey = hour<6?"night":hour<12?"morning":hour<17?"afternoon":hour<22?"evening":"night";
  const vibe    = VIBES[vibeKey][Math.floor(Date.now()/86400000)%3];
  const avatarSvg = AVATARS.find(a=>a.id===selectedAvatar)?.svg || AVATARS[0].svg;

  const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.07 }} };
  const fadeUp  = { hidden:{opacity:0,y:16,filter:"blur(3px)"}, show:{opacity:1,y:0,filter:"blur(0px)",transition:{type:"spring",stiffness:300,damping:28}} };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"system-ui,sans-serif", position:"relative", overflowY:"auto" }}>

      {/* bg */}
      <div style={{ position:"fixed",top:"-20%",left:"50%",transform:"translateX(-50%)",width:900,height:600,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse,rgba(124,58,237,0.14) 0%,transparent 65%)",filter:"blur(70px)" }}/>
      <div style={{ position:"fixed",bottom:"-10%",right:"-5%",width:500,height:500,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse,rgba(34,211,238,0.07) 0%,transparent 65%)",filter:"blur(60px)" }}/>
      <svg style={{ position:"fixed",inset:0,width:"100%",height:"100%",opacity:0.025,zIndex:0,pointerEvents:"none" }}>
        <defs><pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(124,58,237,0.6)" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>
      <PageParticles count={55}/>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position:"sticky",top:0,zIndex:40,
        height:60,display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"0 32px",
        background:"rgba(7,4,15,0.88)",
        backdropFilter:"blur(28px)",
        borderBottom:`1px solid ${C.border}`,
      }}>

        {/* Logo */}
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <motion.div whileHover={{scale:1.06}} style={{
            width:36,height:36,borderRadius:11,
            background:`linear-gradient(135deg,${C.purple},${C.cyan})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 0 18px ${C.glow}`,
          }}>
            <Play size={15} fill="white" color="white" style={{marginLeft:2}}/>
          </motion.div>
          <div>
            <div style={{ fontWeight:900,fontSize:17,letterSpacing:"-0.03em",lineHeight:1 }}>
              Sync<span style={{color:C.purpleL}}>room</span>
            </div>
            <div style={{ fontSize:8,color:C.dimmer,letterSpacing:"0.16em",textTransform:"uppercase",marginTop:1 }}>Watch Together</div>
          </div>
        </div>

        {/* Center pill */}
        <div style={{ display:"flex",alignItems:"center",gap:6,
          padding:"6px 14px",borderRadius:20,
          background:"rgba(16,185,129,0.08)",
          border:"1px solid rgba(16,185,129,0.18)",
          fontSize:11,color:C.green,fontWeight:600,
        }}>
          <motion.div style={{width:6,height:6,borderRadius:"50%",background:C.green}}
            animate={{opacity:[1,0.3,1],scale:[1,0.7,1]}} transition={{duration:2,repeat:Infinity}}/>
          Platform Live
        </div>

        {/* Right actions */}
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>

          {/* ── Bell / Notification centre ── */}
          <div ref={bellRef} style={{ position:"relative" }}>
            <motion.button
              whileHover={{scale:1.08}} whileTap={{scale:0.92}}
              onClick={()=>setShowNotifs(v=>!v)}
              style={{
                position:"relative",width:40,height:40,borderRadius:12,
                background:showNotifs?"rgba(124,58,237,0.2)":unread>0?"rgba(124,58,237,0.12)":"rgba(255,255,255,0.05)",
                border:`1px solid ${showNotifs||unread>0?"rgba(124,58,237,0.4)":"rgba(255,255,255,0.08)"}`,
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                color:showNotifs||unread>0?C.purpleL:C.muted,
              }}>
              <Bell size={16}/>
              {unread > 0 && (
                <motion.div
                  initial={{scale:0}} animate={{scale:1}}
                  style={{
                    position:"absolute",top:7,right:7,
                    width:9,height:9,borderRadius:"50%",
                    background:C.rose,border:`2px solid ${C.bg}`,
                    boxShadow:`0 0 8px ${C.rose}55`,
                  }}>
                  <motion.div animate={{scale:[1,1.5,1]}} transition={{duration:1.8,repeat:Infinity}}
                    style={{width:"100%",height:"100%",borderRadius:"50%",background:C.rose}}/>
                </motion.div>
              )}
            </motion.button>

            {/* ── Notification Dropdown ── */}
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{opacity:0,y:8,scale:0.96}}
                  animate={{opacity:1,y:0,scale:1}}
                  exit={{opacity:0,y:8,scale:0.96}}
                  transition={{duration:0.18,ease:"easeOut"}}
                  style={{
                    position:"absolute",top:"calc(100% + 10px)",right:0,
                    width:340,borderRadius:16,
                    background:C.card,
                    border:`1px solid ${C.borderHi}`,
                    boxShadow:`0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.1)`,
                    overflow:"hidden",zIndex:50,
                  }}>

                  {/* shimmer */}
                  <motion.div style={{
                    height:"2px",
                    background:"linear-gradient(90deg,transparent,#7c3aed,#22d3ee,transparent)",
                    backgroundSize:"200% 100%",
                  }}
                    animate={{backgroundPosition:["0%","200%"]}}
                    transition={{duration:3,repeat:Infinity,ease:"linear"}}/>

                  {/* header */}
                  <div style={{
                    padding:"14px 16px 10px",
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    borderBottom:`1px solid ${C.border}`,
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Bell size={13} color={C.purpleL}/>
                      <span style={{fontSize:13,fontWeight:800,color:C.text}}>Notifications</span>
                      {unread>0&&(
                        <span style={{
                          fontSize:9,fontWeight:800,color:C.rose,
                          padding:"2px 7px",borderRadius:8,
                          background:"rgba(244,63,94,0.14)",
                          border:"1px solid rgba(244,63,94,0.28)",
                        }}>{unread} new</span>
                      )}
                    </div>
                    {unread>0&&(
                      <button onClick={markAllRead}
                        style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:C.purpleL,fontWeight:600}}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* list */}
                  <div style={{
                    maxHeight:380,overflowY:"auto",
                    padding:"6px 8px",
                    display:"flex",flexDirection:"column",gap:4,
                  }} className="no-scrollbar">
                    {notifications.length===0 ? (
                      <div style={{padding:"28px 16px",textAlign:"center",color:C.dim}}>
                        <Bell size={20} style={{opacity:0.25,margin:"0 auto 8px",display:"block"}}/>
                        <p style={{fontSize:12}}>All caught up!</p>
                      </div>
                    ) : notifications.map((n,i)=>(
                      <motion.div key={n.id}
                        initial={{opacity:0,x:8}} animate={{opacity:1,x:0}}
                        transition={{delay:i*0.04}}
                        style={{
                          padding:"11px 11px",borderRadius:11,
                          background:n.read?"rgba(255,255,255,0.02)":"rgba(124,58,237,0.08)",
                          border:`1px solid ${n.read?"rgba(255,255,255,0.04)":"rgba(124,58,237,0.2)"}`,
                          transition:"all 0.15s",
                          cursor:"default",
                        }}
                        onMouseEnter={e=>e.currentTarget.style.background=n.read?"rgba(255,255,255,0.04)":"rgba(124,58,237,0.12)"}
                        onMouseLeave={e=>e.currentTarget.style.background=n.read?"rgba(255,255,255,0.02)":"rgba(124,58,237,0.08)"}
                      >
                        {/* top row */}
                        <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:6}}>
                          {/* icon */}
                          <div style={{
                            width:32,height:32,borderRadius:9,flexShrink:0,
                            background:`${n.color}22`,
                            border:`1px solid ${n.color}44`,
                            display:"flex",alignItems:"center",justifyContent:"center",
                          }}>
                            {n.type==="invite" && <Play size={13} color={n.color} fill={n.color}/>}
                            {n.type==="friend" && <UserPlus size={13} color={n.color}/>}
                            {n.type==="system" && <Info size={13} color={n.color}/>}
                            {n.type==="joined" && <UserCheck size={13} color={n.color}/>}
                          </div>

                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                              <span style={{fontSize:11,fontWeight:700,color:C.text}}>{n.title}</span>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{fontSize:9,color:C.dimmer}}>{n.time}</span>
                                {!n.read&&<div style={{width:6,height:6,borderRadius:"50%",background:C.purple,flexShrink:0}}/>}
                              </div>
                            </div>
                            <span style={{fontSize:10,color:n.color,fontWeight:600}}>from {n.from}</span>
                          </div>

                          <motion.button whileTap={{scale:0.85}}
                            onClick={()=>dismissNotif(n.id)}
                            style={{background:"none",border:"none",cursor:"pointer",color:C.dimmer,display:"flex",flexShrink:0,padding:2}}>
                            <X size={11}/>
                          </motion.button>
                        </div>

                        {/* body */}
                        <p style={{
                          fontSize:11,color:C.muted,lineHeight:1.5,
                          padding:"7px 9px",borderRadius:7,
                          background:"rgba(255,255,255,0.03)",
                          marginBottom:n.type==="invite"?8:0,
                        }}>{n.body}</p>

                        {/* invite actions */}
                        {n.type==="invite" && n.roomCode && (
                          <div style={{display:"flex",gap:6,marginTop:2}}>
                            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.95}}
                              onClick={()=>acceptInvite(n)}
                              style={{
                                flex:1,padding:"6px 0",borderRadius:7,
                                background:`linear-gradient(135deg,${C.purple},#4f46e5)`,
                                border:"none",cursor:"pointer",
                                color:"white",fontSize:10,fontWeight:700,
                                display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                                boxShadow:`0 0 10px ${C.glow}`,
                              }}>
                              <UserCheck size={10}/> Join Room
                            </motion.button>
                            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.95}}
                              onClick={()=>dismissNotif(n.id)}
                              style={{
                                flex:1,padding:"6px 0",borderRadius:7,
                                background:"rgba(255,255,255,0.05)",
                                border:"1px solid rgba(255,255,255,0.08)",
                                cursor:"pointer",color:C.dim,fontSize:10,fontWeight:600,
                                display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                              }}>
                              <X size={10}/> Dismiss
                            </motion.button>
                          </div>
                        )}

                        {/* friend request actions */}
                        {n.type==="friend" && (
                          <div style={{display:"flex",gap:6,marginTop:2}}>
                            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.95}}
                              onClick={()=>markRead(n.id)}
                              style={{
                                flex:1,padding:"6px 0",borderRadius:7,
                                background:"rgba(34,211,238,0.12)",
                                border:"1px solid rgba(34,211,238,0.28)",
                                cursor:"pointer",color:C.cyan,fontSize:10,fontWeight:700,
                                display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                              }}>
                              <Check size={10}/> Accept
                            </motion.button>
                            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.95}}
                              onClick={()=>dismissNotif(n.id)}
                              style={{
                                flex:1,padding:"6px 0",borderRadius:7,
                                background:"rgba(255,255,255,0.05)",
                                border:"1px solid rgba(255,255,255,0.08)",
                                cursor:"pointer",color:C.dim,fontSize:10,fontWeight:600,
                                display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                              }}>
                              <X size={10}/> Decline
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* footer */}
                  <div style={{
                    padding:"10px 14px",
                    borderTop:`1px solid ${C.border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    <button
                      onClick={()=>setNotifications([])}
                      style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:C.dim,fontWeight:500}}>
                      Clear all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <motion.div
            whileHover={{scale:1.08}} whileTap={{scale:0.94}}
            onClick={()=>setShowProfile(true)}
            style={{
              width:40,height:40,borderRadius:"50%",
              overflow:"hidden",cursor:"pointer",
              border:`2px solid rgba(124,58,237,0.42)`,
              boxShadow:`0 0 16px ${C.glow}`,
              flexShrink:0,
            }}
            dangerouslySetInnerHTML={{__html:avatarSvg}}
          />

          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.2}}>{username}</span>
            <span style={{fontSize:9,color:C.dimmer}}>click to edit profile</span>
          </div>

          <motion.button whileTap={{scale:0.95}}
            onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}}
            style={{
              display:"flex",alignItems:"center",gap:5,
              padding:"7px 14px",borderRadius:9,
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.07)",
              color:C.dim,fontSize:11,fontWeight:600,cursor:"pointer",
            }}>
            <LogOut size={12}/> Sign Out
          </motion.button>
        </div>
      </nav>

      {/* ══ MAIN ══ */}
      <div style={{ position:"relative",zIndex:1,maxWidth:1060,margin:"0 auto",padding:"40px 28px 60px" }}>
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* ── Hero ── */}
          <motion.div variants={fadeUp} style={{marginBottom:40}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:C.purpleL,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:7,display:"flex",alignItems:"center",gap:6}}>
                  <Sparkles size={10}/> SYNCROOM DASHBOARD
                </div>
                <h1 style={{fontSize:"2.3rem",fontWeight:900,letterSpacing:"-0.03em",color:"white",marginBottom:7,lineHeight:1.1}}>
                  {vibe}{" "}
                  <span style={{background:"linear-gradient(135deg,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    {username}
                  </span>
                </h1>
                <p style={{fontSize:13,color:C.muted,maxWidth:480}}>
                  Your watch party hub — create rooms, invite friends, and sync up in real-time.
                </p>
              </div>

              {/* Stats */}
              <div style={{display:"flex",gap:8}}>
                {[
                  {icon:<Radio size={12}/>,  label:"Rooms",   val:"2",    c:C.purpleL},
                  {icon:<Users size={12}/>,  label:"Friends", val:"5",    c:C.cyan},
                  {icon:<Star size={12}/>,   label:"Vibe",    val:"100%", c:C.amber},
                ].map(s=>(
                  <div key={s.label} style={{
                    padding:"12px 16px",borderRadius:14,textAlign:"center",
                    background:C.card,border:`1px solid ${C.border}`,
                    minWidth:72,
                  }}>
                    <div style={{color:s.c,marginBottom:4,display:"flex",justifyContent:"center"}}>{s.icon}</div>
                    <div style={{fontSize:16,fontWeight:900,color:"white"}}>{s.val}</div>
                    <div style={{fontSize:8,color:C.dimmer,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Action Cards ── */}
          <motion.div variants={fadeUp} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>

            {/* Create Room */}
            <motion.button
              whileHover={{scale:1.02,y:-3}} whileTap={{scale:0.98}}
              onClick={()=>navigate("/create-room")}
              style={{
                padding:"26px 24px",borderRadius:18,cursor:"pointer",
                background:"linear-gradient(145deg,rgba(124,58,237,0.16),rgba(79,70,229,0.07))",
                border:"1px solid rgba(124,58,237,0.26)",
                display:"flex",flexDirection:"column",gap:14,textAlign:"left",
                position:"relative",overflow:"hidden",
              }}>
              <div style={{position:"absolute",top:"-40px",right:"-40px",width:140,height:140,borderRadius:"50%",background:"rgba(124,58,237,0.1)",filter:"blur(35px)",pointerEvents:"none"}}/>
              <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${C.purple},#4f46e5)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${C.glow}`}}>
                <Plus size={22} color="white"/>
              </div>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:"white",marginBottom:5}}>Create Room</div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.65}}>
                  Start a new watch session. Set it public or private, configure your squad size, and go live.
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.purpleL,fontWeight:700}}>
                <Zap size={11} fill={C.purpleL}/> Get started <ArrowRight size={11}/>
              </div>
            </motion.button>

            {/* Join Room */}
            <div>
              <motion.button
                whileHover={{scale:1.02,y:-3}} whileTap={{scale:0.98}}
                onClick={()=>setShowJoin(v=>!v)}
                style={{
                  width:"100%",padding:"26px 24px",borderRadius:18,cursor:"pointer",
                  background:"linear-gradient(145deg,rgba(34,211,238,0.09),rgba(6,182,212,0.04))",
                  border:"1px solid rgba(34,211,238,0.2)",
                  display:"flex",flexDirection:"column",gap:14,textAlign:"left",
                  position:"relative",overflow:"hidden",
                }}>
                <div style={{position:"absolute",top:"-40px",right:"-40px",width:140,height:140,borderRadius:"50%",background:"rgba(34,211,238,0.07)",filter:"blur(35px)",pointerEvents:"none"}}/>
                <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#0891b2,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(34,211,238,0.28)"}}>
                  <Hash size={22} color="white"/>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:900,color:"white",marginBottom:5}}>Join Room</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.65}}>
                    Enter a room code and jump in. Sync with anyone, anywhere in real-time.
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.cyan,fontWeight:700}}>
                  <Hash size={11}/> Enter code <ArrowRight size={11}/>
                </div>
              </motion.button>

              {/* Join form */}
              <AnimatePresence>
                {showJoin && (
                  <motion.div
                    initial={{opacity:0,height:0,marginTop:0}}
                    animate={{opacity:1,height:"auto",marginTop:10}}
                    exit={{opacity:0,height:0,marginTop:0}}
                    style={{overflow:"hidden"}}>
                    <div style={{padding:"16px 18px",borderRadius:14,background:C.card,border:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",gap:8}}>
                        <input
                          value={joinCode}
                          onChange={e=>setJoinCode(e.target.value.toUpperCase())}
                          onKeyDown={e=>e.key==="Enter"&&joinRoom()}
                          placeholder="Enter room code…"
                          maxLength={8}
                          style={{
                            flex:1,padding:"10px 14px",borderRadius:9,
                            background:"rgba(255,255,255,0.05)",
                            border:"1px solid rgba(255,255,255,0.09)",
                            color:"white",fontSize:13,outline:"none",
                            fontFamily:"monospace",letterSpacing:"0.1em",
                          }}
                          onFocus={e=>e.target.style.borderColor="rgba(34,211,238,0.45)"}
                          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.09)"}
                        />
                        <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                          onClick={joinRoom} disabled={joiningRoom}
                          style={{
                            padding:"10px 16px",borderRadius:9,
                            background:"linear-gradient(135deg,#0891b2,#22d3ee)",
                            border:"none",cursor:"pointer",
                            color:"white",fontSize:12,fontWeight:700,
                            whiteSpace:"nowrap",opacity:joiningRoom?0.7:1,
                          }}>
                          {joiningRoom?"…":"Join →"}
                        </motion.button>
                      </div>
                      {joinError&&<div style={{marginTop:7,fontSize:11,color:C.rose,padding:"6px 10px",borderRadius:7,background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.22)"}}>{joinError}</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Bottom row ── */}
          <motion.div variants={fadeUp} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>

            {/* Recent Rooms */}
            <div style={{padding:"20px 22px",borderRadius:18,background:C.card,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <Clock size={13} color={C.purpleL}/>
                  <span style={{fontSize:10,fontWeight:800,letterSpacing:"0.14em",color:C.dim,textTransform:"uppercase"}}>Recent Rooms</span>
                </div>
               <span style={{fontSize:9,color:C.dimmer}}>{recentRooms.length} rooms</span>
              </div>
              {recentRooms.map((r,i)=>(
                <motion.div key={r.code}
                  initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                  transition={{delay:0.4+i*0.08}}
                  whileHover={{x:4}}
                  onClick={()=>navigate("/room")}
                  style={{
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"11px 10px",borderRadius:11,cursor:"pointer",
                    transition:"background 0.15s",marginBottom:6,
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,0.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{
                      width:36,height:36,borderRadius:10,
                      background:r.active?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                      border:`1px solid ${r.active?"rgba(124,58,237,0.28)":"rgba(255,255,255,0.06)"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      position:"relative",
                    }}>
                      <Play size={13} fill={r.active?C.purpleL:"#444"} color={r.active?C.purpleL:"#444"}/>
                      {r.active&&<div style={{position:"absolute",top:5,right:5,width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 5px ${C.green}`}}/>}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.name}</div>
                      <div style={{fontSize:10,color:C.dim,marginTop:2}}>{r.members?.length || 0} members</div>
                    </div>
                  </div>
                  <span style={{fontSize:9,fontWeight:800,color:C.purpleL,padding:"3px 9px",borderRadius:6,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.18)",fontFamily:"monospace",letterSpacing:"0.07em"}}>{r.code}</span>
                </motion.div>
              ))}
            </div>

            {/* Find Friends */}
            <div style={{padding:"20px 22px",borderRadius:18,background:C.card,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                <Users size={13} color={C.cyan}/>
                <span style={{fontSize:10,fontWeight:800,letterSpacing:"0.14em",color:C.dim,textTransform:"uppercase"}}>Find Friends</span>
              </div>
              <div style={{position:"relative",marginBottom:10}}>
                <Search size={12} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.dim,pointerEvents:"none"}}/>
                <input
                  value={friendSearch} onChange={e=>setFriendSearch(e.target.value)}
                  placeholder="Search by username…"
                  style={{
                    width:"100%",padding:"9px 12px 9px 32px",
                    borderRadius:9,fontSize:12,color:"white",outline:"none",
                    background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(255,255,255,0.08)",
                    boxSizing:"border-box",transition:"border 0.18s",
                  }}
                  onFocus={e=>e.target.style.borderColor="rgba(34,211,238,0.38)"}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}
                />
              </div>
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:4,maxHeight:190}} className="no-scrollbar">
                {searching&&<p style={{fontSize:11,color:C.dim,textAlign:"center",padding:"10px 0"}}>Searching…</p>}
                {!searching&&friendSearch&&searchResults.length===0&&<p style={{fontSize:11,color:C.dim,textAlign:"center",padding:"10px 0"}}>No users found</p>}
                {!searching&&!friendSearch&&<p style={{fontSize:11,color:C.dimmer,textAlign:"center",padding:"10px 0"}}>Type a username to search</p>}
                {searchResults.map((u,i)=>(
                  <motion.div key={u._id}
                    initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                    transition={{delay:i*0.04}}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px",borderRadius:9,transition:"background 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{position:"relative"}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:u.avatar?.color||C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white"}}>{u.username[0].toUpperCase()}</div>
                        <div style={{position:"absolute",bottom:0,right:0,width:7,height:7,borderRadius:"50%",background:u.isOnline?C.green:"#4b5563",border:`1.5px solid ${C.card}`}}/>
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:C.text}}>{u.username}</div>
                        <div style={{fontSize:10,color:C.dim}}>{u.isOnline?"Online":"Offline"}</div>
                      </div>
                    </div>
                    <motion.button whileTap={{scale:0.85}} onClick={()=>sendInvite(u)}
                      style={{
                        padding:"4px 11px",borderRadius:7,
                        background:sentInvites.has(u._id)?"rgba(16,185,129,0.12)":"rgba(124,58,237,0.12)",
                        border:`1px solid ${sentInvites.has(u._id)?"rgba(16,185,129,0.3)":"rgba(124,58,237,0.28)"}`,
                        color:sentInvites.has(u._id)?C.green:C.purpleL,
                        fontSize:10,fontWeight:700,cursor:"pointer",
                        display:"flex",alignItems:"center",gap:4,
                        whiteSpace:"nowrap",transition:"all 0.2s",
                      }}>
                      {sentInvites.has(u._id)?<><Check size={10}/> Sent</>:<><Send size={10}/> Invite</>}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ══ PROFILE MODAL ══ */}
      <AnimatePresence>
        {showProfile&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setShowProfile(false)}
            style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <motion.div
              initial={{scale:0.88,y:24}} animate={{scale:1,y:0}} exit={{scale:0.88,y:24}}
              transition={{type:"spring",stiffness:300,damping:28}}
              onClick={e=>e.stopPropagation()}
              style={{
                width:"100%",maxWidth:440,borderRadius:22,
                background:C.card,border:`1px solid ${C.borderHi}`,
                boxShadow:`0 0 80px rgba(124,58,237,0.22)`,
                overflow:"hidden",maxHeight:"90vh",overflowY:"auto",
              }}
              className="no-scrollbar"
            >
              <motion.div style={{height:"2px",background:"linear-gradient(90deg,transparent,#7c3aed,#22d3ee,transparent)",backgroundSize:"200% 100%"}}
                animate={{backgroundPosition:["0%","200%"]}} transition={{duration:3,repeat:Infinity,ease:"linear"}}/>

              <div style={{padding:"24px 24px 28px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
                  <h2 style={{fontSize:16,fontWeight:900,color:"white",letterSpacing:"-0.02em"}}>Your Profile</h2>
                  <button onClick={()=>setShowProfile(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.dim,display:"flex"}}><X size={16}/></button>
                </div>

                {/* preview */}
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22,padding:"14px",borderRadius:14,background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.14)"}}>
                  <div style={{width:58,height:58,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`2px solid ${C.borderHi}`,boxShadow:`0 0 22px ${C.glow}`}}
                    dangerouslySetInnerHTML={{__html:avatarSvg}}/>
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:"white"}}>{canRename?editUsername||username:username}</div>
                    <div style={{fontSize:11,color:C.dim,marginTop:2}}>{userEmail}</div>
                    <div style={{marginTop:5,display:"flex",alignItems:"center",gap:5,fontSize:9,color:C.green,fontWeight:600}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/> Online
                    </div>
                  </div>
                </div>

                {/* username */}
                <div style={{marginBottom:16}}>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:9,fontWeight:800,letterSpacing:"0.14em",color:C.dim,textTransform:"uppercase",marginBottom:7}}>
                    <Edit3 size={10}/> Username
                    {!canRename&&<span style={{marginLeft:"auto",fontSize:9,color:C.amber,display:"flex",alignItems:"center",gap:4}}><Calendar size={9}/> Rename in {daysLeft}d</span>}
                  </label>
                  <input value={canRename?editUsername:username} onChange={e=>canRename&&setEditUsername(e.target.value)} disabled={!canRename}
                    style={{width:"100%",padding:"10px 14px",borderRadius:9,background:canRename?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.02)",border:`1px solid ${canRename?"rgba(124,58,237,0.4)":"rgba(255,255,255,0.06)"}`,color:canRename?"white":"rgba(255,255,255,0.4)",fontSize:13,outline:"none",cursor:canRename?"text":"not-allowed",boxSizing:"border-box"}}/>
                  {!canRename&&<p style={{fontSize:10,color:C.amber,marginTop:5,display:"flex",alignItems:"center",gap:4}}><AlertCircle size={10}/> Username can only be changed once every 7 days</p>}
                </div>

                {/* avatar grid */}
                <div style={{marginBottom:20}}>
                  <label style={{display:"block",fontSize:9,fontWeight:800,letterSpacing:"0.14em",color:C.dim,textTransform:"uppercase",marginBottom:10}}>Choose Avatar</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,maxHeight:230,overflowY:"auto"}} className="no-scrollbar">
                    {AVATARS_WITH_LABELS.map(av=>(
                      <motion.button key={av.id} whileHover={{scale:1.1,y:-2}} whileTap={{scale:0.92}}
                        onClick={()=>setSelectedAvatar(av.id)}
                        style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:0}}>
                        <div style={{width:46,height:46,borderRadius:"50%",overflow:"hidden",border:`2.5px solid ${selectedAvatar===av.id?C.purpleL:"rgba(255,255,255,0.07)"}`,boxShadow:selectedAvatar===av.id?"0 0 14px rgba(124,58,237,0.6)":"none",transition:"all 0.18s"}}
                          dangerouslySetInnerHTML={{__html:AVATARS.find(a=>a.id===av.id)?.svg||""}}/>
                        <span style={{fontSize:8,fontWeight:600,color:selectedAvatar===av.id?C.purpleL:C.dimmer,transition:"color 0.18s"}}>{av.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* stats */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
                  {[{label:"Rooms",value:"0"},{label:"Sessions",value:"1"},{label:"Hours",value:"0.5h"}].map(s=>(
                    <div key={s.label} style={{padding:"10px",borderRadius:10,textAlign:"center",background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.14)"}}>
                      <div style={{fontSize:15,fontWeight:900,background:"linear-gradient(135deg,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.value}</div>
                      <div style={{fontSize:8,color:C.dimmer,marginTop:2,textTransform:"uppercase",letterSpacing:"0.1em"}}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* save */}
                <AnimatePresence mode="wait">
                  {saveMsg?(
                    <motion.div key="saved" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                      style={{width:"100%",padding:"12px",borderRadius:11,background:"rgba(16,185,129,0.14)",border:"1px solid rgba(16,185,129,0.3)",color:C.green,fontSize:13,fontWeight:700,textAlign:"center"}}>
                      ✓ {saveMsg}
                    </motion.div>
                  ):(
                    <motion.button key="save" whileHover={{scale:1.02,filter:"brightness(1.1)"}} whileTap={{scale:0.97}} onClick={saveProfile}
                      style={{width:"100%",padding:"12px",borderRadius:11,background:"linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)",boxShadow:"0 0 24px rgba(124,58,237,0.32)",border:"none",cursor:"pointer",color:"white",fontSize:13,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                      <Shield size={14}/> Save Profile
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}