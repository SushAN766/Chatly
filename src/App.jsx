import { useState, useEffect, useRef } from "react";

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢"];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showReactions, setShowReactions] = useState(null);
  const [sparkles, setSparkles] = useState([]);
  const messagesEndRef = useRef(null);

  // AI ready check
  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === "function") {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  // Scroll to bottom on new messages
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // Add message
  const addMessage = (content, isUser) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), content, isUser, time: new Date(), reactions: [] }]);
  };

  // Add reaction
  const addReaction = (messageId, emoji) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, reactions: [...m.reactions, emoji] } : m)
    );
    setShowReactions(null);
  };

  // Send message
  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;
    if (!aiReady) {
      addMessage("Chatly AI is not ready yet.", false);
      return;
    }
    addMessage(message, true);
    setInputValue("");
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000)); // simulate AI delay
      const response = await window.puter.ai.chat(message);
      const reply = typeof response === "string" ? response : response.message?.content || "I'm not sure how to respond.";
      addMessage(reply, false);
    } catch (error) {
      addMessage("An error occurred while chatting.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Generate floating sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 8 + 4,
      };
      setSparkles(prev => [...prev.slice(-30), newSparkle]); // keep max 30 sparkles
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isDark ? 'bg-[#1B1B1B] text-gray-200' : 'bg-gradient-to-br from-yellow-50 to-white text-gray-800'} min-h-screen flex flex-col relative overflow-hidden`}>

      {/* Floating Sparkles */}
      {sparkles.map(s => (
        <span
          key={s.id}
          className="absolute bg-yellow-400 rounded-full opacity-70 animate-fade"
          style={{
            width: s.size,
            height: s.size,
            top: `${s.y}%`,
            left: `${s.x}%`,
            animationDuration: `${s.duration}s`,
          }}
        ></span>
      ))}

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700 z-10 relative">
        <h1 className={`${isDark ? 'text-[#FFD700]' : 'text-yellow-600'} text-3xl font-serif`}>Chatly</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1 border rounded-lg text-sm hover:ring-2 hover:ring-yellow-400 transition"
        >
          {isDark ? "☀️ Day" : "🌙 Night"}
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-yellow-400/50 scrollbar-track-transparent relative z-10">
        
        {/* Luxury Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 mt-20">
            <div className="text-6xl animate-pulse text-[#FFD700]">💎</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent animate-pulse">
              Welcome to Chatly
            </div>
            <p className="text-gray-400 text-sm">
              Engage in premium, intelligent conversations with our AI.
            </p>
            <div className="mt-4 px-6 py-2 bg-[#111]/70 text-[#FFD700] rounded-full animate-bounce shadow-lg">
              Type a message below to begin
            </div>
          </div>
        )}

        {/* Messages Mapping */}
        {messages.map(mesg => (
          <div
            key={mesg.id}
            className={`relative flex items-end ${mesg.isUser ? 'justify-end' : 'justify-start'} space-x-2 transform hover:-translate-y-1 transition-shadow`}
            onMouseEnter={() => setShowReactions(mesg.id)}
            onMouseLeave={() => setShowReactions(null)}
          >
            {!mesg.isUser && (
              <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">AI</div>
            )}
            <div className={`max-w-md px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm transition-transform ${mesg.isUser ? (isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white/80 text-gray-800 border-gray-300') : (isDark ? 'bg-[#111]/80 text-[#FFD700] border-[#FFD700]/40' : 'bg-yellow-100 text-yellow-600 border-yellow-200')}`}>
              <div className="flex justify-between text-xs opacity-70 mb-1">
                <span>{mesg.isUser ? "You" : "Chatly AI"}</span>
                <span>{formatTime(mesg.time)}</span>
              </div>
              <div className="whitespace-pre-wrap">{mesg.content}</div>
              {mesg.reactions.length > 0 && <div className="flex space-x-1 mt-1">{mesg.reactions.map((r, idx) => <span key={idx}>{r}</span>)}</div>}
            </div>
            {mesg.isUser && (
              <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">Y</div>
            )}
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
        ))}

        {/* AI Typing Indicator with Sparkle */}
        {isLoading && (
          <div className="flex items-end space-x-2 relative animate-pulse">
            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">AI</div>
            <div className="max-w-md px-6 py-4 rounded-3xl bg-[#111]/80 text-[#FFD700] border border-[#FFD700]/40 shadow-lg backdrop-blur-sm flex items-center gap-2 relative overflow-hidden">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-sm font-medium">Chatly AI is typing...</span>

              {/* Tiny sparkles inside typing bubble */}
              {[...Array(10)].map((_, i) => (
                <span
                  key={i}
                  className="absolute bg-yellow-400 rounded-full opacity-70 animate-fade"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Section */}
      <div className="flex p-6 border-t gap-3 border-gray-800 z-10 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={aiReady ? "Type a message..." : "Waiting for AI..."}
          disabled={!aiReady || isLoading}
          className={`flex-1 px-6 py-3 rounded-3xl border backdrop-blur-sm focus:outline-none focus:ring-2 transition ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-yellow-400' : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-600 focus:ring-yellow-400'}`}
        />
        <button
          onClick={sendMessage}
          disabled={!aiReady || isLoading || !inputValue.trim()}
          className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-3xl hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      {/* Sparkle animation CSS */}
      <style>{`
        @keyframes fade {
          0% { opacity: 0; transform: translateY(0px); }
          50% { opacity: 0.8; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade {
          animation-name: fade;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
