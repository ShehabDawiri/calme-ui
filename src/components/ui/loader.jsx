import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Enhanced Loader component
export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[var(--color-primary-100)]"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      >
        <Loader2 className="h-16 w-16 animate-pulse text-[var(--color-primary-500)]" />
      </motion.div>

      <motion.p
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="text-2xl font-bold tracking-wide text-[var(--color-primary-400)]"
      >
        Logging In
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="ml-1"
        >
          ...
        </motion.span>
      </motion.p>

      <div className="mt-8 h-2 w-64 overflow-hidden rounded-full bg-[var(--color-primary-200)]">
        <motion.div
          className="h-full bg-[var(--color-primary-400)]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
