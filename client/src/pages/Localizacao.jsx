import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Clock, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  School, 
  Car, 
  Compass, 
  Share2, 
  ArrowUpRight 
} from 'lucide-react';

export default function Localizacao() {
  const beiraCoords = { lat: -19.8333, lng: 34.85 };
  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119776.43823458695!2d34.8048698!3d-19.833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1f2a3f7f7f7f7f7f%3A0x7f7f7f7f7f7f7f7f!2sBeira%2C%20Mo%C3%A7ambique!5e0!3m2!1spt-PT!2smz!4v1711880000000!5m2!1spt-PT!2smz`;
  
  const fullAddress = "Bairro de Macuti, Rua das Flores, nº 123, Beira, Sofala, Moçambique";
  const contactEmail = "info@alem.mz";
  const contactPhone = "+258 84 000 0000";

  const [copiedText, setCopiedText] = useState(null);
  const [status, setStatus] = useState({ open: false, text: 'A carregar estado...' });

  // Update working hours status in real-time
  useEffect(() => {
    function updateStatus() {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = now.getHours();

      if (day >= 1 && day <= 5) { // Mon-Fri
        if (hour >= 8 && hour < 17) {
          setStatus({ open: true, text: 'Aberto agora (Encerra às 17h00)' });
        } else {
          setStatus({ open: false, text: 'Fechado agora (Abre às 08h00)' });
        }
      } else { // Sat-Sun
        setStatus({ open: false, text: 'Fechado (Abre Segunda às 08h00)' });
      }
    }
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sede da ALEM - Moçambique',
          text: 'Localização da Associação Laços Especiais de Moçambique',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy(window.location.href, 'share');
    }
  };

  return (
    <div className="bg-transparent min-h-screen pb-24">
      
      {/* Header Banner - Enterprise Style */}
      <section className="relative text-white py-32 px-4 overflow-hidden bg-brand-bigStone dark:bg-dark-surface border-b border-brand-poloBlue/15 dark:border-dark-muted/10">
        {/* Background Image and Professional Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/localizacao.jpg"
            alt="Sede ALEM"
            className="w-full h-full object-cover scale-105 filter brightness-75 select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-bigStone/95 via-brand-bigStone/85 to-[#0F1D30]/95" />
          {/* Cyber grid aesthetic pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)] opacity-40" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-poloBlue/15 border border-brand-horizon/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-horizon dark:text-white"
          >
            <Compass size={12} className="animate-spin-slow" /> PRESENÇA NACIONAL
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md"
          >
            Sede e <span className="text-brand-horizon">Canais de Contacto</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-slate-350 max-w-xl mx-auto leading-relaxed font-light"
          >
            Visite as nossas instalações centrais na Beira ou utilize as vias de suporte dedicadas.
          </motion.p>
        </div>
      </section>

      {/* Main Interactive Dashboard Grid */}
      <section className="py-16 px-4 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Location & Contact Cards */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Card 1: Main Sede Social Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-xl border border-brand-poloBlue/20 dark:border-dark-muted/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-300 pointer-events-none">
                <MapPin size={120} className="text-brand-bigStone dark:text-white" />
              </div>

              {/* Real-time Open/Closed Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-brand-horizon/10 text-brand-horizon rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold transition-colors ${
                  status.open 
                    ? 'bg-feedback-successLight text-feedback-success border-emerald-200' 
                    : 'bg-feedback-errorLight text-feedback-error border-red-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${status.open ? 'bg-feedback-success' : 'bg-feedback-error'} animate-pulse`} />
                  {status.open ? 'Aberto' : 'Fechado'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-brand-bigStone dark:text-dark-text tracking-tight">Sede Central</h2>
                  <span className="text-[10px] font-semibold bg-brand-poloBlue/15 text-brand-poloBlue px-2 py-0.5 rounded-md">Principal</span>
                </div>
                <p className="text-brand-eastBay dark:text-dark-muted text-sm leading-relaxed font-medium">
                  Bairro de Macuti, Rua das Flores, nº 123<br />
                  Beira, Sofala<br />
                  Moçambique
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-brand-poloBlue/15 dark:border-dark-muted/10 space-y-3">
                <div className="flex gap-2">
                  <a
                    href="https://maps.google.com/?q=-19.8333,34.85"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-brand-horizon text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-eastBay hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md shadow-brand-horizon/10"
                  >
                    <Navigation size={14} /> Traçar Rota GPS
                  </a>
                  <button
                    onClick={() => handleCopy(fullAddress, 'address')}
                    className="bg-slate-50 dark:bg-dark-accent/10 text-brand-bigStone dark:text-white border border-brand-poloBlue/20 dark:border-dark-muted/20 hover:bg-slate-100 dark:hover:bg-dark-accent/20 p-3 rounded-xl transition-all relative flex items-center justify-center shrink-0"
                    title="Copiar Endereço"
                  >
                    <AnimatePresence mode="wait">
                      {copiedText === 'address' ? (
                        <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} className="text-feedback-success"><Check size={16} /></motion.div>
                      ) : (
                        <motion.div key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}><Copy size={16} /></motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="w-full bg-slate-50 dark:bg-dark-accent/10 text-brand-eastBay dark:text-dark-muted border border-brand-poloBlue/20 dark:border-dark-muted/20 hover:bg-slate-100 dark:hover:bg-dark-accent/20 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 size={13} /> {copiedText === 'share' ? 'Link Copiado!' : 'Partilhar Localização'}
                </button>
              </div>
            </motion.div>

            {/* Card 2: Contact channels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-xl border border-brand-poloBlue/20 dark:border-dark-muted/10 space-y-5"
            >
              <h3 className="text-sm font-bold text-brand-bigStone dark:text-dark-text uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-brand-horizon" /> Horários e Canais
              </h3>
              
              <div className="space-y-4">
                {/* Working hours item */}
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-slate-400 dark:text-dark-muted shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-brand-bigStone dark:text-dark-text">Horário Administrativo</p>
                    <p className="text-brand-eastBay dark:text-dark-muted mt-0.5">Segunda a Sexta: 08h00 - 17h00</p>
                    <p className="text-slate-400 dark:text-dark-muted/65 text-[10px] mt-0.5">{status.text}</p>
                  </div>
                </div>

                {/* Telephone item */}
                <div className="flex items-start gap-3 border-t border-brand-poloBlue/10 dark:border-dark-muted/10 pt-4">
                  <Phone size={16} className="text-slate-400 dark:text-dark-muted shrink-0 mt-0.5" />
                  <div className="text-xs flex-grow">
                    <p className="font-bold text-brand-bigStone dark:text-dark-text">Atendimento Geral</p>
                    <p className="text-brand-eastBay dark:text-dark-muted mt-0.5">{contactPhone}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(contactPhone, 'phone')}
                    className="text-slate-400 hover:text-brand-horizon p-1"
                    title="Copiar Telefone"
                  >
                    {copiedText === 'phone' ? <Check size={13} className="text-feedback-success" /> : <Copy size={13} />}
                  </button>
                </div>

                {/* Email item */}
                <div className="flex items-start gap-3 border-t border-brand-poloBlue/10 dark:border-dark-muted/10 pt-4">
                  <Mail size={16} className="text-slate-400 dark:text-dark-muted shrink-0 mt-0.5" />
                  <div className="text-xs flex-grow min-w-0">
                    <p className="font-bold text-brand-bigStone dark:text-dark-text">E-mail Institucional</p>
                    <p className="text-brand-eastBay dark:text-dark-muted mt-0.5 truncate">{contactEmail}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(contactEmail, 'email')}
                    className="text-slate-400 hover:text-brand-horizon p-1 shrink-0"
                    title="Copiar E-mail"
                  >
                    {copiedText === 'email' ? <Check size={13} className="text-feedback-success" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Reference points & details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-brand-bigStone dark:bg-dark-accent/10 border border-transparent dark:border-dark-muted/10 text-white dark:text-dark-text p-8 rounded-3xl shadow-xl space-y-4"
            >
              <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Compass size={16} className="text-brand-horizon" /> Instruções de Acesso
              </h4>
              <ul className="space-y-3.5 text-xs text-slate-300 dark:text-dark-muted font-light leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <School size={16} className="text-brand-horizon shrink-0 mt-0.5" />
                  <span>Localizados nas proximidades da **Escola Secundária de Macuti**.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Navigation size={16} className="text-brand-horizon shrink-0 mt-0.5" />
                  <span>De transporte público, peça para descer no **Mercado de Macuti** (5 min a pé).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Car size={16} className="text-brand-horizon shrink-0 mt-0.5" />
                  <span>Acesso facilitado para automóveis com parqueamento livre reservado no exterior.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Column: Immersive Map Sandbox (Device Mock) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col"
          >
            {/* Native Application Mock Frame */}
            <div className="bg-slate-900 border border-slate-700/80 rounded-[32px] p-3 shadow-2xl flex-grow flex flex-col overflow-hidden h-[650px] relative group">
              
              {/* Browser/Window Controls Header Bar */}
              <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800 text-xs text-slate-500 font-semibold select-none">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
                </div>
                <div className="bg-slate-950/80 px-8 py-1 rounded-lg text-[10px] text-slate-400 truncate max-w-[280px] border border-slate-800/80 font-mono tracking-wide">
                  maps.google.com/beira-alem-sede
                </div>
                <div className="text-[10px] text-slate-400 font-mono font-bold shrink-0">
                  {beiraCoords.lat.toFixed(4)}°, {beiraCoords.lng.toFixed(4)}° E
                </div>
              </div>

              {/* Maps Frame */}
              <div className="flex-grow rounded-2xl overflow-hidden bg-slate-950 relative mt-2 border border-slate-800/60">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa da Beira"
                  className="filter contrast-[1.05] brightness-95 opacity-90 group-hover:opacity-100 transition-all duration-500"
                ></iframe>

                {/* Floating GPS coordinates overlay on map */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg z-10">
                  <div className="text-left font-mono">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-bold">SOFALA - MOÇAMBIQUE</span>
                    <span className="text-[11px] text-white font-bold">19.8333° Sul, 34.8500° Este</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=-19.8333,34.85"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-horizon hover:bg-brand-poloBlue text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-brand-horizon/10"
                  >
                    Google Maps <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
