import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { aiModels } from "../../data/AIModel/aiModels";
import {
  ChatMessages,
  MessageBubble,
} from "../../components/ai-chat/ChatMessages";
import { ChatInput } from "../../components/ai-chat/ChatInput";
import { PersonaSelector } from "../../components/ai-chat/PersonaSelector";
import { useAuth0 } from "@auth0/auth0-react";

const TypingIndicator = () => (
  <div className="flex justify-start space-x-2 px-4 py-2">
    <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500"></div>
    <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500 delay-100"></div>
    <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500 delay-200"></div>
  </div>
);

const UserModal = ({ user, onClose, onLogout }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <div className="flex flex-col items-center space-y-4">
        <img
          src={user.picture}
          alt="User"
          className="h-20 w-20 rounded-full border-4 border-blue-100 object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <button
          onClick={onLogout}
          className="w-full rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all hover:bg-red-600 active:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
);

const Chat = () => {
  const { user, logout } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const bottomRef = useRef(null);
  const [selectedPersona, setSelectedPersona] = useState("sofia");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const persona = aiModels.find((p) => p.id === selectedPersona);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const contents = [
        persona.systemInstruction,
        ...persona.fewShotExamples,
        ...messages.map((msg) => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        { role: "user", parts: [{ text: inputMessage }] },
      ];

      const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
        {
          contents,
          generationConfig: {
            temperature: 0.9,
            topK: 50,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        },
        { headers: { "Content-Type": "application/json" } },
      );

      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setMessages((prev) => [
        ...prev,
        { text: aiText || "Sorry, can you rephrase?", isUser: false },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "Connection issue, please try again.", isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("messages", user);
  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-blue-50 to-purple-50 md:flex-row">
      {showUserModal && (
        <UserModal
          user={user}
          onClose={() => setShowUserModal(false)}
          onLogout={() => logout({ returnTo: window.location.origin })}
        />
      )}

      {/* Persona Selector - Mobile Top Bar */}
      <div className="border-b border-gray-200 bg-white md:hidden">
        <PersonaSelector
          selectedId={selectedPersona}
          onSelect={setSelectedPersona}
          mobile
        />
      </div>

      {/* Persona Selector - Desktop Sidebar */}
      <div className="hidden w-full border-r border-gray-200 bg-white md:block md:w-64 lg:w-80">
        <PersonaSelector
          selectedId={selectedPersona}
          onSelect={setSelectedPersona}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
              <img
                src={persona.avatar}
                alt={persona.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 md:text-xl">
                {persona.name}
              </h1>
              <p className="text-sm text-gray-500">{persona.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUserModal(true)}
              className="group relative flex items-center space-x-2"
            >
              <img
                src={user.picture}
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-blue-200 object-cover transition-all hover:border-blue-400"
              />
              <span className="hidden text-sm font-medium text-gray-700 lg:block">
                {user.name}
              </span>
            </button>
          </div>
        </header>

        <ChatMessages>
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              message={m.text}
              isUser={m.isUser}
              className={
                m.isUser
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-white text-gray-800 shadow-sm"
              }
            />
          ))}
          {isLoading && (
            <div className="px-4 py-2">
              <div className="max-w-[70%] rounded-xl bg-white p-4 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </ChatMessages>

        <div className="border-t border-gray-200 bg-white p-4 shadow-lg md:p-6">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
            className="rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-500"
            sendButtonClass="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full px-6 py-3 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
