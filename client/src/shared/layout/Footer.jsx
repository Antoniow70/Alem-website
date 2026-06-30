import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPartners } from '../../domains/parceiros';



export default function Footer() {
  return (
    <footer className="bg-brand-bigStone dark:bg-dark-bg text-white pt-16 pb-8 px-6 border-t border-white/10 dark:border-dark-accent/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link
            to="/inicio"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img 
              src="/images/logo alem.jpg" 
              alt="Logo ALEM" 
              className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:scale-105 transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white">ALEM</span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-extrabold text-brand-poloBlue mt-0.5">
                Mocambique
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-300 dark:text-dark-muted">
            Associacao Lacos Especiais de Mocambique. Dedicados a inclusao e apoio de pessoas com necessidades educativas especiais.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hover:-translate-y-1 transition-all duration-300"><Facebook size={16} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hover:-translate-y-1 transition-all duration-300"><Instagram size={16} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hover:-translate-y-1 transition-all duration-300"><Twitter size={16} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">Links Rapidos</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/inicio" className="text-slate-300 hover:text-white transition-all duration-200">Inicio</Link></li>
            <li><Link to="/quem-somos" className="text-slate-300 hover:text-white transition-all duration-200">Quem Somos</Link></li>
            <li><Link to="/o-que-fazemos" className="text-slate-300 hover:text-white transition-all duration-200">O Que Fazemos</Link></li>
            <li><Link to="/destaques" className="text-slate-300 hover:text-white transition-all duration-200">Destaques</Link></li>
            <li><Link to="/contactos" className="text-slate-300 hover:text-white transition-all duration-200">Contactos</Link></li>
            <li><Link to="/localizacao" className="text-slate-300 hover:text-white transition-all duration-200">Localizacao</Link></li>
            <li><Link to="/doar" className="text-slate-300 hover:text-white transition-all duration-200">Fazer Doacao</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">Contactos</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 group">
              <MapPin size={16} className="text-brand-horizon shrink-0 mt-0.5" />
              <span className="text-slate-300 dark:text-dark-muted">Beira, Mocambique</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Phone size={16} className="text-brand-horizon shrink-0" />
              <span className="text-slate-300 dark:text-dark-muted">+258 84 000 0000</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Mail size={16} className="text-brand-horizon shrink-0" />
              <span className="text-slate-300 dark:text-dark-muted">info@alem.mz</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">Newsletter</h3>
          <p className="text-sm mb-4 text-slate-300 dark:text-dark-muted">Receba atualizacoes sobre os nossos projetos e eventos.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu email"
              className="bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm w-full placeholder-brand-poloBlue focus:outline-none focus:border-brand-poloBlue focus:ring-2 focus:ring-brand-horizon/20 transition-all"
            />
            <button className="bg-brand-horizon text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-eastBay active:scale-95 transition-all">
              Ok
            </button>
          </form>
        </div>
      </div>



      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 dark:border-dark-muted/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-poloBlue/60 dark:text-dark-muted">
        <p>© 2026 ALEM - Associacao Lacos Especiais de Mocambique. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Politica de Privacidade</Link>
          <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
        </div>
      </div>
    </footer>
  );
}
