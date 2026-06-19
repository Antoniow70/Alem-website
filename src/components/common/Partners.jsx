import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getPartners } from '../../services/adminService';

// Custom SVG Logo for UNICEF Mocambique
const UnicefLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-12 text-blue-400 fill-current" aria-label="UNICEF Logo">
    <circle cx="35" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M15 30h40M35 10v40" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 20c8 5 8 15 0 20M50 20c-8 5-8 15 0 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M33 22a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M30 38c0-3.5 2-6 5-6h1c1 0 2 1 2 2v6h-2v-4h-2v4h-4z" />
    <path d="M36 29c-1-1-2-1.5-3.5-1.5-3 0-5.5 2.5-5.5 6s2.5 6 5.5 6c1.5 0 2.5-.5 3.5-1.5V34h-3v-1.5h4.5v5.5" />
    <text x="68" y="38" className="font-sans font-extrabold text-2xl tracking-tight text-white">unicef</text>
    <text x="68" y="48" className="font-sans font-medium text-[8px] tracking-[0.2em] text-blue-400 uppercase">Mocambique</text>
  </svg>
);

// Custom SVG Logo for UniZambeze
const UniZambezeLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-12 text-yellow-500 fill-current" aria-label="UniZambeze Logo">
    <path d="M20 15v18c0 10 15 15 15 15s15-5 15-15V15H20z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M26 20h18M26 25h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M23 30c6 2 12-2 18 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 33s5 3 15 3 15-3 15-3" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="31" y="27" className="font-sans font-bold text-xs text-white">UZ</text>
    <text x="62" y="32" className="font-sans font-extrabold text-[15px] tracking-wide text-white">UniZambeze</text>
    <text x="62" y="44" className="font-sans font-medium text-[7px] tracking-[0.15em] text-slate-400 uppercase">Univ. Licenciada pelo MINEDH</text>
  </svg>
);

// Custom SVG Logo for MINEDH (Ministerio da Educacao e Desenvolvimento Humano)
const MinedhLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-12 text-emerald-500 fill-current" aria-label="MINEDH Logo">
    <path d="M15 42c8-2 16-5 20-2 4-3 12 0 20 2V22c-8-2-16-5-20-2-4-3-12 0-20 2v20z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M35 20v22" stroke="currentColor" strokeWidth="2" />
    <path d="M35 15V8m-7 9l-4-5m18 5l4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="35" cy="18" r="3" className="text-yellow-500" />
    <text x="65" y="28" className="font-sans font-black text-sm tracking-wider text-white">MINEDH</text>
    <text x="65" y="40" className="font-sans font-medium text-[7px] tracking-[0.05em] text-slate-400 uppercase">Ministerio da Educacao</text>
    <text x="65" y="48" className="font-sans font-medium text-[6px] tracking-[0.05em] text-slate-500 uppercase">e Desenvolvimento Humano</text>
  </svg>
);

// Custom SVG Logo for FDC (Fundacao para o Desenvolvimento da Comunidade)
const FdcLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-12 text-red-500 fill-current" aria-label="FDC Logo">
    <path d="M22 36c-4-4-4-10 0-14s10-4 14 0l2 2 2-2c4-4 10-4 14 0s4 10 0 14L38 50 22 36z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="33" cy="27" r="2.5" />
    <circle cx="43" cy="27" r="2.5" />
    <path d="M29 34c1-3 3-4 4-4s3 1 4 4m2 0c1-3 3-4 4-4s3 1 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <text x="65" y="32" className="font-sans font-black text-xl tracking-widest text-white">FDC</text>
    <text x="65" y="44" className="font-sans font-bold text-[7px] tracking-[0.1em] text-slate-400 uppercase">Fundacao para o Desenvolvimento</text>
    <text x="65" y="51" className="font-sans font-medium text-[6px] tracking-[0.1em] text-slate-500 uppercase">da Comunidade</text>
  </svg>
);

// Custom SVG Logo for ADEMO (Associacao dos Deficientes de Mocambique)
const AdemoLogo = () => (
  <svg viewBox="0 0 200 60" className="w-full h-12 text-purple-500 fill-current" aria-label="ADEMO Logo">
    <circle cx="32" cy="18" r="4" />
    <path d="M24 38c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M32 24v8l8 4m-8-4h-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M43 14l2 2.5 3-.5-1.5 2.5 2 2.5-3.5-.5-1.5 2.5v-3.5l-3-.5 3-.5z" className="text-yellow-400" />
    <text x="62" y="31" className="font-sans font-extrabold text-lg tracking-wider text-white">ADEMO</text>
    <text x="62" y="43" className="font-sans font-bold text-[7px] tracking-[0.1em] text-slate-400 uppercase">Associacao dos Deficientes</text>
    <text x="62" y="50" className="font-sans font-medium text-[6px] tracking-[0.1em] text-slate-500 uppercase">de Mocambique</text>
  </svg>
);

const defaultPartners = [
  { name: 'UNICEF Mocambique', component: <UnicefLogo /> },
  { name: 'UniZambeze', component: <UniZambezeLogo /> },
  { name: 'MINEDH', component: <MinedhLogo /> },
  { name: 'FDC', component: <FdcLogo /> },
  { name: 'ADEMO', component: <AdemoLogo /> },
];

export default function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function loadPartners() {
      try {
        const data = await getPartners();
        setPartners(data || []);
      } catch (err) {
        console.error('Error loading partners:', err);
      }
    }
    loadPartners();
  }, []);

  return (
    <div className="w-full py-10 bg-slate-950/60 rounded-3xl border border-slate-800/80 px-6 backdrop-blur-sm">
      <div className="text-center mb-8 space-y-2">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] block">
          Parcerias de Confianca
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight">
          Instituicoes que Apoiam a Nossa Causa
        </h3>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full mt-3" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
        {partners.length > 0 ? (
          partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                y: -4,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
              className="w-full max-w-[170px] bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/50 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 group cursor-pointer"
            >
              <img
                src={partner.logo_url || partner.logo_data || 'https://via.placeholder.com/150'}
                alt={partner.name}
                className="max-h-12 max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </motion.div>
          ))
        ) : (
          defaultPartners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                y: -4,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
              className="w-full max-w-[170px] bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/50 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 group cursor-pointer"
            >
              <div className="w-full filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                {partner.component}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
