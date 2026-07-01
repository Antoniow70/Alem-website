import { useState, useEffect } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { compressImage } from '../../../shared/utils/imageUtils';

export default function NewsModal({ isOpen, onClose, newsItem, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    news_date: '',
    capa_url: '',
    capa_data: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (newsItem) {
      setForm({
        title: newsItem.title || '',
        description: newsItem.description || '',
        news_date: newsItem.news_date ? newsItem.news_date.split('T')[0] : '',
        capa_url: newsItem.capa_url || '',
        capa_data: newsItem.capa_data || ''
      });
      setPreview(newsItem.capa_data || newsItem.capa_url || null);
    } else {
      setForm({
        title: '',
        description: '',
        news_date: '',
        capa_url: '',
        capa_data: ''
      });
      setPreview(null);
    }
    setSelectedFile(null);
  }, [newsItem, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.news_date) {
      alert('Preencha todos os campos obrigatorios.');
      return;
    }

    try {
      setUploading(true);
      let payload = { ...form };

      if (selectedFile) {
        const compressed = await compressImage(selectedFile);
        payload.capa_data = compressed;
        payload.capa_url = '';
      }

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Erro ao guardar noticia:', err);
      alert('Erro ao guardar noticia.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-brand-poloBlue/15 dark:border-dark-muted/10">
        <div className="p-6 border-b border-brand-poloBlue/10 dark:border-dark-muted/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-bigStone dark:text-dark-text tracking-tight">
            {newsItem ? 'Editar Noticia' : 'Nova Noticia'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-brand-bigStone hover:bg-slate-100 dark:hover:bg-dark-bg rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Title / Objetivo Geral */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-eastBay dark:text-dark-muted mb-1.5">
                Objetivo Geral *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-poloBlue/30 dark:border-dark-muted/30 bg-white dark:bg-dark-bg text-brand-bigStone dark:text-dark-text text-sm focus:ring-2 focus:ring-brand-horizon outline-none transition-all"
                placeholder="Titulo ou Objetivo Geral da noticia"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-eastBay dark:text-dark-muted mb-1.5">
                Data da Noticia *
              </label>
              <input
                type="date"
                value={form.news_date}
                onChange={(e) => setForm(p => ({ ...p, news_date: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-poloBlue/30 dark:border-dark-muted/30 bg-white dark:bg-dark-bg text-brand-bigStone dark:text-dark-text text-sm focus:ring-2 focus:ring-brand-horizon outline-none transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-eastBay dark:text-dark-muted mb-1.5">
                Descricao da Noticia *
              </label>
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-poloBlue/30 dark:border-dark-muted/30 bg-white dark:bg-dark-bg text-brand-bigStone dark:text-dark-text text-sm focus:ring-2 focus:ring-brand-horizon outline-none resize-none transition-all"
                placeholder="Conteudo detalhado da noticia..."
                required
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-eastBay dark:text-dark-muted mb-1.5">
                Imagem de Capa
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-brand-eastBay dark:text-dark-muted file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-horizon/10 file:text-brand-horizon hover:file:bg-brand-horizon/20 cursor-pointer"
              />
              {preview && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-brand-poloBlue/15 dark:border-dark-muted/10 relative group aspect-video">
                  <img src={preview} alt="Preview da capa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-brand-poloBlue/10 dark:border-dark-muted/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm cursor-pointer"
              disabled={uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary flex items-center gap-1.5 text-sm cursor-pointer"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {newsItem ? 'Guardar' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
