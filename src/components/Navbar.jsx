import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Inicio', path: '/inicio' },
  { name: 'Quem Somos', path: '/quem-somos' },
  { name: 'O Que Fazemos', path: '/o-que-fazemos' },
  { name: 'Destaques', path: '/projetos-sociais' },
  { name: 'Contactos', path: '/contactos' },
  { name: 'Localizacao', path: '/localizacao' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      // only show navbar when at the very top
      setShowNav(current <= 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // close mobile nav when route changes and set navbar visibility based on scroll
    if (isOpen) setIsOpen(false);
    setShowNav(window.scrollY <= 10);
  }, [location]);

  return (
    <nav
      className={cn(
        `fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'} px-6 py-4 border-b`,
        // Navbar background set to requested blue #14213D
        'bg-[#14213D] backdrop-blur-md border-b border-[#0f172a]/10 text-white'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/inicio" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="Imagem/logo alem.jpg"
              alt="Logo ALEM"
              className="w-14 h-14 -my-2 rounded-full object-cover border-2 border-white/20 group-hover:border-brand-primary/50 group-hover:scale-105 transition-all duration-300 shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl leading-none tracking-wider text-white transition-colors duration-300">
              ALEM
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-brand-primary transition-colors duration-300 mt-0.5">
              Mocambique
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 mx-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-semibold transition-all relative py-2 px-1',
                  isActive ? 'text-brand-primary' : 'text-white/90 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-brand-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA (kept at the right) */}
        <Link
          to="/doar"
          className="btn-primary text-sm ml-6 hidden md:inline-flex"
        >
          Doar Agora
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl transition-all duration-200 active:scale-95 text-white hover:text-white/90 hover:bg-white/10"
          onClick={() => { setIsOpen(!isOpen); }}
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
            className="md:hidden bg-[#14213D]/95 backdrop-blur-md border border-[#0f172a]/10 mt-3 overflow-hidden rounded-2xl shadow-2xl absolute left-4 right-4"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-base font-bold p-3 rounded-xl transition-all duration-200 flex items-center',
                    location.pathname === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-white/90 hover:bg-white/10'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/doar"
                className="btn-primary text-sm p-4 rounded-xl text-center font-bold active:scale-[0.98] transition-transform mt-2"
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
