import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';

export default function DialogConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = 'Terminar Sessao',
  message = 'Tem a certeza que deseja terminar a sua sessao?',
  confirmText = 'Terminar',
  cancelText = 'Cancelar'
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-2xl border border-brand-poloBlue/20 shadow-2xl max-w-sm w-full p-6 relative z-10 flex flex-col items-center text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-brand-eastBay dark:text-dark-muted p-1 rounded-lg hover:bg-brand-poloBlue/15 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Icon Wrapper */}
            <div className="w-12 h-12 rounded-full bg-feedback-errorLight border border-feedback-errorBorder text-feedback-error flex items-center justify-center mb-4">
              <LogOut size={20} className="translate-x-0.5" />
            </div>

            {/* Content */}
            <h3 className="text-base font-extrabold text-brand-bigStone dark:text-dark-text mb-2">{title}</h3>
            <p className="text-brand-eastBay dark:text-dark-muted text-xs leading-relaxed mb-6 px-1">
              {message}
            </p>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-brand-eastBay dark:text-dark-muted hover:text-brand-bigStone dark:text-dark-text border border-slate-200 hover:bg-brand-poloBlue/15 hover:border-slate-300 transition-all duration-200"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-feedback-error hover:bg-feedback-error hover:shadow-lg hover:shadow-feedback-error/10 active:scale-[0.98] transition-all duration-200"
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
