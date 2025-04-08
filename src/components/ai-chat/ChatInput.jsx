import * as React from "react";
import { Button } from "../ui/button";
import * as Tooltip from "@radix-ui/react-tooltip";

export const ChatInput = ({
  value,
  onChange,
  onSend,
  isLoading,
  className,
  sendButtonClass,
  onVoiceStart,
  isListening,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`bg-[var(--background)] p-4 md:p-6 ${className}`}>
      <div className="flex gap-4">
        <input
          className="flex-1 rounded-lg border border-[var(--primary-200)] bg-[var(--primary-100)] px-4 py-3 text-sm text-[var(--primary-500)] placeholder-[var(--primary-300)] focus:ring-2 focus:ring-[var(--primary-400)] focus:outline-none"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="default"
          size="lg"
          className={`rounded-lg bg-[var(--primary-500)] px-6 py-3 text-sm font-medium text-[var(--primary-100)] hover:bg-[var(--primary-400)] focus:ring-2 focus:ring-[var(--primary-400)] focus:outline-none disabled:opacity-50 ${sendButtonClass}`}
          onClick={onSend}
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>

        {/* Voice Button with Tooltip */}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full bg-[var(--primary-200)] p-2 text-[var(--primary-500)] hover:bg-[var(--primary-300)] focus:ring-[var(--primary-400)]"
                onClick={onVoiceStart}
                disabled={isLoading}
              >
                {isListening ? <span>Stop</span> : <span>🎤</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              align="center"
              className="rounded bg-[var(--gray-800)] px-2 py-1 text-xs text-white"
            >
              {isListening ? "Stop Voice Input" : "Start Voice Input"}
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
};
