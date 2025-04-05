// Toast component
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Toast({ message, variant, onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - 1, 0));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const variants = {
    success: {
      icon: <CheckCircle2 className="h-6 w-6 text-[var(--primary)]" />,
      bg: "bg-[var(--primary)]",
      border: "border-[var(--primary)]",
    },
    error: {
      icon: <AlertCircle className="h-6 w-6 text-[var(--destructive)]" />,
      bg: "bg-[var(--destructive)]",
      border: "border-[var(--destructive)]",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6 text-[var(--chart-4)]" />,
      bg: "bg-[var(--chart-4)]",
      border: "border-[var(--chart-4)]",
    },
    info: {
      icon: <Info className="h-6 w-6 text-[var(--chart-3)]" />,
      bg: "bg-[var(--chart-3)]",
      border: "border-[var(--chart-3)]",
    },
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className={`fixed right-4 bottom-4 rounded-lg p-4 shadow-lg ${variants[variant].bg} border ${variants[variant].border} min-w-[300px]`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {variants[variant].icon}
          <span className="font-medium text-[var(--foreground)]">
            {message}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full transition-all duration-50"
          style={{
            width: `${progress}%`,
            backgroundColor: `var(--${variant === "error" ? "destructive" : variant === "success" ? "primary" : variant === "warning" ? "chart-4" : "chart-3"})`,
            opacity: 0.5,
          }}
        />
      </div>
    </motion.div>
  );
}
