import { useState } from "react";
import { Toast } from "@/components/ui/toast";
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, variant = "info") => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastContainer = () => {
    if (!toast) return null;

    return (
      <Toast
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, ToastContainer };
}
