import React from "react";

export default function InputBar({ inputValue, setInputValue, sendMessage, isDark, aiReady, isLoading, handleKeyPress }) {
  return (
    <div className="flex p-6 border-t gap-3 border-gray-800 relative z-10">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={aiReady ? "Type a message..." : "Waiting for AI..."}
        disabled={!aiReady || isLoading}
        className={`flex-1 px-6 py-3 rounded-3xl border backdrop-blur-sm focus:outline-none focus:ring-2 transition ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-yellow-400"
            : "bg-white/80 border-gray-300 text-gray-800 placeholder-gray-600 focus:ring-yellow-400"
        }`}
      />
      <button
        onClick={sendMessage}
        disabled={!aiReady || isLoading || !inputValue.trim()}
        className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-3xl hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
