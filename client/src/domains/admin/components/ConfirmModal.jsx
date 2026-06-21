import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Premium custom confirmation dialog modal.
 * Replaces standard browser confirm() popups with premium Big Tech aesthetics.
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Ação",
  message = "Tem a certeza que deseja realizar esta ação? Esta alteração pode ser irreversível.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  type = "danger"
}) {
  const isDanger = type === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-bigStone/55 dark:bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="bg-white/95 dark:bg-dark-surface/95 border border-slate-200/80 dark:border-dark-muted/20 w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden p-6 text-center flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-brand-eastBay dark:text-dark-muted hover:bg-slate-100 dark:hover:bg-white/5 p-1.5 rounded-full transition-all"
            >
              <X size={16} />
            </button>

            {/* Glowing Icon Circle */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              isDanger 
                ? 'bg-feedback-errorLight text-feedback-error shadow-lg shadow-red-500/10' 
                : 'bg-feedback-warningLight text-amber-600 shadow-lg shadow-amber-500/10'
            }`}>
              {isDanger ? <Trash2 size={24} className="animate-pulse" /> : <AlertTriangle size={24} />}
            </div>

            {/* Title */}
            <h3 className="text-lg font-extrabold text-brand-bigStone dark:text-white leading-tight mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-brand-eastBay dark:text-dark-muted leading-relaxed mb-6 px-2">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 border border-slate-200 dark:border-dark-muted/20 hover:bg-slate-50 dark:hover:bg-white/5 text-brand-eastBay dark:text-dark-text rounded-2xl text-xs font-bold transition-all shadow-sm"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-5 py-3 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-red-500/10 ${
                  isDanger 
                    ? 'bg-feedback-error hover:bg-red-600 border border-feedback-error' 
                    : 'bg-amber-600 hover:bg-amber-700 border border-amber-600'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
