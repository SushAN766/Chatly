import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import InputBar from "./components/InputBar";
import { formatTime, simulateAIResponse } from "./components/utils";

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢"];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showReactions, setShowReactions] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (window.puter && window.puter.ai) {
      setAiReady(true); // AI ready immediately
    }
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isLoading]);

  const addMessage = (content, isUser) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), content, isUser, time: new Date(), reactions: [] },
    ]);
  };

  const addReaction = (messageId, emoji) => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, reactions: [...m.reactions, emoji] } : m))
    );
    setShowReactions(null);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue.trim();
    addMessage(message, true);
    setInputValue("");
    setIsLoading(true);

    let reply = "";
    try {
      if (aiReady && window.puter?.ai?.chat) {
        const response = await window.puter.ai.chat(message);
        reply = typeof response === "string" ? response : response.message?.content || "I'm not sure how to respond.";
      } else {
        reply = await simulateAIResponse(message);
      }
      addMessage(reply, false);
    } catch (e) {
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

  return (
    <div className={`${isDark ? 'bg-[#1B1B1B] text-gray-200' : 'bg-gradient-to-br from-yellow-50 to-white text-gray-800'} min-h-screen flex flex-col`}>
      <Header isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
      <MessageList
        messages={messages}
        isDark={isDark}
        showReactions={showReactions}
        setShowReactions={setShowReactions}
        addReaction={addReaction}
        reactionEmojis={reactionEmojis}
        formatTime={formatTime}
        isLoading={isLoading}
      />
      <InputBar
        inputValue={inputValue}
        setInputValue={setInputValue}
        sendMessage={sendMessage}
        isDark={isDark}
        aiReady={aiReady}
        isLoading={isLoading}
        handleKeyPress={handleKeyPress}
      />
      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default App;
