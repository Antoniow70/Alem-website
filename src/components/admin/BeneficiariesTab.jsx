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
      <div className="card-surface p-4 bg-white flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
          <Heart size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhuma historia de beneficiario registada.</p>
          <p className="text-slate-400 text-sm mt-1">Adicione uma historia de superacao para inspirar outros doadores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map(story => {
            const project = projects.find(p => p.id === story.project_id);
            const storyImage = story.image_data || story.image_url || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
            return (
              <div key={story.id} className="card-surface flex flex-col overflow-hidden group">
                <div className="h-44 w-full bg-slate-50 overflow-hidden relative shrink-0">
                  <img
                    src={storyImage}
                    alt={story.full_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm border border-slate-100">
                    {project ? project.name : 'Geral'}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-base mb-2">{story.full_name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 flex-grow whitespace-pre-wrap">{story.story}</p>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 shrink-0">
                    <button
                      onClick={() => openBeneficiaryEdit(story)}
                      className="flex-grow btn-secondary py-2 text-xs font-bold"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => deleteBeneficiary(story.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 hover:border-red-200"
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
