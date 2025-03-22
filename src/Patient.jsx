import { useState } from "react";

export default function TherapyChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    const timestamp = new Date().toLocaleTimeString();
    addMessage({ sender: "patient", text: input, timestamp });
    setInput("");
    
    // Simulated AI response
    setTimeout(() => {
      addMessage({ sender: "ai", text: "I'm here to help. Can you tell me more?", timestamp: new Date().toLocaleTimeString() });
    }, 1000);
  };

  const handleExport = () => {
    const chatHistory = messages.map(msg => `${msg.timestamp} - ${msg.sender}: ${msg.text}`).join("\n");
    const blob = new Blob([chatHistory], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat_history.txt";
    link.click();
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-4 bg-gradient-to-r from-blue-300 to-purple-400 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 text-white">
        <h2 className="text-2xl font-bold">AI Therapy Chat</h2>
        <button onClick={handleExport} className="bg-green-500 text-black shadow-md hover:bg-green-600 p-2 rounded-lg">
          Export
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs shadow-md ${
              msg.sender === "patient" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
            }`}
          >
            <p>{msg.text}</p>
            <span className="text-xs text-gray-600 block mt-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 flex-1"
        />
        <button onClick={handleSend} className="bg-blue-600 text-black shadow-md hover:bg-blue-700 p-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
