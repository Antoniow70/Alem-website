import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getPartners } from '../services/parceirosApi';

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

  if (partners.length === 0) return null;

  return (
    <div className="w-full py-10 px-6 bg-transparent">
      <div className="text-center mb-8 space-y-2">
        <span className="text-[10px] font-bold text-brand-horizon uppercase tracking-[0.3em] block">
          Parcerias de Confianca
        </span>
        <h3 className="text-lg font-bold text-brand-bigStone dark:text-white tracking-tight">
          Instituicoes que Apoiam a Nossa Causa
        </h3>
        <div className="w-12 h-1 bg-brand-horizon mx-auto rounded-full mt-3" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="w-full max-w-[170px] flex items-center justify-center p-2"
          >
            {partner.logo_data || partner.logo_url ? (
              <img
                src={partner.logo_data || partner.logo_url}
                alt={partner.name}
                className="max-h-16 max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xs font-bold text-brand-eastBay dark:text-white uppercase tracking-wider text-center line-clamp-2 px-1">
                {partner.name}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
