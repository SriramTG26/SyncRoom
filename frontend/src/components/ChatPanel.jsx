import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile } from 'lucide-react';

const EMOJIS = ['🔥', '😂', '😮', '👏', '❤️', '💀', '💯', '✨'];

export default function ChatPanel({ currentAccent, onSeek, roomCode, unreadCount }) {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Arun', text: 'Yo, check the drop at 0:45! 🔥', time: '10:04 AM', avatar: 'A' },
  ]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      user: 'Sriram TG', 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      avatar: 'S' 
    }]);
    setInput('');
    setShowEmoji(false);
  };

  return (
    <aside className="flex flex-col h-full bg-[#0D1117] border-l border-gray-800/50">
      
      {/* CONSOLIDATED HEADER - Single instance of the title & code */}
      <div className="p-6 border-b border-gray-800/50 bg-[#0D1117]">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-white tracking-widest"># SYNC-CHAT</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[8px] font-bold text-emerald-500 uppercase">Live</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${currentAccent.text} uppercase tracking-tighter opacity-80`}>
                  Room Code: {roomCode}
                </span>
             </div>

             {unreadCount > 0 && (
               <span className={`${currentAccent.bg} text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-blue-900/20`}>
                  {unreadCount} NEW
               </span>
             )}
           </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="group flex gap-3">
            <div className={`shrink-0 w-8 h-8 rounded-lg ${currentAccent.bg} flex items-center justify-center text-[10px] font-black text-white shadow-lg`}>
              {msg.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-gray-200">{msg.user}</span>
                <span className="text-[9px] text-gray-600 font-medium">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-400 bg-[#161B22] border border-gray-800 px-3 py-2 rounded-r-2xl rounded-bl-2xl">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="p-4 bg-[#0D1117] border-t border-gray-800">
        <div className="relative flex items-center bg-[#161B22] border border-gray-800 rounded-2xl px-3 py-2.5">
          <button onClick={() => setShowEmoji(!showEmoji)} className="p-1 text-gray-500 hover:text-gray-300">
            <Smile size={19} />
          </button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message the room..." 
            className="flex-1 bg-transparent text-sm text-white focus:outline-none px-3" 
          />
          <button onClick={handleSendMessage} className={input ? currentAccent.text : 'text-gray-700'}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}