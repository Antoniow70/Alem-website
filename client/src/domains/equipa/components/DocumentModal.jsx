import { Upload, Save, FileText } from 'lucide-react';
import AdminModal from '../../admin/components/AdminModal';

export default function DocumentModal({
  isOpen,
  onClose,
  editingDocument,
  newDocument,
  setNewDocument,
  selectedFile,
  setSelectedFile,
  addOrUpdateDocument,
  isUploading
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Ficheiro demasiado grande (maximo 10MB).');
      return;
    }
    setSelectedFile(file);
    setNewDocument(prev => ({ ...prev, file_data: '', file_url: '' }));
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={isUploading}
        className="flex-grow btn-secondary py-2.5 text-xs font-bold disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        onClick={addOrUpdateDocument}
        disabled={isUploading}
        className="flex-grow btn-primary py-2.5 text-xs font-bold disabled:opacity-50"
      >
        {isUploading ? 'A carregar...' : <><Save size={16} /> Guardar</>}
      </button>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDocument ? 'Editar Documento' : 'Novo Documento Institucional'}
      footer={footer}
    >
      <div className="p-6 space-y-4 flex-grow overflow-y-auto max-h-[60vh]">
        <div className="space-y-1">
          <label className="form-label">Titulo do Documento *</label>
          <input
            value={newDocument.title || ''}
            onChange={e => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
            className="form-input"
            placeholder="Ex: Estatuto da Associacao"
          />
        </div>

        <div className="space-y-1">
          <label className="form-label">Descricao / Resumo</label>
          <textarea
            value={newDocument.description || ''}
            onChange={e => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
            className="form-input min-h-[100px] resize-none leading-relaxed"
            placeholder="Breve descricao do conteudo do documento..."
          />
        </div>

        <div className="space-y-2">
          <label className="form-label">Ficheiro (PDF, Word, Imagem)</label>

          <div className="flex gap-4 items-center bg-brand-poloBlue/15 p-4 rounded-xl border border-brand-poloBlue/20">
            <div className="w-12 h-12 rounded-xl bg-white shrink-0 border border-slate-200/80 flex items-center justify-center shadow-sm text-brand-horizon">
              <FileText size={24} />
            </div>

            <div className="flex-grow space-y-2">
              {/* Local File Upload */}
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-brand-primary transition-all">
                  <Upload size={14} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
                  <span className="text-xs text-brand-eastBay dark:text-dark-muted font-semibold truncate">
                    {selectedFile ? `✓ ${selectedFile.name}` : newDocument.file_url ? '✓ Ficheiro no Servidor' : 'Carregar do Computador'}
                  </span>
                </div>
              </div>

              {/* External URL alternative */}
              <input
                value={newDocument.file_url || ''}
                onChange={e => {
                  setSelectedFile(null);
                  setNewDocument(prev => ({ ...prev, file_url: e.target.value, file_data: '' }));
                }}
                className="form-input text-xs py-1.5"
                placeholder="Ou colar URL externa do documento"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
