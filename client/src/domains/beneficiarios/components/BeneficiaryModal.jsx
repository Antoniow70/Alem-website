import { Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { AdminModal } from '../../admin';
import { compressImage, readFileAsDataURL } from '../../../shared/utils/imageUtils';

/**
 * Beneficiary story create/edit modal.
 * Extracted from Admin.jsx lines 2777–2939.
 */
export default function BeneficiaryModal({
  isOpen,
  onClose,
  projects,
  editingBeneficiary,
  beneficiaryForm,
  onBeneficiarySubmit
}) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = beneficiaryForm;
  
  const imageData = watch('image_data');
  const imageUrl = watch('image_url');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem demasiado grande (max 5MB). Use uma menor.');
      return;
    }
    
    const compressed = await compressImage(file, 800, 0.6);
    if (compressed) {
      setValue('image_data', compressed);
      setValue('image_url', '');
    } else {
      try {
        const base64 = await readFileAsDataURL(file);
        setValue('image_data', base64);
        setValue('image_url', '');
      } catch (err) {
        console.error('Error reading image file:', err);
      }
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 btn-secondary py-2.5 text-xs font-bold"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="flex-1 btn-primary py-2.5 text-xs font-bold"
      >
        <Save size={16} /> Guardar Historia
      </button>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBeneficiary ? 'Editar Historia de Beneficiario' : 'Registar Historia de Beneficiario'}
    >
      <form onSubmit={handleSubmit(onBeneficiarySubmit)} className="p-6 space-y-5 overflow-y-auto flex-grow max-h-[70vh]">
        <div className="space-y-1">
          <label className="form-label">Nome do Beneficiario *</label>
          <input
            {...register('full_name')}
            className="form-input"
            placeholder="Nome completo do beneficiario"
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="form-label">Projeto de Intervencao *</label>
          <select
            {...register('project_id')}
            className="form-input cursor-pointer font-semibold text-slate-900"
          >
            <option value="">Selecione um projeto...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="form-label">Historia de Superacao / Impacto *</label>
          <textarea
            {...register('story')}
            rows={6}
            className="form-input resize-y min-h-[120px] leading-relaxed"
            placeholder="Descreva a historia do beneficiario, o apoio recebido e o impacto gerado..."
          />
          {errors.story && <p className="text-red-500 text-xs mt-1">{errors.story.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="form-label">Imagem Ilustrativa</label>
          <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
            <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
              {(imageData || imageUrl) ? (
                <img src={imageData || imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={24} className="text-slate-400" />
              )}
            </div>

            <div className="flex-grow space-y-2.5">
              {/* Upload local */}
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 group-hover:border-brand-primary transition-all">
                  <Upload size={14} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
                  <span className="text-xs text-slate-500 font-semibold">
                    {imageData ? '✓ Imagem carregada' : 'Carregar do Computador'}
                  </span>
                </div>
              </div>

              {/* URL externa */}
              <input
                {...register('image_url')}
                className="form-input text-xs py-1.5"
                placeholder="Ou colar URL externa da imagem"
                onChange={e => {
                  if (e.target.value) {
                    setValue('image_data', '');
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-slate-100 flex gap-3">
          {footer}
        </div>
      </form>
    </AdminModal>
  );
}
