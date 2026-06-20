import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPartners } from '../../domains/parceiros';

function PartnerLogosStrip() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const data = await getPartners();
        setPartners(data || []);
      } catch (err) {
        console.error('Error fetching partners:', err);
      }
    }
    fetchPartners();
  }, []);

  if (partners.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800/40 flex flex-col md:flex-row items-center gap-6">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] shrink-0">
        Parceiros:
      </p>
      <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex items-center filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            title={partner.name}
          >
            {partner.logo_data ? (
              <img
                src={partner.logo_data}
                alt={partner.name}
                className="h-8 max-w-[130px] object-contain"
              />
            ) : partner.logo_url ? (
              <img
                src={partner.logo_url}
                alt={partner.name}
                className="h-8 max-w-[130px] object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest">
                {partner.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFooterLinkClick = (e, targetId) => {
    if (location.pathname === '/' || location.pathname === '/inicio') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      e.preventDefault();
      navigate('/', { state: { scrollToId: targetId } });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link
            to="/"
            onClick={(e) => handleFooterLinkClick(e, 'inicio')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img 
              src="/images/logo alem.jpg" 
              alt="Logo ALEM" 
              className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:scale-105 transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white">ALEM</span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-extrabold text-blue-400 mt-0.5">
                Mocambique
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            Associacao Lacos Especiais de Mocambique. Dedicados a inclusao e apoio de pessoas com necessidades educativas especiais.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Facebook size={16} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Instagram size={16} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-400 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Twitter size={16} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">Links Rapidos</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" onClick={(e) => handleFooterLinkClick(e, 'inicio')} className="text-slate-400 hover:text-white transition-all duration-200">Inicio</Link></li>
            <li><Link to="/#quem-somos" onClick={(e) => handleFooterLinkClick(e, 'quem-somos')} className="text-slate-400 hover:text-white transition-all duration-200">Quem Somos</Link></li>
            <li><Link to="/#o-que-fazemos" onClick={(e) => handleFooterLinkClick(e, 'o-que-fazemos')} className="text-slate-400 hover:text-white transition-all duration-200">O Que Fazemos</Link></li>
            <li><Link to="/#destaques" onClick={(e) => handleFooterLinkClick(e, 'destaques')} className="text-slate-400 hover:text-white transition-all duration-200">Destaques</Link></li>
            <li><Link to="/#contactos" onClick={(e) => handleFooterLinkClick(e, 'contactos')} className="text-slate-400 hover:text-white transition-all duration-200">Contactos</Link></li>
            <li><Link to="/#localizacao" onClick={(e) => handleFooterLinkClick(e, 'localizacao')} className="text-slate-400 hover:text-white transition-all duration-200">Localizacao</Link></li>
            <li><Link to="/doar" className="text-slate-400 hover:text-white transition-all duration-200">Fazer Doacao</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">Contactos</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 group">
              <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-400 transition-colors">Beira, Mocambique</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Phone size={16} className="text-emerald-500 shrink-0" />
              <span className="text-slate-400 transition-colors">+258 84 000 0000</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Mail size={16} className="text-emerald-500 shrink-0" />
              <span className="text-slate-400 transition-colors">info@alem.mz</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">Newsletter</h3>
          <p className="text-sm mb-4 text-slate-400">Receba atualizacoes sobre os nossos projetos e eventos.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu email"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm w-full text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-500 active:scale-95 transition-all">
              Ok
            </button>
          </form>
        </div>
      </div>

      <PartnerLogosStrip />

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 ALEM - Associacao Lacos Especiais de Mocambique. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Politica de Privacidade</Link>
          <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
        </div>
      </div>
    </footer>
  );
}
