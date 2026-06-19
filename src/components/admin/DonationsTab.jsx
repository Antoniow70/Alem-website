import { Filter, TrendingUp, Download, Users, Heart, Handshake } from 'lucide-react';

/**
 * Donations history and statistics tab.
 * Extracted from Admin.jsx lines 1695–1888.
 */
export default function DonationsTab({
  donations,
  donationFilterStart,
  setDonationFilterStart,
  donationFilterEnd,
  setDonationFilterEnd,
  getFilteredDonations,
  fetchData,
  exportDonationsPDF
}) {
  const filtered = getFilteredDonations();
  const total = filtered.reduce((s, d) => s + (parseFloat(d.valor) || 0), 0);
  const byMethod = { mpesa: 0, transferencia: 0, cartao: 0 };
  filtered.forEach(d => {
    if (byMethod[d.metodo_pagamento] !== undefined) byMethod[d.metodo_pagamento]++;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="card-surface p-5 bg-white">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-1 sm:mb-0">
            <Filter size={16} className="text-blue-600" />
            <span>Filtrar por periodo</span>
          </div>
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Data Inicio</label>
              <input
                type="date"
                value={donationFilterStart}
                onChange={e => setDonationFilterStart(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Data Fim</label>
              <input
                type="date"
                value={donationFilterEnd}
                onChange={e => setDonationFilterEnd(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            {(donationFilterStart || donationFilterEnd) && (
              <button
                onClick={() => { setDonationFilterStart(''); setDonationFilterEnd(''); }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all self-end"
              >
                Limpar
              </button>
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={fetchData}
              className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
              title="Atualizar lista de doadores"
            >
              <TrendingUp size={14} /> Atualizar
            </button>
            <button
              onClick={exportDonationsPDF}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Doadores</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{filtered.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor Arrecadado</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">MT {total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Via M-Pesa</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{byMethod.mpesa}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart size={18} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transferencia</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{byMethod.transferencia}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <Handshake size={18} />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
          <Heart size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhuma doacao encontrada para este periodo.</p>
          <p className="text-slate-400 text-sm mt-1">As doacoes submetidas no formulario aparecem aqui automaticamente.</p>
        </div>
      ) : (
        <div className="card-surface bg-white overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Total: <span className="font-bold text-emerald-700">MT {total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider w-10 text-center">#</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Doador</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Causa</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Pagamento</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Data & Hora</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Mensagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d, idx) => {
                  const donDate = d.created_at ? new Date(d.created_at) : null;
                  const isValidDate = donDate && !isNaN(donDate.getTime());
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-4 text-xs text-slate-400 font-bold text-center">{filtered.length - idx}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{d.nome}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{d.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">{d.telefone}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100 whitespace-nowrap">{d.causa}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700 whitespace-nowrap">
                        MT {parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${
                          d.metodo_pagamento === 'mpesa' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          d.metodo_pagamento === 'transferencia' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          {d.metodo_pagamento === 'mpesa' ? 'M-Pesa' : d.metodo_pagamento === 'transferencia' ? 'Transferencia' : 'Cartao'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isValidDate ? (
                          <div className="font-medium">
                            <div className="text-sm text-slate-700">
                              {donDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                            <div className="text-xs text-slate-400">
                              {donDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Data nao registada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        {d.mensagem ? (
                          <p className="text-xs text-slate-500 truncate" title={d.mensagem}>{d.mensagem}</p>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
