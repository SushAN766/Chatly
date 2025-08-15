import {useState,useEffect,useRef} from "react";
import models from "models.json";
function App() {
  const [messages ,setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const messagesEndRef = useRef(null);


  useEffect(() =>{
    const checkReady =setInterval(() => {
      if(window.puter?.ai?.chat){
        setAiReady(true);
        clearInterval(checkReady);
      }
      },300)
      return () => clearInterval(checkReady);
  },[]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView ({
       behavior: "smooth" });
    
  },[messages]);

  const addMessage=(content,isuser)=> {
    setMessages((prev) => [
      ...prev,
      { content, isUser, id: Date.now() },
    ]);
  };


  const sendMessage = async () => {
    const message = inputValue.trim();

    if (!message || !aiReady) return;

    addMessage(message, true);
    setIsLoading(true);
    setInputValue("");


    try{
      const conversation =[
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        ...messages.map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: message },

      ]
      const response = await window.puter.ai.chat({
        model: selectedModel,
        messages: conversation,
      });

      const reply = typeof response === "string"
      ? response
      : response.message?.content || "No reply received.";

      
      addMessage(reply, false);

      const handleKeyPress=(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      }

      const handleModelChange = (e) => {
        const newModel=e.target.value;
        setSelectedModel(newModel);
        const model=models.find((m) => m.id === newModel);
        addMessage(`Switched to model: ${model.name} (${model.provider})`, false);

      }; 

      const currentModel = models.find((m) => m.id === selectedModel) || models[0]  ;




    }catch (error) {
      
    }finally {
      setIsLoading(false);
      }
    }

    


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950/100 via-neutral-950 to-amber-950 flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-7xl text-white">
        Model Mix AI - MultiChat
      </h1>
    </div>
  );
}

export default App;
