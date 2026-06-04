import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

// Partner Logo Components
const UnicefLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-8 text-blue-400 fill-current" aria-label="UNICEF Logo">
    <circle cx="35" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M15 30h40M35 10v40" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 20c8 5 8 15 0 20M50 20c-8 5-8 15 0 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M33 22a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M30 38c0-3.5 2-6 5-6h1c1 0 2 1 2 2v6h-2v-4h-2v4h-4z" />
    <path d="M36 29c-1-1-2-1.5-3.5-1.5-3 0-5.5 2.5-5.5 6s2.5 6 5.5 6c1.5 0 2.5-.5 3.5-1.5V34h-3v-1.5h4.5v5.5" />
    <text x="68" y="38" className="font-sans font-extrabold text-xl tracking-tight text-white">unicef</text>
  </svg>
);

const UniZambezeLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-8 text-yellow-500 fill-current" aria-label="UniZambeze Logo">
    <path d="M20 15v18c0 10 15 15 15 15s15-5 15-15V15H20z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M26 20h18M26 25h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M23 30c6 2 12-2 18 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 33s5 3 15 3 15-3 15-3" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="31" y="27" className="font-sans font-bold text-xs text-white">UZ</text>
    <text x="62" y="32" className="font-sans font-extrabold text-sm tracking-wide text-white">UniZambeze</text>
  </svg>
);

const MinedhLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-8 text-emerald-500 fill-current" aria-label="MINEDH Logo">
    <path d="M15 42c8-2 16-5 20-2 4-3 12 0 20 2V22c-8-2-16-5-20-2-4-3-12 0-20 2v20z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M35 20v22" stroke="currentColor" strokeWidth="2" />
    <path d="M35 15V8m-7 9l-4-5m18 5l4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="35" cy="18" r="3" className="text-yellow-500" />
    <text x="65" y="28" className="font-sans font-black text-xs tracking-wider text-white">MINEDH</text>
  </svg>
);

const FdcLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-8 text-red-500 fill-current" aria-label="FDC Logo">
    <path d="M22 36c-4-4-4-10 0-14s10-4 14 0l2 2 2-2c4-4 10-4 14 0s4 10 0 14L38 50 22 36z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="33" cy="27" r="2.5" />
    <circle cx="43" cy="27" r="2.5" />
    <path d="M29 34c1-3 3-4 4-4s3 1 4 4m2 0c1-3 3-4 4-4s3 1 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <text x="65" y="32" className="font-sans font-black text-base tracking-widest text-white">FDC</text>
  </svg>
);

const AdemoLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-8 text-purple-500 fill-current" aria-label="ADEMO Logo">
    <circle cx="32" cy="18" r="4" />
    <path d="M24 38c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M32 24v8l8 4m-8-4h-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M43 14l2 2.5 3-.5-1.5 2.5 2 2.5-3.5-.5-1.5 2.5v-3.5l-3-.5 3-.5z" className="text-yellow-400" />
    <text x="62" y="31" className="font-sans font-extrabold text-base tracking-wider text-white">ADEMO</text>
  </svg>
);

const partners = [
  { name: 'UNICEF Moçambique', component: <UnicefLogo /> },
  { name: 'UniZambeze', component: <UniZambezeLogo /> },
  { name: 'MINEDH', component: <MinedhLogo /> },
  { name: 'FDC', component: <FdcLogo /> },
  { name: 'ADEMO', component: <AdemoLogo /> },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 border-t border-slate-800/80">

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
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/80">
        {/* Partners Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Parceiros</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className="bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 hover:border-slate-700/60 rounded-xl p-3 flex items-center justify-center transition-all duration-300 group"
              >
                <div className="w-full filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  {partner.component}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 border-t border-slate-800/80 pt-8">
          <p>© 2026 ALEM - Associação Laços Especiais de Moçambique. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
