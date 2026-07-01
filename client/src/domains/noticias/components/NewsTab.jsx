import { Plus, Newspaper, Calendar, Pencil, Trash2 } from 'lucide-react';

export default function NewsTab({ newsList, openNew, openEdit, handleDelete }) {
  const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '—';
    return dt.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      {/* Add button */}
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5 cursor-pointer">
          <Plus size={18} /> Novo Objetivo Geral (Noticia)
        </button>
      </div>

      {/* Cards Grid */}
      {newsList.length === 0 ? (
        <div className="text-center py-20 text-brand-eastBay dark:text-dark-muted">
          <Newspaper className="mx-auto mb-4 opacity-30" size={48} />
          <p className="text-sm">Nenhuma noticia registada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-brand-poloBlue/10 dark:border-dark-muted/10 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {(item.capa_url || item.capa_data) && (
                  <div className="aspect-video overflow-hidden bg-brand-poloBlue/5">
                    <img
                      src={item.capa_data || item.capa_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-brand-eastBay dark:text-dark-muted">
                    <Calendar size={12} className="text-brand-horizon" />
                    {fmtDate(item.news_date)}
                  </div>
                  <h3 className="font-bold text-sm text-brand-bigStone dark:text-dark-text line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-eastBay dark:text-dark-muted line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="flex items-center gap-2 pt-3 border-t border-brand-poloBlue/10 dark:border-dark-muted/10">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-horizon hover:text-brand-bigStone transition-colors cursor-pointer"
                  >
                    <Pencil size={13} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-feedback-error hover:text-red-700 transition-colors ml-auto cursor-pointer"
                  >
                    <Trash2 size={13} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
