import { X, Upload, Save, Handshake } from 'lucide-react';
import { AdminModal } from '../../admin';

/**
 * Partner creation modal.
 * Extracted from Admin.jsx lines 1964–2084.
 */
export default function PartnerModal({
  isOpen,
  onClose,
  newPartner,
  setNewPartner,
  addPartner
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem demasiado grande (max 2MB). Use uma imagem menor ou insira apenas o URL.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setNewPartner(p => ({ ...p, logo_data: ev.target.result, logo_url: '' }));
    reader.readAsDataURL(file);
  };

  const footer = (
    <>
      <button
        onClick={() => { onClose(); setNewPartner({ name: '', logo_url: '', logo_data: '' }); }}
        className="flex-grow btn-secondary py-2.5 text-xs font-bold"
      >
        Cancelar
      </button>
      <button
        onClick={addPartner}
        className="flex-grow btn-primary py-2.5 text-xs font-bold"
      >
        <Save size={16} /> Adicionar
      </button>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={() => { onClose(); setNewPartner({ name: '', logo_url: '', logo_data: '' }); }}
      title="Novo Parceiro"
      maxWidth="max-w-md"
      footer={footer}
    >
      <div className="p-6 space-y-4 flex-grow">
        <div className="space-y-1">
          <label className="form-label">Nome do Parceiro *</label>
          <input
            value={newPartner.name}
            onChange={e => setNewPartner(p => ({ ...p, name: e.target.value }))}
            className="form-input"
            placeholder="Ex: UNICEF Mocambique"
          />
        </div>

        <div className="space-y-2.5">
          <label className="form-label">Logo do Parceiro</label>

          {/* Upload local */}
          <div className="relative group cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
            />
            <div className="bg-brand-poloBlue/15 border border-dashed border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 hover:border-brand-primary transition-all">
              <Upload size={16} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
              <span className="text-xs text-brand-eastBay dark:text-dark-muted font-semibold">
                {newPartner.logo_data ? '✓ Ficheiro carregado' : 'Carregar do Computador'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <div className="flex-1 h-px bg-brand-poloBlue/20" />
            <span>ou</span>
            <div className="flex-1 h-px bg-brand-poloBlue/20" />
          </div>

          {/* URL externa */}
          <input
            value={newPartner.logo_url}
            onChange={e => setNewPartner(p => ({ ...p, logo_url: e.target.value, logo_data: '' }))}
            className="form-input text-xs"
            placeholder="Colar URL da logo (https://...)"
          />
          <p className="text-[10px] text-slate-400">Se nao tiver logo, o nome do parceiro sera exibido no rodape.</p>
        </div>

        {/* Preview */}
        {(newPartner.logo_data || newPartner.logo_url) && (
          <div className="bg-brand-bigStone dark:text-dark-text rounded-xl p-4 flex items-center gap-3">
            <img
              src={newPartner.logo_data || newPartner.logo_url}
              alt="Preview"
              className="h-8 max-w-[100px] object-contain filter grayscale brightness-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-white text-xs font-semibold">{newPartner.name || 'Parceiro'}</p>
              <p className="text-slate-400 text-[9px] mt-0.5">Pre-visualizacao no rodape</p>
            </div>
            <button
              onClick={() => setNewPartner(p => ({ ...p, logo_data: '', logo_url: '' }))}
              className="ml-auto text-slate-400 hover:text-feedback-error transition-colors"
              title="Remover logo"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </AdminModal>
  );
}
