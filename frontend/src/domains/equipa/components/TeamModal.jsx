import { Upload, Save, UserCircle } from 'lucide-react';
import { AdminModal } from '../../admin';
import { compressImage, readFileAsDataURL } from '../../../shared/utils/imageUtils';

/**
 * Team member create/edit modal.
 * Extracted from Admin.jsx lines 2087–2229.
 */
export default function TeamModal({
  isOpen,
  onClose,
  editingTeamMember,
  newTeamMember,
  setNewTeamMember,
  addOrUpdateTeamMember
}) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem demasiado grande (max 5MB). Use uma menor ou insira apenas o URL.');
      return;
    }

    const compressed = await compressImage(file, 800, 0.6);
    if (compressed) {
      setNewTeamMember(p => ({ ...p, photo_data: compressed, photo_url: '' }));
    } else {
      try {
        const base64 = await readFileAsDataURL(file);
        setNewTeamMember(p => ({ ...p, photo_data: base64, photo_url: '' }));
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="flex-grow btn-secondary py-2.5 text-xs font-bold"
      >
        Cancelar
      </button>
      <button
        onClick={addOrUpdateTeamMember}
        className="flex-grow btn-primary py-2.5 text-xs font-bold"
      >
        <Save size={16} /> Guardar
      </button>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTeamMember ? 'Editar Membro' : 'Novo Membro da Equipa'}
      footer={footer}
    >
      <div className="p-6 space-y-4 flex-grow overflow-y-auto max-h-[60vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="form-label">Nome Completo *</label>
            <input
              value={newTeamMember.name}
              onChange={e => setNewTeamMember(p => ({ ...p, name: e.target.value }))}
              className="form-input"
              placeholder="Ex: Joao Silva"
            />
          </div>
          <div className="space-y-1">
            <label className="form-label">Cargo / Funcao *</label>
            <input
              value={newTeamMember.role}
              onChange={e => setNewTeamMember(p => ({ ...p, role: e.target.value }))}
              className="form-input"
              placeholder="Ex: Psicologo Clinico"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="form-label">Informacoes (Biografia)</label>
          <textarea
            value={newTeamMember.bio}
            onChange={e => setNewTeamMember(p => ({ ...p, bio: e.target.value }))}
            className="form-input min-h-[100px] resize-none leading-relaxed"
            placeholder="Escreva um breve resumo..."
          />
        </div>

        <div className="space-y-2">
          <label className="form-label">Fotografia</label>

          <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-white shrink-0 overflow-hidden border border-slate-200/80 flex items-center justify-center shadow-sm">
              {(newTeamMember.photo_data || newTeamMember.photo_url) ? (
                <img src={newTeamMember.photo_data || newTeamMember.photo_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={28} className="text-slate-400" />
              )}
            </div>

            <div className="flex-grow space-y-2">
              {/* Upload local */}
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-brand-primary transition-all">
                  <Upload size={14} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
                  <span className="text-xs text-slate-500 font-semibold">
                    {newTeamMember.photo_data ? '✓ Foto carregada' : 'Carregar do Computador'}
                  </span>
                </div>
              </div>

              {/* URL externa */}
              <input
                value={newTeamMember.photo_url}
                onChange={e => setNewTeamMember(p => ({ ...p, photo_url: e.target.value, photo_data: '' }))}
                className="form-input text-xs py-1.5"
                placeholder="Ou colar URL da foto"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
