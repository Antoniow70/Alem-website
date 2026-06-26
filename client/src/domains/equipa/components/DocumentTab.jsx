import { Pencil, Trash2, FileText, Download, ExternalLink } from 'lucide-react';

export default function DocumentTab({ documents, openEditDocument, deleteDocument }) {
  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-brand-poloBlue/20 p-16 text-center">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-brand-eastBay dark:text-dark-muted font-medium">Nenhum documento institucional registado ainda.</p>
          <p className="text-slate-400 text-sm mt-1">Clique em "Novo Documento" no topo para adicionar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="card-surface p-5 flex flex-col justify-between group relative bg-white rounded-2xl border border-brand-poloBlue/20 hover:shadow-md transition-all">
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => openEditDocument(doc)}
                  className="p-2 bg-white/95 text-brand-eastBay dark:text-dark-text hover:text-white hover:bg-brand-primary rounded-lg transition-all shadow-sm border border-brand-poloBlue/20"
                  title="Editar"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-2 bg-white/95 text-brand-eastBay dark:text-dark-text hover:text-white hover:bg-feedback-error rounded-lg transition-all shadow-sm border border-brand-poloBlue/20"
                  title="Remover"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Document Info */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-poloBlue/15 flex items-center justify-center text-brand-horizon">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-bigStone dark:text-dark-text text-base line-clamp-1 mb-1">{doc.title}</h3>
                  <p className="text-brand-eastBay dark:text-dark-muted text-xs line-clamp-3 leading-relaxed min-h-[48px]">
                    {doc.description || 'Sem descricao.'}
                  </p>
                </div>
              </div>

              {/* Footer / Links */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-PT') : 'Sem data'}</span>
                {(doc.file_url || doc.file_data) && (
                  <a
                    href={doc.file_data || doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-brand-horizon hover:underline"
                  >
                    Visualizar <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
