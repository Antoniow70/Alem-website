import { Mail, Eye, Trash2, Download, Calendar, CheckCircle } from 'lucide-react';

/**
 * Support requests table tab with filters and stats.
 * Extracted from Admin.jsx lines 1391–1611.
 */
export default function SupportTab({
  messages,
  statusSelectClasses,
  supportSearch,
  setSupportSearch,
  supportReadFilter,
  setSupportReadFilter,
  supportFilterStart,
  setSupportFilterStart,
  supportFilterEnd,
  setSupportFilterEnd,
  getFilteredMessages,
  updateMessageStatus,
  updateMessageReadStatus,
  openMessage,
  deleteMessage,
  exportSupportPDF
}) {
  const filtered = getFilteredMessages();
  const pendentes = filtered.filter(m => m.status === 'Pendente').length;
  const emAnalise = filtered.filter(m => m.status === 'Em Analise').length;
  const aprovados = filtered.filter(m => m.status === 'Aprovado').length;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="card-surface p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1 w-full max-w-xs">
            <label className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider mb-1.5">Pesquisar</label>
            <input
              type="text"
              value={supportSearch}
              onChange={e => setSupportSearch(e.target.value)}
              placeholder="Nome, email ou data..."
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text placeholder-slate-400 dark:placeholder-dark-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider mb-1.5">Leitura</label>
            <select
              value={supportReadFilter}
              onChange={e => setSupportReadFilter(e.target.value)}
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all cursor-pointer"
            >
              <option value="Todos">Todos</option>
              <option value="Lidos">Lidos</option>
              <option value="Nao Lidos">Nao Lidos</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider mb-1.5">Data Inicio</label>
            <input
              type="date"
              value={supportFilterStart}
              onChange={e => setSupportFilterStart(e.target.value)}
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider mb-1.5">Data Fim</label>
            <input
              type="date"
              value={supportFilterEnd}
              onChange={e => setSupportFilterEnd(e.target.value)}
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
          {(supportSearch || supportFilterStart || supportFilterEnd || supportReadFilter !== 'Todos') && (
            <button
              onClick={() => { setSupportSearch(''); setSupportFilterStart(''); setSupportFilterEnd(''); setSupportReadFilter('Todos'); }}
              className="px-3 py-1.5 text-xs font-semibold text-brand-eastBay dark:text-dark-muted hover:text-brand-eastBay dark:text-dark-text border border-slate-200 dark:border-dark-muted/25 rounded-lg hover:bg-brand-poloBlue/15 transition-all"
            >
              Limpar
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={exportSupportPDF}
              className="btn-primary py-2.5 px-4 text-xs"
            >
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Total Pedidos</p>
            <p className="text-2xl font-bold text-brand-bigStone dark:text-dark-text mt-1">{filtered.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-poloBlue/20 text-brand-eastBay dark:text-dark-muted flex items-center justify-center">
            <Mail size={18} />
          </div>
        </div>
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Pendentes</p>
            <p className="text-2xl font-bold text-feedback-warning mt-1">{pendentes}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-feedback-warningLight text-feedback-warning flex items-center justify-center">
            <Calendar size={18} />
          </div>
        </div>
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Em Analise</p>
            <p className="text-2xl font-bold text-brand-horizon mt-1">{emAnalise}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-poloBlue/15 text-brand-horizon flex items-center justify-center">
            <Eye size={18} />
          </div>
        </div>
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Aprovados</p>
            <p className="text-2xl font-bold text-feedback-success mt-1">{aprovados}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-feedback-successLight text-feedback-success flex items-center justify-center">
            <CheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm rounded-3xl shadow-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 p-16 text-center">
          <Mail size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-brand-eastBay dark:text-dark-muted font-medium">Nenhum pedido de apoio encontrado.</p>
          <p className="text-brand-eastBay dark:text-dark-muted text-sm mt-1">Os pedidos submetidos no formulario aparecem aqui automaticamente.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="px-6 py-4 bg-brand-poloBlue/50 dark:bg-dark-surface/80 border-b border-brand-poloBlue/20 dark:border-dark-muted/10 flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">
              {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs font-semibold text-brand-eastBay dark:text-dark-muted bg-brand-poloBlue/20 dark:bg-white/10 px-2 py-1 rounded">
              {filtered.filter(m => m.read_status !== 'Lido').length} nao lido(s)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-poloBlue/50 dark:bg-dark-surface/80 border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider w-16">Leitura</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Nome / Info</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Tipo de Apoio</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider">Data Inscricao</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-eastBay dark:text-dark-muted uppercase tracking-wider text-right pr-8">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-muted/10">
                {filtered.map((msg) => {
                  const msgDate = msg.created_at ? new Date(msg.created_at) : null;
                  const isValidDate = msgDate && !isNaN(msgDate.getTime());
                  const isUnread = msg.read_status !== 'Lido';
                  return (
                    <tr key={msg.id} className={`hover:bg-brand-poloBlue/10 dark:hover:bg-white/5 transition-colors group ${isUnread ? 'bg-brand-poloBlue/20 dark:bg-brand-poloBlue/5' : ''}`}>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => updateMessageReadStatus(msg.id, isUnread ? 'Lido' : 'Nao Lido')}
                          className={`p-1.5 rounded-lg transition-all ${isUnread ? 'text-brand-horizon hover:text-brand-eastBay bg-brand-poloBlue/80' : 'text-slate-400 hover:text-brand-eastBay dark:text-dark-muted hover:bg-brand-poloBlue/20'}`}
                          title={isUnread ? 'Marcar como Lido' : 'Marcar como Nao Lido'}
                        >
                          <Mail size={16} className={isUnread ? 'fill-current' : ''} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-semibold text-brand-bigStone dark:text-dark-text ${isUnread ? 'font-bold' : ''}`}>{msg.name}</div>
                        <div className="text-xs text-brand-eastBay dark:text-dark-muted mt-0.5">{msg.email} {msg.phone ? '• ' + msg.phone : ''}</div>
                      </td>
                      <td className="px-6 py-4 text-brand-eastBay dark:text-dark-text font-medium text-sm">{msg.subject}</td>
                      <td className="px-6 py-4">
                        <select
                          value={msg.status}
                          onChange={(e) => updateMessageStatus(msg.id, e.target.value)}
                          className={statusSelectClasses(msg.status)}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em Analise">Em Analise</option>
                          <option value="Aprovado">Aprovado</option>
                          <option value="Recusado">Recusado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {isValidDate ? (
                          <div>
                            <div className="text-sm font-semibold text-brand-eastBay dark:text-dark-text">
                              {msgDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                            <div className="text-xs text-brand-eastBay dark:text-dark-muted">
                              {msgDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-brand-eastBay dark:text-dark-muted italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openMessage(msg)}
                            className="p-2 bg-brand-poloBlue/15 hover:bg-brand-horizon text-brand-horizon hover:text-white rounded-lg transition-all"
                            title="Ver Detalhes"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              deleteMessage(msg.id);
                            }}
                            className="p-2 bg-feedback-errorLight hover:bg-feedback-error text-feedback-error hover:text-white rounded-lg transition-all"
                            title="Eliminar Pedido"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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
