import { Trash2, Handshake } from 'lucide-react';

/**
 * Partners management tab.
 * Extracted from Admin.jsx lines 1613–1649.
 */
export default function PartnersTab({ partners, deletePartner }) {
  return (
    <div className="space-y-6">
      {partners.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
          <Handshake size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhum parceiro registado ainda.</p>
          <p className="text-slate-400 text-sm mt-1">Clique em "Novo Parceiro" para adicionar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <div key={partner.id} className="card-surface p-4 flex items-center gap-4 group relative bg-white">
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-full h-full object-contain p-1 filter grayscale hover:grayscale-0 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Handshake size={20} className="text-slate-450" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate">{partner.name}</h3>
                {partner.logo_url && (
                  <p className="text-slate-400 text-[10px] truncate mt-0.5">{partner.logo_url}</p>
                )}
              </div>
              <button
                onClick={() => deletePartner(partner.id)}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all shrink-0 ml-auto"
                title="Remover parceiro"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
