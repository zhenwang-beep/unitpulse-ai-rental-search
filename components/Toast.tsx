import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ToastData {
  message: string;
  subtext?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl min-w-[280px] max-w-sm"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{toast.message}</p>
            {toast.subtext && (
              <p className="text-xs text-white/60 mt-0.5">{toast.subtext}</p>
            )}
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => { toast.onAction!(); onDismiss(); }}
              className="text-xs font-bold text-[#a3c45e] whitespace-nowrap hover:text-[#c5e07a] transition-colors shrink-0"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="p-0.5 text-white/40 hover:text-white transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
