import { motion } from 'motion/react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export default function Localizacao() {
  const beiraCoords = { lat: -19.8333, lng: 34.85 }; // Approximate Beira coords
  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119776.43823458695!2d34.8048698!3d-19.833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1f2a3f7f7f7f7f7f%3A0x7f7f7f7f7f7f7f7f!2sBeira%2C%20Mo%C3%A7ambique!5e0!3m2!1spt-PT!2smz!4v1711880000000!5m2!1spt-PT!2smz`;

  return (
    <div className="bg-transparent min-h-screen pb-24">
      {/* Header */}
      <section className="relative text-white py-28 px-4 overflow-hidden bg-brand-bigStone dark:text-dark-text dark:bg-dark-surface">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/localizacao.jpg"
            alt="Localizacao"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/45 to-slate-950/20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-white/5)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-white/5)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Onde Estamos</h1>
          <p className="text-xl text-brand-poloBlue/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Visite-nos na cidade da Beira. Estamos de portas abertas para o receber.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Address Card */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-dark-surface p-10 rounded-[40px] shadow-xl border border-brand-poloBlue/20 dark:border-dark-muted/10 space-y-8">
              <div className="w-16 h-16 bg-brand-horizon/10 text-brand-horizon rounded-2xl flex items-center justify-center">
                <MapPin size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-brand-bigStone dark:text-dark-text">Sede Social</h2>
                <p className="text-brand-eastBay dark:text-dark-muted dark:text-dark-muted leading-relaxed">
                  Bairro de Macuti, Rua das Flores, nº 123<br />
                  Beira, Sofala<br />
                  Mocambique
                </p>
              </div>
              <div className="pt-8 border-t border-brand-poloBlue/15 dark:border-dark-muted/10 flex flex-col gap-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-horizon text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-eastBay transition-all"
                >
                  <Navigation size={18} /> Abrir no GPS
                </a>
                <button className="text-brand-eastBay dark:text-dark-muted dark:text-dark-muted text-sm font-bold flex items-center justify-center gap-2 hover:text-brand-bigStone dark:hover:text-brand-horizon transition-colors">
                  Ver Pontos de Referencia <ExternalLink size={14} />
                </button>
              </div>
            </div>

            <div className="bg-brand-eastBay text-white p-10 rounded-[40px] shadow-xl space-y-4">
              <h3 className="text-xl font-bold">Como Chegar?</h3>
              <p className="text-brand-poloBlue/90 text-sm leading-relaxed opacity-90">
                A nossa sede localiza-se perto da Escola Secundaria de Macuti. Se vier de transporte publico, peca para descer na paragem do "Mercado de Macuti".
              </p>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-surface p-4 rounded-[48px] shadow-2xl border border-brand-poloBlue/20 dark:border-dark-muted/10 h-[600px] overflow-hidden">
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '32px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da Beira"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
