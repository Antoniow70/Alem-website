import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Inicio', path: '/', targetId: 'inicio' },
  { name: 'Quem Somos', path: '/#quem-somos', targetId: 'quem-somos' },
  { name: 'O Que Fazemos', path: '/#o-que-fazemos', targetId: 'o-que-fazemos' },
  { name: 'Destaques', path: '/#destaques', targetId: 'destaques' },
  { name: 'Contactos', path: '/#contactos', targetId: 'contactos' },
  { name: 'Localizacao', path: '/#localizacao', targetId: 'localizacao' },
  { name: 'Doar', path: '/doar', targetId: '' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/inicio') {
      setActiveSection('');
      return;
    }
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    const sections = ['inicio', 'quem-somos', 'o-que-fazemos', 'destaques', 'contactos', 'localizacao'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavLinkClick = (e, targetId, path) => {
    if (!targetId) {
      e.preventDefault();
      navigate(path);
      setIsOpen(false);
      return;
    }
    if (location.pathname === '/' || location.pathname === '/inicio') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsOpen(false);
    } else {
      e.preventDefault();
      navigate('/', { state: { scrollToId: targetId } });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        `fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 text-white border-b`,
        scrolled
          ? 'py-3 bg-[#14213D]/95 backdrop-blur-md shadow-md border-white/10'
          : 'py-4 bg-[#14213D] border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" onClick={(e) => handleNavLinkClick(e, 'inicio')} className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="Imagem/logo alem.jpg"
              alt="Logo ALEM"
              className="w-11 h-11 rounded-full object-cover border border-white/20 group-hover:border-blue-400/50 group-hover:scale-105 transition-all duration-300 shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-wider text-white">
              ALEM
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] font-extrabold text-blue-400 mt-0.5">
              Mocambique
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 mx-auto">
          {navLinks.map((link) => {
            const isActive = link.targetId
              ? (location.pathname === '/' && activeSection === link.targetId)
              : (location.pathname === link.path);
            return (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavLinkClick(e, link.targetId, link.path)}
                className={cn(
                  'text-sm font-medium transition-all relative py-2 px-1 cursor-pointer',
                  isActive ? 'text-blue-400' : 'text-white/80 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-blue-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* CTA (kept at the right) */}
        <Link
          to="/doar"
          className="btn-primary text-xs !py-2.5 !px-4 ml-6 hidden md:inline-flex"
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
            className="md:hidden bg-[#14213D]/95 backdrop-blur-md border border-white/10 mt-3 overflow-hidden rounded-xl shadow-xl absolute left-4 right-4"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => {
                const isActive = link.targetId
                  ? (location.pathname === '/' && activeSection === link.targetId)
                  : (location.pathname === link.path);
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => handleNavLinkClick(e, link.targetId, link.path)}
                    className={cn(
                      'text-sm font-semibold p-3 rounded-lg transition-all duration-200 flex items-center cursor-pointer',
                      isActive
                        ? 'bg-white/10 text-blue-400'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {link.name}
                  </a>
                );
              })}
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
