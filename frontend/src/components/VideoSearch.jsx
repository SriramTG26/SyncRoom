import React, { useState, useEffect } from 'react';
import { HiSearch, HiLightningBolt } from 'react-icons/hi';

export default function VideoSearch({ onSearch }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Mock suggestions - in the future, these would come from an API
  const suggestions = [
    "Lofi hip hop radio - beats to relax/study",
    "Modern Web Design Trends 2026",
    "Synthwave Mix for Coding",
    "Productivity Music 1 Hour"
  ].filter(s => s.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-10">
      <div className="group relative flex items-center">
        {/* Glow Effect behind search */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
        
        <div className="relative flex w-full bg-[#161B22] border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="pl-4 flex items-center text-gray-400">
            <HiSearch size={20} />
          </div>
          <input
            type="text"
            value={input}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste YouTube Link or Search for vibes..."
            className="w-full bg-transparent border-none py-4 px-4 text-sm focus:ring-0 text-white placeholder-gray-500"
          />
          <button 
            onClick={() => onSearch(input)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 m-1.5 rounded-lg text-xs font-black uppercase tracking-tighter flex items-center gap-2 transition-all active:scale-95"
          >
            <HiLightningBolt />
            Sync Now
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#161B22] border border-gray-700 rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {suggestions.map((text, i) => (
            <div 
              key={i}
              onClick={() => { setInput(text); onSearch(text); }}
              className="px-4 py-3 hover:bg-blue-600/10 hover:text-blue-400 cursor-pointer text-sm border-b border-gray-800 last:border-none flex items-center gap-3"
            >
              <HiSearch className="text-gray-600" size={14} />
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}