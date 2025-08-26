import { useState, useEffect, useRef } from "react";
import models from "./models.json";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter?.ai?.chat) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const addMessage = (content, isUser) => {
    setMessages((prev) => [
      ...prev,
      { content, isUser, id: Date.now(), timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    const model = models.find((m) => m.id === newModel);
    addMessage(`Switched to model: ${model.name} (${model.provider})`, false);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || !aiReady || isLoading) return;

    addMessage(message, true);
    setIsLoading(true);
    setInputValue("");

    try {
      const conversation = [
        {
          role: "system",
          content: "You are a helpful AI assistant. Be concise but informative in your responses.",
        },
        ...messages.map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      const response = await window.puter.ai.chat({
        model: selectedModel,
        messages: conversation,
      });

      const reply = typeof response === "string"
        ? response
        : response.message?.content || "No reply received.";

      addMessage(reply, false);
    } catch (error) {
      console.error("Error:", error);
      addMessage("Sorry, there was an error processing your message. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Model Mix AI
            </h1>
            <p className="text-gray-300 text-sm">Multi-Model Chat Interface</p>
          </div>
          
          {/* Model Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm font-medium">Model:</label>
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id} className="bg-gray-900 text-white">
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={clearChat}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm border border-red-500/30 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          {!aiReady && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Initializing AI models...</p>
            </div>
          )}
          
          {messages.length === 0 && aiReady && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Model Mix AI</h2>
              <p className="text-gray-400 mb-4">Choose your preferred AI model and start chatting!</p>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 max-w-md mx-auto">
                <p className="text-sm text-gray-300">
                  <span className="text-purple-400 font-medium">Current Model:</span> {currentModel.name} ({currentModel.provider})
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white/10 backdrop-blur-sm text-gray-100 border border-white/20"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
                <div className={`text-xs mt-2 ${message.isUser ? "text-blue-100" : "text-gray-400"}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-end gap-3">
            <div className="flex-1 min-h-[44px]">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={aiReady ? "Type your message..." : "Waiting for AI to initialize..."}
                disabled={!aiReady || isLoading}
                className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none max-h-32 min-h-[44px] leading-6"
                rows="1"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!aiReady || isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {aiReady && (
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Connected to {currentModel.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;