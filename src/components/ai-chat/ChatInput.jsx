import { Button } from "../ui/button";

export const ChatInput = ({ value, onChange, onSend, isLoading }) => {
  return (
    <div className="border-primary-200 border-t p-6">
      <div className="flex gap-4">
        <input
          className="border-primary-200 bg-primary-100 text-primary-500 placeholder-primary-300 focus:ring-primary-400 flex-1 rounded-lg border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
        />
        <Button
          variant="default"
          size="lg"
          className="bg-primary-500 text-primary-100 hover:bg-primary-400 focus:ring-primary-400 rounded-lg px-6 py-3 text-sm font-medium focus:ring-2 focus:outline-none disabled:opacity-50"
          onClick={onSend}
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};
