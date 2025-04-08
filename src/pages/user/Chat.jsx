import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { aiModels } from "../../data/AIModel/aiModels";
import {
  ChatMessages,
  MessageBubble,
} from "../../components/ai-chat/ChatMessages";
import { ChatInput } from "../../components/ai-chat/ChatInput";
import { PersonaSelector } from "../../components/ai-chat/PersonaSelector";

import { useAuth0 } from "@auth0/auth0-react";
import Modal from "../../components/modal/Modal";
import RecordingModal from "../../components/modal/voice-recorder/RecordingModal";

function TypingIndicator() {
  return (
    <div className="flex justify-start space-x-2 px-4 py-2">
      <div className="h-3 w-3 animate-bounce rounded-full bg-[var(--color-secondary)]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-[var(--color-secondary)] delay-100"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-[var(--color-secondary)] delay-200"></div>
    </div>
  );
}

function UserModal({ user, onClose, onLogout }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(19,23,39,0.6)] backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-neutral)] hover:text-[var(--color-neutral-hover)]"
        >
          ✕
        </button>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.picture}
            alt="User"
            className="h-20 w-20 rounded-full border-4 border-[var(--color-secondary)] object-cover"
          />
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            {user.name}
          </h2>
          <p className="text-[var(--muted-foreground)]">{user.email}</p>
          <button
            onClick={onLogout}
            className="w-full rounded-lg bg-[var(--color-error)] px-6 py-3 font-medium text-white transition-all hover:bg-[var(--color-error-hover)]"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, logout } = useAuth0();
  const [selectedPersona, setSelectedPersona] = useState("sofia");
  const [messages, setMessages] = useState({ sofia: [] });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedPersona]]);

  const persona = aiModels.find((p) => p.id === selectedPersona);

  const handlePersonaChange = (newPersonaId) => {
    setSelectedPersona(newPersonaId);
    if (!messages[newPersonaId]) {
      setMessages((prev) => ({ ...prev, [newPersonaId]: [] }));
    }
  };

  const handleNewChat = () => {
    setMessages((prev) => ({ ...prev, [selectedPersona]: [] }));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      setShowEmptyWarning(true);
      inputRef.current?.classList.add("animate-shake");
      setTimeout(() => {
        inputRef.current?.classList.remove("animate-shake");
        setShowEmptyWarning(false);
      }, 1000);
      return;
    }

    setMessages((prev) => ({
      ...prev,
      [selectedPersona]: [
        ...(prev[selectedPersona] || []),
        { text: inputMessage, isUser: true },
      ],
    }));
    setInputMessage("");
    setIsLoading(true);

    try {
      const history = messages[selectedPersona] || [];
      const contents = [
        persona.systemInstruction,
        ...persona.fewShotExamples,
        ...history.map((msg) => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        { role: "user", parts: [{ text: inputMessage }] },
      ];

      const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_KEY
        }`,
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

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, can you rephrase?";
      setMessages((prev) => ({
        ...prev,
        [selectedPersona]: [
          ...(prev[selectedPersona] || []),
          { text: aiText, isUser: false },
        ],
      }));
    } catch (err) {
      console.error(err);
      setMessages((prev) => ({
        ...prev,
        [selectedPersona]: [
          ...(prev[selectedPersona] || []),
          { text: "Connection issue, please try again.", isUser: false },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const [isRecorderOpen, setIsRecorderOpen] = useState(false);

  const handleVoiceInput = () => {
    setIsRecorderOpen(true);
  };

  const currentMessages = messages[selectedPersona] || [];

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] md:flex-row">
      {showUserModal && (
        <UserModal
          user={user}
          onClose={() => setShowUserModal(false)}
          onLogout={() => logout({ returnTo: window.location.origin })}
        />
      )}

      {/* Mobile Persona Selector */}
      <div className="border-b border-[var(--border)] bg-[var(--card)] md:hidden">
        <PersonaSelector
          selectedId={selectedPersona}
          onSelect={handlePersonaChange}
          mobile
        />
      </div>

      {/* Desktop Persona Selector */}
      <div className="hidden w-full border-r border-[var(--border)] bg-[var(--card)] md:block md:w-64 lg:w-80">
        <PersonaSelector
          selectedId={selectedPersona}
          onSelect={handlePersonaChange}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] p-4 shadow-sm md:p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-[var(--card)] bg-[var(--color-success)]"></div>
              <img
                src={persona.avatar}
                alt={persona.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold text-[var(--foreground)] md:text-xl">
                  Conversation with {persona.name}
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {persona.description}
                </p>
              </div>
              {currentMessages.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="rounded-lg bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--primary-100)]"
                >
                  New Chat
                </button>
              )}
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
                className="h-10 w-10 rounded-full border-2 border-[var(--color-secondary)] object-cover transition-all hover:border-[var(--color-secondary-hover)]"
              />
              <span className="hidden text-sm font-medium text-[var(--foreground)] lg:block">
                {user.name}
              </span>
            </button>
          </div>
        </header>

        <ChatMessages>
          {currentMessages.length === 0 ? (
            <div className="p-4">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  How can I help you today?
                </h2>
                <p className="mt-2 text-[var(--muted-foreground)]">
                  Try one of these conversation starters:
                </p>
              </div>
              <div className="grid gap-3">
                {persona.fewShotExamples
                  .filter((ex) => ex.role === "user")
                  .map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(example.parts[0].text)}
                      className="w-full rounded-lg bg-[var(--card)] p-4 text-left shadow-sm transition-all hover:bg-[var(--background)] hover:shadow-md"
                    >
                      <span className="text-[var(--foreground)]">
                        {example.parts[0].text}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            currentMessages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m.text}
                isUser={m.isUser}
                className={
                  m.isUser
                    ? "ml-auto bg-[var(--color-secondary)] text-white"
                    : "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                }
              />
            ))
          )}

          {showEmptyWarning && (
            <div className="px-4 py-2 text-center text-sm text-[var(--color-error)]">
              Please enter a message before sending
            </div>
          )}

          {isLoading && (
            <div className="px-4 py-2">
              <div className="max-w-[70%] rounded-xl bg-[var(--card)] p-4 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </ChatMessages>

        <div className="border-t border-[var(--border)] bg-[var(--card)] p-4 shadow-lg md:p-6">
          <ChatInput
            ref={inputRef}
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
            className="rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--ring)] focus:outline-none"
            sendButtonClass="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--secondary-hover)] active:bg-[var(--primary)] rounded-full px-6 py-3 transition-all duration-200"
            onVoiceStart={handleVoiceInput}
            isListening={isListening}
          />
        </div>
      </div>

      <Modal isOpen={isRecorderOpen} onClose={() => setIsRecorderOpen(false)}>
        <RecordingModal />
      </Modal>
    </div>
  );
}
