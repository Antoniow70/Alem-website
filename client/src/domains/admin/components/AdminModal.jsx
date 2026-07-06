import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/**
 * Reusable modal wrapper for all admin modals.
 * Eliminates ~90 lines of duplicated backdrop/animation boilerplate.
 */
export default function AdminModal({ isOpen, onClose, title, subtitle, maxWidth = 'max-w-2xl', children, footer }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`bg-white w-full ${maxWidth} rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col`}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-brand-poloBlue/15 border-b border-brand-poloBlue/20 flex justify-between items-center sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-lg font-bold text-brand-bigStone dark:text-dark-text">{title}</h2>
                {subtitle && <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-brand-eastBay dark:text-dark-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            {children}

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-brand-poloBlue/15 border-t border-brand-poloBlue/20 flex flex-col sm:flex-row gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
