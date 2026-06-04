import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Partners from './Partners';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 border-t border-slate-800/80">
      {/* Partners Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <Partners />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-lg">A</span>
            </div>
            <span className="font-black text-xl tracking-wider text-white">ALEM</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Associação Laços Especiais de Moçambique. Dedicados à inclusão e apoio de pessoas com necessidades educativas especiais.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Facebook size={18} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Instagram size={18} /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-blue-400 hover:text-white flex items-center justify-center text-slate-400 hover:-translate-y-1 transition-all duration-300"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Links Rápidos</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/inicio" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Início</Link></li>
            <li><Link to="/quem-somos" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Quem Somos</Link></li>
            <li><Link to="/projetos-sociais" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Projetos Sociais</Link></li>
            <li><Link to="/meios-financiamento" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Como Ajudar</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contactos</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 group">
              <MapPin size={18} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Beira, Moçambique</span>
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
          <p className="text-sm mb-4 text-slate-400">Receba atualizações sobre os nossos projetos e eventos.</p>
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
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 ALEM - Associação Laços Especiais de Moçambique. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
        </div>
      </div>
    </footer>
  );
}
