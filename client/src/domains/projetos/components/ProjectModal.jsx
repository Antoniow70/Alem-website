import { Plus, Upload, X, Save, Loader2 } from 'lucide-react';
import AdminModal from '../../admin/components/AdminModal';

/**
 * Project create/edit modal. Extracted from Admin.jsx lines 2414–2651.
 */
export default function ProjectModal({
  isOpen, onClose, editingProject, projectForm, galleryFields, appendGallery, removeGallery,
  selectedFile, setSelectedFile, uploadPreview, setUploadPreview,
  isUploading, isGalleryUploading, handleGalleryFiles, team, activities = [], pillars = [], onSubmit
}) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? 'Editar Projeto' : 'Novo Projeto'}
    >
      <form onSubmit={projectForm.handleSubmit(onSubmit, (errs) => console.error('Form validation errors:', errs))} className="p-6 space-y-5 overflow-y-auto flex-grow">
        <div className="space-y-1">
          <label className="form-label">Nome do projeto</label>
          <input
            {...projectForm.register('name')}
            className="form-input"
            placeholder="Nome do projeto..."
          />
          {projectForm.formState.errors.name && <p className="text-feedback-error text-xs mt-1">{projectForm.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="form-label">Objetivos Especificos</label>
          <textarea
            {...projectForm.register('objetivos_especificos')}
            rows={4}
            className="form-input resize-y min-h-[100px] leading-relaxed"
            placeholder="Detalhes dos objetivos..."
          />
          {projectForm.formState.errors.objetivos_especificos && <p className="text-feedback-error text-xs mt-1">{projectForm.formState.errors.objetivos_especificos.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="form-label">Equipa Responsavel</label>
          <div className="relative group cursor-pointer border border-slate-200 rounded-xl bg-brand-poloBlue/15 max-h-32 overflow-y-auto p-3.5 custom-scrollbar">
            {team.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum membro registado. Adicione na aba Equipa.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {team.map(member => (
                  <label key={member.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={member.id}
                      {...projectForm.register('equipa_responsavel')}
                      className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-brand-eastBay dark:text-dark-text">{member.name} ({member.role})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {projectForm.formState.errors.equipa_responsavel && (
            <p className="text-feedback-error text-xs mt-1">{projectForm.formState.errors.equipa_responsavel.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="form-label">Estado</label>
          <select
            {...projectForm.register('status')}
            className="form-input cursor-pointer font-semibold text-brand-bigStone dark:text-dark-text"
          >
            <option value="Planeamento">Planeamento</option>
            <option value="Em Curso">Em Curso</option>
            <option value="Concluido">Concluido</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="form-label">Pilar Associado</label>
          <select
            {...projectForm.register('pillar_id')}
            className="form-input cursor-pointer font-semibold text-brand-bigStone dark:text-dark-text"
          >
            <option value="">Selecionar um pilar...</option>
            {pillars.map((pillar) => (
              <option key={pillar.id} value={pillar.id}>
                {pillar.name}
              </option>
            ))}
          </select>
          {projectForm.formState.errors.pillar_id && (
            <p className="text-feedback-error text-xs mt-1">
              {projectForm.formState.errors.pillar_id.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="form-label">Atividades Associadas</label>
          <div className="relative group cursor-pointer border border-slate-200 rounded-xl bg-brand-poloBlue/15 max-h-32 overflow-y-auto p-3.5 custom-scrollbar">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhuma atividade cadastrada.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {activities.map(act => (
                  <label key={act.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={act.id}
                      {...projectForm.register('associated_activities')}
                      className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-brand-eastBay dark:text-dark-text">{act.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {projectForm.formState.errors.associated_activities && (
            <p className="text-feedback-error text-xs mt-1">
              {projectForm.formState.errors.associated_activities.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="form-label">Capa do Projeto (Imagem)</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setUploadPreview(URL.createObjectURL(file));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="bg-brand-poloBlue/15 border border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center gap-2 group-hover:border-brand-primary group-hover:bg-brand-poloBlue/50 transition-all">
                <Upload className="text-slate-400 group-hover:text-brand-primary" size={20} />
                <span className="text-xs font-semibold text-brand-eastBay dark:text-dark-muted text-center">
                  {selectedFile ? selectedFile.name : 'Escolher Ficheiro'}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...projectForm.register('capa_url')}
                className="form-input"
                placeholder="Ou colar URL da imagem..."
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedFile(null);
                    setUploadPreview(e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {uploadPreview && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 aspect-video bg-brand-poloBlue/15 relative max-w-sm mx-auto shadow-sm">
              <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setUploadPreview(null); projectForm.setValue('capa_url', ''); }}
                className="absolute top-2 right-2 bg-feedback-error text-white p-1.5 rounded-full shadow hover:bg-feedback-error transition-all duration-200"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2 border-t border-brand-poloBlue/20">
          <label className="form-label text-brand-primary">Imagens ou videos do projeto</label>
          <div className="space-y-3">
            {galleryFields.map((field, index) => (
              <div key={field.id} className="bg-brand-poloBlue/50 p-4 rounded-xl border border-slate-200/60 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeGallery(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-feedback-error transition-colors"
                >
                  <X size={14} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tipo</label>
                    <select
                      {...projectForm.register(`gallery.${index}.type`)}
                      className="form-input py-1.5 px-3 text-xs font-semibold cursor-pointer"
                    >
                      <option value="image">Imagem</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">URL / Link</label>
                    <input
                      {...projectForm.register(`gallery.${index}.url`)}
                      className="form-input py-1.5 px-3 text-xs"
                      placeholder="URL da imagem ou video"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descricao (Opcional)</label>
                  <input
                    {...projectForm.register(`gallery.${index}.description`)}
                    className="form-input py-1.5 px-3 text-xs"
                    placeholder="Legenda da media..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendGallery({ type: 'image', url: '', description: '' })}
              className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-brand-eastBay dark:text-dark-muted hover:text-brand-primary hover:border-brand-primary hover:bg-brand-poloBlue/15 transition-all flex items-center justify-center gap-2 font-semibold text-xs"
            >
              <Plus size={16} /> Adicionar imagem ou video do projeto
            </button>

            <div className="relative group">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleGalleryFiles}
                disabled={isGalleryUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button
                type="button"
                disabled={isGalleryUploading}
                className="w-full py-2.5 bg-brand-poloBlue/20 hover:bg-slate-200 text-brand-eastBay dark:text-dark-text rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGalleryUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                Carregar Multiplos Ficheiros (Imagens/Videos)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-brand-poloBlue/20 flex gap-3">
          <button
            type="button"
            onClick={() => { onClose(); setSelectedFile(null); setUploadPreview(null); }}
            className="flex-1 btn-secondary py-2.5 text-xs font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 btn-primary py-2.5 text-xs font-bold"
          >
            {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {editingProject ? 'Guardar Alteracoes' : 'Criar Projeto'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
