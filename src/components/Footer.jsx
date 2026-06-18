import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function PartnerLogosStrip() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setPartners(data);
        }
      } catch (err) {
        console.error('Error fetching partners:', err);
      }
    }
    fetchPartners();
  }, []);

  if (partners.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center gap-6">
      <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">
        Parceiros:
      </p>
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="flex items-center"
          title={partner.name}
        >
          {partner.logo_data ? (
            <img
              src={partner.logo_data}
              alt={partner.name}
              className="h-16 max-w-[200px] object-contain bg-white/10 rounded px-1.5"
            />
          ) : partner.logo_url ? (
            <img
              src={partner.logo_url}
              alt={partner.name}
              className="h-16 max-w-[200px] object-contain bg-white/10 rounded px-1.5"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {partner.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img 
              src="Imagem/IMG-20260323-WA0000.jpg" 
              alt="Logo ALEM" 
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:scale-105 transition-all duration-300 shadow-md"
            />
            <span className="font-black text-xl tracking-wider text-white">ALEM</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Associacao Lacos Especiais de Mocambique. Dedicados a inclusao e apoio de pessoas com necessidades educativas especiais.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Facebook size={18} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Instagram size={18} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-blue-400 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Links Rapidos</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/inicio" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Inicio</Link></li>
            <li><Link to="/quem-somos" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Quem Somos</Link></li>
            <li><Link to="/o-que-fazemos" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">O Que Fazemos</Link></li>
            <li><Link to="/projetos-sociais" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Destaques</Link></li>
            <li><Link to="/contactos" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Contactos</Link></li>
            <li><Link to="/localizacao" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Localizacao</Link></li>
            <li><Link to="/doar" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Fazer Doacao</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contactos</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 group">
              <MapPin size={18} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Beira, Mocambique</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Phone size={18} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">+258 84 000 0000</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Mail size={18} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">info@alem.mz</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Newsletter</h3>
          <p className="text-sm mb-4 text-slate-400">Receba atualizacoes sobre os nossos projetos e eventos.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu email"
              className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm w-full text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg hover:shadow-blue-500/10">
              Ok
            </button>
          </form>
        </div>
      </div>

      {/* Partner logos strip - managed by admin — shown BEFORE copyright */}
      <PartnerLogosStrip />

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 ALEM - Associacao Lacos Especiais de Mocambique. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Politica de Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
        </div>
      </div>
    </footer>
  );
}
