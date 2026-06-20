import { Eye, Trash2, Mail, Download } from 'lucide-react';

/**
 * Volunteers table tab with filters. Extracted from Admin.jsx lines 1259–1390.
 */
export default function VolunteersTab({
  volunteers, projects, statusSelectClasses,
  volunteerSearch, setVolunteerSearch,
  volunteerReadFilter, setVolunteerReadFilter,
  volunteerFilterStart, setVolunteerFilterStart,
  volunteerFilterEnd, setVolunteerFilterEnd,
  getFilteredVolunteers, updateVolunteerStatus, updateVolunteerReadStatus,
  openVolunteerEdit, deleteVolunteer, exportVolunteersPDF
}) {
  return (
    <div className="space-y-6">
      <div className="card-surface p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1 w-full max-w-xs">
            <label className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider mb-1.5">Pesquisar</label>
            <input
              type="text"
              value={volunteerSearch}
              onChange={e => setVolunteerSearch(e.target.value)}
              placeholder="Nome, email ou data..."
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text placeholder-slate-400 dark:placeholder-dark-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider mb-1.5">Leitura</label>
            <select
              value={volunteerReadFilter}
              onChange={e => setVolunteerReadFilter(e.target.value)}
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all cursor-pointer"
            >
              <option value="Todos">Todos</option>
              <option value="Lidos">Lidos</option>
              <option value="Nao Lidos">Nao Lidos</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider mb-1.5">Data Inicio</label>
            <input
              type="date"
              value={volunteerFilterStart}
              onChange={e => setVolunteerFilterStart(e.target.value)}
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider mb-1.5">Data Fim</label>
            <input
              type="date"
              value={volunteerFilterEnd}
              onChange={e => setVolunteerFilterEnd(e.target.value)}
              className="bg-brand-poloBlue/15 border border-slate-200 dark:border-dark-muted/20 rounded-lg px-3 py-1.5 text-xs text-brand-bigStone dark:text-dark-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
          {(volunteerSearch || volunteerFilterStart || volunteerFilterEnd || volunteerReadFilter !== 'Todos') && (
            <button
              onClick={() => { setVolunteerSearch(''); setVolunteerFilterStart(''); setVolunteerFilterEnd(''); setVolunteerReadFilter('Todos'); }}
              className="px-3 py-1.5 text-xs font-semibold text-brand-eastBay dark:text-dark-muted hover:text-brand-eastBay dark:text-dark-text border border-slate-200 dark:border-dark-muted/25 rounded-lg hover:bg-brand-poloBlue/15 transition-all"
            >
              Limpar
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={exportVolunteersPDF}
              className="btn-primary py-2.5 px-4 text-xs"
            >
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="px-6 py-4 bg-brand-poloBlue/50 dark:bg-dark-surface/80 border-b border-brand-poloBlue/20 dark:border-dark-muted/10 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">
            {getFilteredVolunteers().length} registo(s) encontrado(s)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-brand-poloBlue/50 dark:bg-dark-surface/80 border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider w-16">Leitura</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Nome / Info</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Atividade de Interesse</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Estado (Aprovacao)</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider">Data</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider text-right pr-8">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-muted/10">
              {getFilteredVolunteers().map((vol) => (
                <tr key={vol.id} className={`hover:bg-brand-poloBlue/10 dark:hover:bg-white/5 transition-colors group ${vol.read_status !== 'Lido' ? 'bg-brand-poloBlue/20 dark:bg-brand-poloBlue/5' : ''}`}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => updateVolunteerReadStatus(vol.id, vol.read_status === 'Lido' ? 'Nao Lido' : 'Lido')}
                      className={`p-1.5 rounded-lg transition-all ${vol.read_status === 'Lido' ? 'text-slate-400 hover:text-brand-eastBay dark:text-dark-muted hover:bg-brand-poloBlue/20 dark:hover:bg-white/10' : 'text-brand-horizon hover:text-brand-eastBay bg-brand-poloBlue/80'}`}
                      title={vol.read_status === 'Lido' ? 'Marcar como Nao Lido' : 'Marcar como Lido'}
                    >
                      <Mail size={16} className={vol.read_status !== 'Lido' ? 'fill-current' : ''} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-semibold text-brand-bigStone dark:text-dark-text ${vol.read_status !== 'Lido' ? 'font-bold' : ''}`}>{vol.full_name}</div>
                    <div className="text-xs text-brand-eastBay dark:text-dark-muted mt-0.5">{vol.email} • {vol.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-brand-eastBay dark:text-dark-muted text-sm font-medium">
                    {vol.activities?.name || 'Nenhuma'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={vol.status}
                      onChange={(e) => updateVolunteerStatus(vol.id, e.target.value)}
                      className={statusSelectClasses(vol.status)}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Analise">Em Analise</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Recusado">Recusado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs text-brand-eastBay dark:text-dark-muted font-medium">
                    {vol.created_at ? new Date(vol.created_at).toLocaleDateString('pt-PT') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right pr-8">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openVolunteerEdit(vol)}
                        className="p-2 bg-brand-poloBlue/15 hover:bg-brand-horizon text-brand-horizon hover:text-white rounded-lg transition-all"
                        title="Visualizar Candidatura"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => deleteVolunteer(vol.id)}
                        className="p-2 bg-feedback-errorLight hover:bg-feedback-error text-feedback-error hover:text-white rounded-lg transition-all"
                        title="Remover Candidatura"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
