import React from 'react';

const EMOJIS = ['🔥', '😂', '😮', '👏', '❤️', '💀'];

export default function EmojiBar({ onReaction }) {
  return (
    <div className="flex gap-4 justify-center py-4 bg-gray-800/30 backdrop-blur-md rounded-2xl border border-white/5 mt-4">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReaction(emoji)}
          className="text-2xl hover:scale-125 transition-transform active:scale-90"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}