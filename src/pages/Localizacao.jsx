import { motion } from 'motion/react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export default function Localizacao() {
  const beiraCoords = { lat: -19.8333, lng: 34.85 }; // Approximate Beira coords
  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119776.43823458695!2d34.8048698!3d-19.833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1f2a3f7f7f7f7f7f%3A0x7f7f7f7f7f7f7f7f!2sBeira%2C%20Mo%C3%A7ambique!5e0!3m2!1spt-PT!2smz!4v1711880000000!5m2!1spt-PT!2smz`;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-slate-900 text-white py-28 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold">Onde Estamos</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Visite-nos na cidade da Beira. Estamos de portas abertas para o receber.
          </p>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Address Card */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 space-y-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <MapPin size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Sede Social</h2>
                <p className="text-slate-600 leading-relaxed">
                  Bairro de Macuti, Rua das Flores, nº 123<br />
                  Beira, Sofala<br />
                  Moçambique
                </p>
              </div>
              <div className="pt-8 border-t border-slate-50 flex flex-col gap-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                >
                  <Navigation size={18} /> Abrir no GPS
                </a>
                <button className="text-slate-500 text-sm font-bold flex items-center justify-center gap-2 hover:text-slate-900 transition-colors">
                  Ver Pontos de Referência <ExternalLink size={14} />
                </button>
              </div>
            </div>

            <div className="bg-green-600 text-white p-10 rounded-[40px] shadow-xl space-y-4">
              <h3 className="text-xl font-bold">Como Chegar?</h3>
              <p className="text-green-50 text-sm leading-relaxed opacity-90">
                A nossa sede localiza-se perto da Escola Secundária de Macuti. Se vier de transporte público, peça para descer na paragem do "Mercado de Macuti".
              </p>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-[48px] shadow-2xl border border-slate-100 h-[600px] overflow-hidden">
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
