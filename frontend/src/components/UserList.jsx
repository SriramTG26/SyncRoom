'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Crown, Settings } from 'lucide-react';

const USERS = [
  { name: 'Arun', color: '#7C3AED', online: true, hosting: true },
  { name: 'Dev', color: '#22D3EE', online: true, hosting: false },
  { name: 'Jordan B.', color: '#4F46E5', online: true, hosting: false },
  { name: 'Sriram TG', color: '#A78BFA', online: true, hosting: false },
  { name: 'Chris P.', color: '#06B6D4', online: false, hosting: false },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function UserList({ collapsed = false, currentAccent, onInvite, onSettings, currentUser }) {
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: collapsed ? 0 : 260, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col border-r shrink-0 overflow-hidden relative z-40 h-full bg-[#0D1117]"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Sidebar Top: Branding or Identity */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
         <div className={`w-10 h-10 ${currentAccent.bg} rounded-2xl flex items-center justify-center font-black text-white shadow-lg`}>S</div>
         <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-tighter text-white">Vortex</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Streaming</span>
         </div>
      </div>

      {/* Members Header */}
      <div className="px-5 py-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Members</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${currentAccent.border} ${currentAccent.text} bg-white/5`}>
          {USERS.filter((u) => u.online).length} Live
        </span>
      </div>

      {/* User List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 overflow-y-auto py-4 space-y-1 no-scrollbar">
        <AnimatePresence>
          {USERS.map((user) => (
            <motion.div key={user.name} variants={itemVariants} className="flex items-center gap-3 px-4 py-2 group cursor-default hover:bg-white/[0.03] transition-all rounded-xl mx-2">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white" 
                  style={{ 
                    background: user.online ? user.color : '#1F2937',
                    boxShadow: user.online ? `0 0 15px ${user.color}44` : 'none',
                    opacity: user.online ? 1 : 0.4 
                  }}>
                  {user.name[0]}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D1117]" style={{ background: user.online ? '#4ade80' : '#4B5563' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold truncate ${user.online ? 'text-white' : 'text-gray-600'}`}>{user.name}</span>
                  {user.hosting && <Crown size={10} className="text-yellow-500" />}
                </div>
                <span className="text-[10px] font-medium text-gray-500">{user.online ? 'Watching' : 'Offline'}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer Actions */}
      <div className="p-4 space-y-3 border-t border-white/5">
        <button 
          onClick={onInvite}
          className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-dashed border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 bg-white/5"
        >
          <UserPlus size={14} /> Invite Squad
        </button>
        
        <button 
          onClick={onSettings}
          className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-gray-500 hover:text-white hover:bg-white/5"
        >
          <Settings size={14} /> Settings
        </button>
      </div>
    </motion.div>
  );
}