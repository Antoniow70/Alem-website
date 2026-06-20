import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DialogConfirm from '../../../shared/ui/DialogConfirm';

export default function AdminSidebar({ 
  menuItems, 
  activeTab, 
  setActiveTab, 
  handleLogout, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) {
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-6 sticky top-0 z-40 text-white">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo alem.jpg"
            alt="Logo ALEM"
            className="w-8 h-8 rounded-full object-cover border border-white/20"
          />
          <div className="flex flex-col">
            <span className="font-black text-sm leading-none tracking-wider text-white">ALEM</span>
            <span className="text-[8px] uppercase tracking-[0.2em] font-extrabold text-blue-400 mt-0.5">
              Painel Admin
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-slate-950 border-r border-slate-900 z-50 lg:hidden flex flex-col p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-900">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logo alem.jpg"
                    alt="Logo ALEM"
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                  <div className="flex flex-col">
                    <span className="font-black text-base leading-none tracking-wider text-white">ALEM</span>
                    <span className="text-[8px] uppercase tracking-[0.2em] font-extrabold text-blue-400 mt-0.5">
                      Painel Admin
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-slate-900 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-grow space-y-1.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                      activeTab === item.id ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                    }`}
                  >
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeAdminTabMobile"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-lg shadow-blue-600/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`z-10 flex items-center gap-3.5 transition-transform duration-200 ${
                      activeTab === item.id ? '' : 'group-hover:translate-x-0.5'
                    }`}>
                      <span className={`transition-colors duration-200 ${
                        activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>

              <button
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all mt-auto"
              >
                <LogOut size={18} /> Sair
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-900 hidden lg:flex flex-col p-6 fixed h-full z-30 text-white">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-900">
          <img
            src="/images/logo alem.jpg"
            alt="Logo ALEM"
            className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-black text-base leading-none tracking-wider text-white">ALEM</span>
            <span className="text-[8px] uppercase tracking-[0.25em] font-extrabold text-blue-400 mt-1">
              Painel Admin
            </span>
          </div>
        </div>

        <nav className="flex-grow space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                activeTab === item.id ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeAdminTabDesktop"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-lg shadow-blue-600/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className={`z-10 flex items-center gap-3.5 transition-transform duration-200 ${
                activeTab === item.id ? '' : 'group-hover:translate-x-0.5'
              }`}>
                <span className={`transition-colors duration-200 ${
                  activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}>
                  {item.icon}
                </span>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all mt-auto"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      <DialogConfirm
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={async () => {
          await handleLogout();
          navigate('/');
        }}
      />
    </>
  );
}
