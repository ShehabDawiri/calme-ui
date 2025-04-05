import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[--color-primary-500] px-6 text-[--color-primary-100]">
      {/* Animated Bubbles in background */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full">
        <div className="absolute top-20 left-10 h-40 w-40 animate-ping rounded-full bg-[--color-primary-300] opacity-10" />
        <div className="absolute right-10 bottom-20 h-32 w-32 animate-pulse rounded-full bg-[--color-primary-400] opacity-20" />
        <div className="absolute bottom-32 left-1/3 h-24 w-24 animate-bounce rounded-full bg-[--color-primary-200] opacity-10" />
      </div>

      {/* Content */}
      <motion.div
        className="z-10 max-w-2xl space-y-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-7xl font-extrabold text-[--color-primary-200] drop-shadow-md">
          404
        </h1>
        <p className="text-2xl font-medium text-[--color-primary-100]">
          Oops! Page not found.
        </p>
        <p className="mx-auto max-w-lg text-[--color-primary-300]">
          The page you're looking for doesn't exist or might have been moved.
          Let’s get you back on track.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-[--radius] bg-[--color-primary-300] px-6 py-3 font-semibold text-[--color-primary-500] shadow-xl transition duration-300 hover:bg-[--color-primary-400]"
        >
          Go to Homepage
        </button>
      </motion.div>

      {/* Extra glow effect */}
      <div className="absolute right-10 bottom-10 h-20 w-20 animate-pulse rounded-full bg-[--color-primary-300] opacity-10 blur-3xl" />
    </div>
  );
}
