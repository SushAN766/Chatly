import React from "react";

export default function Header({ isDark, toggleTheme }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700 z-20 relative">
      <h1 className={`${isDark ? 'text-[#FFD700]' : 'text-yellow-600'} text-3xl font-serif`}>
        Chatly
      </h1>
      <button
        onClick={toggleTheme}
        className="px-3 py-1 border rounded-lg text-sm hover:ring-2 hover:ring-yellow-400 transition"
      >
        {isDark ? "☀️ Day" : "🌙 Night"}
      </button>
    </header>
  );
}
