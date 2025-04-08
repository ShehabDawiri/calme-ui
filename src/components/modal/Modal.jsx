import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal forceMount>
            {/* Overlay with animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </motion.div>

            {/* Modal content */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Dialog.Content
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="relative max-h-[90vh] w-full max-w-2xl rounded-xl bg-white shadow-xl focus:outline-none"
              >
                {/* Scrollable content */}
                <div className="overflow-y-auto p-6">
                  {children}

                  {/* Close button */}
                  <Dialog.Close
                    className="absolute top-4 right-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label="Close"
                  >
                    <Cross2Icon className="h-5 w-5" />
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </motion.div>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
