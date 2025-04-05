import * as ScrollArea from "@radix-ui/react-scroll-area";
import { motion } from "framer-motion";

export const MessageBubble = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
  >
    <div
      className={`max-w-[70%] rounded-[var(--radius)] px-5 py-4 text-sm shadow-lg transition-colors duration-200 ${
        isUser
          ? "bg-[var(--color-secondary)] text-[var(--color-primary-100)]"
          : "bg-[var(--background)] text-[var(--foreground)]"
      } `}
    >
      <p className="leading-relaxed">{message}</p>
    </div>
  </motion.div>
);

export const ChatMessages = ({ children }) => (
  <ScrollArea.Root className="h-full w-full overflow-hidden">
    <ScrollArea.Viewport className="h-full w-full bg-[var(--card)] px-6 py-8">
      <div className="flex flex-col gap-3">{children}</div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      orientation="vertical"
      className="z-10 flex touch-none p-1 transition-colors duration-200 ease-out select-none hover:bg-[var(--color-primary-300)] data-[orientation=vertical]:w-3"
    >
      <ScrollArea.Thumb className="relative flex-1 rounded-full bg-[var(--color-secondary)] before:absolute before:top-1/2 before:left-1/2 before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
);
