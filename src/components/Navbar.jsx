import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Início', path: '/inicio' },
  { name: 'Quem Somos', path: '/quem-somos' },
  { name: 'O Que Fazemos', path: '/o-que-fazemos' },
  { name: 'Projetos', path: '/projetos-sociais' },
  { name: 'Financiamento', path: '/meios-financiamento' },
  { name: 'Contactos', path: '/contactos' },
  { name: 'Localização', path: '/localizacao' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setIsOpen(false);
  }, [location, isOpen]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-900/5 py-3 border-b border-slate-100/80' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/inicio" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src="IMG-20260323-WA0000.jpg" 
              alt="Logo ALEM" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-blue-600/50 group-hover:scale-105 transition-all duration-300 shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-black text-xl leading-none tracking-wider transition-colors duration-300",
              scrolled ? "text-slate-900" : "text-white"
            )}>ALEM</span>
            <span className={cn(
              "text-[9px] uppercase tracking-[0.2em] font-extrabold transition-colors duration-300 mt-0.5",
              scrolled ? "text-yellow-600" : "text-yellow-400"
            )}>Moçambique</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-semibold transition-all relative py-2 px-1',
                  scrolled
                    ? isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                    : isActive ? 'text-yellow-400' : 'text-white/80 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className={cn(
                      "absolute bottom-0 left-1 right-1 h-0.5 rounded-full",
                      scrolled ? "bg-blue-600" : "bg-yellow-400"
                    )}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/meios-financiamento"
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95",
              scrolled
                ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-green-600/20"
                : "bg-white hover:bg-slate-100 text-slate-900 hover:shadow-white/10"
            )}
          >
            Doar Agora
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden p-2 rounded-xl transition-all duration-200 active:scale-95",
            scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border border-slate-200/50 mt-3 overflow-hidden rounded-2xl shadow-2xl absolute left-4 right-4"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-base font-bold p-3 rounded-xl transition-all duration-200 flex items-center',
                    location.pathname === link.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/meios-financiamento"
                className="bg-green-600 text-white p-4 rounded-xl text-center font-bold shadow-lg shadow-green-600/20 active:scale-[0.98] transition-transform mt-2"
              >
                Doar Agora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
