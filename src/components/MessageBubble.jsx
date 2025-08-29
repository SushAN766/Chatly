import { useState } from "react";

export default function MessageBubble({ mesg, isDark, showReactions, setShowReactions, addReaction, reactionEmojis, formatTime }) {
  return (
    <div
      className={`relative flex items-end ${mesg.isUser ? 'justify-end' : 'justify-start'} space-x-2 transform hover:-translate-y-1 transition-shadow`}
      onMouseEnter={() => setShowReactions(mesg.id)}
      onMouseLeave={() => setShowReactions(null)}
    >
      {!mesg.isUser && <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">AI</div>}
      <div className={`max-w-md px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm transition-transform ${mesg.isUser ? (isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white/80 text-gray-800 border-gray-300') : (isDark ? 'bg-[#111]/80 text-[#FFD700] border-[#FFD700]/40' : 'bg-yellow-100 text-yellow-600 border-yellow-200')}`}>
        <div className="flex justify-between text-xs opacity-70 mb-1">
          <span>{mesg.isUser ? "You" : "Chatly AI"}</span>
          <span>{formatTime(mesg.time)}</span>
        </div>
        <div className="whitespace-pre-wrap">{mesg.content}</div>
        {mesg.reactions.length > 0 && <div className="flex space-x-1 mt-1">{mesg.reactions.map((r, idx) => <span key={idx}>{r}</span>)}</div>}
      </div>
      {mesg.isUser && <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">Y</div>}

      {showReactions === mesg.id && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex bg-gray-700/90 p-2 rounded-full space-x-2 shadow-lg">
          {reactionEmojis.map((emoji) => (
            <span
              key={emoji}
              className="cursor-pointer hover:scale-125 transition"
              onClick={() => addReaction(mesg.id, emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
