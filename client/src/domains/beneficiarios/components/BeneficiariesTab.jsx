import { Plus, Pencil, Trash2, Heart } from 'lucide-react';

/**
 * Beneficiaries stories management tab.
 * Extracted from Admin.jsx lines 1889–1961.
 */
export default function BeneficiariesTab({
  beneficiaries,
  projects,
  openBeneficiaryEdit,
  deleteBeneficiary,
  onCreateNew
}) {
  return (
    <div className="space-y-6">
      <div className="card-surface p-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-brand-poloBlue/15 dark:bg-white/10 text-brand-eastBay dark:text-white border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-lg text-xs font-semibold">
            Total: {beneficiaries.length} Historias
          </span>
        </div>
        <button
          onClick={onCreateNew}
          className="btn-primary py-2.5 px-4 text-xs font-bold"
        >
          <Plus size={16} /> Criar Historia
        </button>
      </div>

      {beneficiaries.length === 0 ? (
        <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm rounded-3xl shadow-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 p-16 text-center">
          <Heart size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-brand-eastBay dark:text-dark-muted font-medium">Nenhuma historia de beneficiario registada.</p>
          <p className="text-slate-400 text-sm mt-1">Adicione uma historia de superacao para inspirar outros doadores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map(story => {
            const project = projects.find(p => p.id === story.project_id);
            const storyImage = story.image_data || story.image_url || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
            return (
              <div key={story.id} className="card-surface flex flex-col overflow-hidden group">
                <div className="h-44 w-full bg-brand-poloBlue/15 dark:bg-dark-bg/40 overflow-hidden relative shrink-0">
                  <img
                    src={storyImage}
                    alt={story.full_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-horizon dark:text-white shadow-sm border border-brand-poloBlue/20 dark:border-dark-muted/10">
                    {project ? project.name : 'Geral'}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-brand-eastBay dark:text-dark-text text-base mb-2">{story.full_name}</h3>
                  <p className="text-xs text-brand-eastBay dark:text-dark-muted leading-relaxed line-clamp-4 flex-grow whitespace-pre-wrap">{story.story}</p>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-brand-poloBlue/20 dark:border-dark-muted/10 shrink-0">
                    <button
                      onClick={() => openBeneficiaryEdit(story)}
                      className="flex-grow btn-secondary py-2 text-xs font-bold"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => deleteBeneficiary(story.id)}
                      className="p-2 text-feedback-error hover:bg-feedback-errorLight rounded-lg transition-colors border border-feedback-errorBorder hover:border-feedback-errorBorder"
                      title="Eliminar Historia"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
