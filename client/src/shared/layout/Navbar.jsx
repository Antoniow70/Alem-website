import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/utils';

const navLinks = [
  { name: 'Inicio', path: '/inicio' },
  { name: 'Quem Somos', path: '/quem-somos' },
  { name: 'O Que Fazemos', path: '/o-que-fazemos' },
  { name: 'Destaques', path: '/destaques' },
  { name: 'Historias', path: '/historias-beneficiarios' },
  { name: 'Contactos', path: '/contactos' },
  { name: 'Localizacao', path: '/localizacao' },
  { name: 'Doar', path: '/doar' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        `fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 text-white border-b`,
        scrolled
          ? 'py-3 bg-brand-bigStone/95 dark:bg-dark-surface/95 backdrop-blur-md shadow-md border-white/10 dark:border-dark-accent/10'
          : 'py-4 bg-brand-bigStone dark:bg-dark-bg border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/inicio" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/images/logo alem.jpg"
              alt="Logo ALEM"
              className="w-11 h-11 rounded-full object-cover border border-white/20 group-hover:border-brand-poloBlue/50 group-hover:scale-105 transition-all duration-300 shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-wider text-white">
              ALEM
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] font-extrabold text-brand-poloBlue mt-0.5">
              Mocambique
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 mx-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/inicio' && location.pathname === '/');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-all relative py-2 px-1 cursor-pointer',
                  isActive ? 'text-brand-poloBlue' : 'text-white/80 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-brand-poloBlue"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-white/10 hover:border-white/30 text-white/90 hover:text-white hover:bg-white/5 transition-all duration-200 ml-6 active:scale-95 cursor-pointer hidden md:inline-flex"
          aria-label="Alternar Tema"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* CTA (kept at the right) */}
        <Link
          to="/doar"
          className="btn-primary text-xs !py-2.5 !px-4 ml-4 hidden md:inline-flex"
        >
          Doar Agora
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl transition-all duration-200 active:scale-95 text-white hover:bg-white/10"
          onClick={() => { setIsOpen(!isOpen); }}
          aria-label="Menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-brand-bigStone/95 dark:bg-dark-surface/95 backdrop-blur-md border border-white/10 dark:border-dark-accent/10 mt-3 overflow-hidden rounded-xl shadow-xl absolute left-4 right-4"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path === '/inicio' && location.pathname === '/');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'text-sm font-semibold p-3 rounded-lg transition-all duration-200 flex items-center cursor-pointer',
                      isActive
                        ? 'bg-white/10 text-brand-horizon'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="border border-white/10 hover:border-white/30 text-white/90 hover:text-white hover:bg-white/5 text-sm p-3 rounded-lg text-center font-semibold active:scale-[0.98] transition-transform mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={15} /> Modo Escuro
                  </>
                ) : (
                  <>
                    <Sun size={15} /> Modo Claro
                  </>
                )}
              </button>
              <Link
                to="/doar"
                className="btn-primary text-sm p-3 rounded-lg text-center font-bold active:scale-[0.98] transition-transform mt-2"
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
