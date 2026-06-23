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
  exportDonationsPDF,
  statusSelectClasses,
  updateDonationStatus
}) {
  const filtered = getFilteredDonations();
  const total = filtered.reduce((s, d) => s + (parseFloat(d.valor) || 0), 0);
  const byMethod = { 'M-Pesa': 0, 'Transferencia Bancaria': 0, 'Cartao': 0 };
  filtered.forEach(d => {
    if (byMethod[d.metodo_pagamento] !== undefined) byMethod[d.metodo_pagamento]++;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="card-surface p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2 text-brand-eastBay dark:text-dark-text font-bold text-sm mb-1 sm:mb-0">
            <Filter size={16} className="text-brand-horizon" />
            <span>Filtrar por periodo</span>
          </div>
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider mb-1.5 block">Data Inicio</label>
              <input
                type="date"
                value={donationFilterStart}
                onChange={e => setDonationFilterStart(e.target.value)}
                className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider mb-1.5 block">Data Fim</label>
              <input
                type="date"
                value={donationFilterEnd}
                onChange={e => setDonationFilterEnd(e.target.value)}
                className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            {(donationFilterStart || donationFilterEnd) && (
              <button
                onClick={() => { setDonationFilterStart(''); setDonationFilterEnd(''); }}
                className="px-3 py-1.5 text-xs font-semibold text-brand-eastBay dark:text-dark-muted hover:text-brand-eastBay dark:text-dark-text border border-slate-200 rounded-lg hover:bg-brand-poloBlue/15 transition-all self-end"
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
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Total Doadores</p>
            <p className="text-2xl font-bold text-brand-bigStone dark:text-dark-text mt-1">{filtered.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-poloBlue/20 text-brand-eastBay dark:text-dark-muted flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Valor Arrecadado</p>
            <p className="text-xl font-bold text-feedback-success mt-1">MT {total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-feedback-successLight text-feedback-success flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Via M-Pesa</p>
            <p className="text-2xl font-bold text-feedback-error mt-1">{byMethod['M-Pesa']}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-feedback-errorLight text-feedback-error flex items-center justify-center">
            <Heart size={18} />
          </div>
        </div>
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Transferencia</p>
            <p className="text-2xl font-bold text-feedback-success mt-1">{byMethod['Transferencia Bancaria']}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-feedback-successLight text-feedback-success flex items-center justify-center">
            <Handshake size={18} />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      {filtered.length === 0 ? (
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm rounded-3xl shadow-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 p-16 text-center">
          <Heart size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-brand-eastBay dark:text-dark-muted font-medium">Nenhuma doacao encontrada para este periodo.</p>
          <p className="text-brand-eastBay dark:text-dark-muted text-sm mt-1">As doacoes submetidas no formulario aparecem aqui automaticamente.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="px-6 py-4 bg-brand-poloBlue/50 dark:bg-dark-surface/80 border-b border-brand-poloBlue/20 dark:border-dark-muted/10 flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">
              {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-brand-eastBay dark:text-dark-muted font-medium">
              Total: <span className="font-bold text-feedback-success">MT {total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-poloBlue/50 dark:bg-dark-surface/80 border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider w-10 text-center">#</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Doador</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Causa</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Pagamento</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Data & Hora</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Mensagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-muted/10">
                {filtered.map((d, idx) => {
                  const donDate = d.created_at ? new Date(d.created_at) : null;
                  const isValidDate = donDate && !isNaN(donDate.getTime());
                  return (
                    <tr key={d.id} className="hover:bg-brand-poloBlue/10 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 text-xs text-brand-eastBay dark:text-dark-muted font-bold text-center">{filtered.length - idx}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-brand-bigStone dark:text-dark-text">{d.nome}</div>
                        <div className="text-xs text-brand-eastBay dark:text-dark-muted mt-0.5">{d.email}</div>
                      </td>
                      <td className="px-6 py-4 text-brand-eastBay dark:text-dark-muted text-sm font-medium">{d.telefone}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-brand-poloBlue/15 text-brand-eastBay text-[10px] font-bold rounded border border-brand-poloBlue/20 whitespace-nowrap">{d.causa}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-feedback-success whitespace-nowrap">
                        MT {parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${
                          d.metodo_pagamento === 'M-Pesa' ? 'bg-feedback-errorLight text-feedback-error border border-feedback-errorBorder' :
                          d.metodo_pagamento === 'Transferencia Bancaria' ? 'bg-feedback-successLight text-feedback-success border border-feedback-successBorder' :
                          'bg-brand-poloBlue/15 text-brand-eastBay dark:text-dark-muted border border-slate-200'
                        }`}>
                          {d.metodo_pagamento}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={d.status || 'Pendente'}
                          onChange={(e) => updateDonationStatus(d.id, e.target.value)}
                          className={statusSelectClasses(d.status || 'Pendente')}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em Analise">Em Analise</option>
                          <option value="Recebido">Recebido</option>
                          <option value="Nao Recebido">Nao Recebido</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {isValidDate ? (
                          <div className="font-medium">
                            <div className="text-sm text-brand-eastBay dark:text-dark-text">
                              {donDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                            <div className="text-xs text-brand-eastBay dark:text-dark-muted">
                              {donDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-brand-eastBay dark:text-dark-muted italic">Data nao registada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        {d.mensagem ? (
                          <p className="text-xs text-brand-eastBay dark:text-dark-muted truncate" title={d.mensagem}>{d.mensagem}</p>
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
