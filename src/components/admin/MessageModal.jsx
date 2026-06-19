import { Plus, Trash2 } from 'lucide-react';
import AdminModal from './AdminModal';

/**
 * Message details modal.
 * Extracted from Admin.jsx lines 2231–2412.
 */
export default function MessageModal({
  isOpen,
  onClose,
  selectedMessage,
  setSelectedMessage,
  updateMessageStatus,
  updateMessageReadStatus,
  onRegisterAsBeneficiary,
  onRecuseAndRemove
}) {
  if (!selectedMessage) return null;

  const footer = (
    <>
      <button
        onClick={() => onRegisterAsBeneficiary(selectedMessage)}
        className="flex-grow btn-primary py-2.5 text-xs font-bold"
      >
        <Plus size={16} /> Registar como Beneficiario
      </button>
      <button
        onClick={() => onRecuseAndRemove(selectedMessage.id)}
        className="flex-grow btn-ghost border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 py-2.5 text-xs font-bold"
      >
        <Trash2 size={16} /> Recusar e Remover
      </button>
      <button
        onClick={onClose}
        className="sm:w-28 btn-secondary py-2.5 text-xs font-bold"
      >
        Fechar
      </button>
    </>
  );

  const formattedDate = selectedMessage.created_at
    ? new Date(selectedMessage.created_at).toLocaleString('pt-PT')
    : 'N/A';

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Pedido de Apoio"
      subtitle={`Submetido em ${formattedDate}`}
      footer={footer}
    >
      <div className="p-6 space-y-6 overflow-y-auto flex-grow max-h-[60vh]">
        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
            selectedMessage.read_status === 'Lido'
              ? 'bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {selectedMessage.read_status === 'Lido' ? 'Lido' : 'Nao Lido'}
          </span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
            selectedMessage.status === 'Aceitado'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : selectedMessage.status === 'Recusado'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Estado: {selectedMessage.status}
          </span>
        </div>

        {/* Identification */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identificacao</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="form-label mb-1">Nome Completo</span>
              <p className="text-sm font-semibold text-slate-900">{selectedMessage.name || 'N/A'}</p>
            </div>
            <div>
              <span className="form-label mb-1">Genero</span>
              <p className="text-sm font-semibold text-slate-900">{selectedMessage.genero || 'N/A'}</p>
            </div>
            <div>
              <span className="form-label mb-1">Data de Nascimento</span>
              <p className="text-sm font-semibold text-slate-900">
                {selectedMessage.data_nascimento ? new Date(selectedMessage.data_nascimento).toLocaleDateString('pt-PT') : 'N/A'}
              </p>
            </div>
            <div>
              <span className="form-label mb-1">Contacto Telefonico</span>
              <p className="text-sm font-semibold text-slate-900">{selectedMessage.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="form-label mb-1">Email</span>
              <p className="text-sm font-semibold text-slate-900 break-all">{selectedMessage.email || 'N/A'}</p>
            </div>
            <div>
              <span className="form-label mb-1">Endereco</span>
              <p className="text-sm font-semibold text-slate-900">{selectedMessage.endereco || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Support Request */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedido</h3>
          <div>
            <span className="form-label mb-1">Tipo de Necessidade / Apoio</span>
            <p className="text-sm font-semibold text-slate-900">{selectedMessage.subject || 'N/A'}</p>
          </div>
          <div>
            <span className="form-label mb-1">Mensagem / Descricao</span>
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
              {selectedMessage.message || 'N/A'}
            </div>
          </div>
        </div>

        {/* Status Controls */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gerir Estado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label mb-1.5">Estado do Registo</label>
              <select
                value={selectedMessage.status || 'Novo'}
                onChange={(e) => {
                  updateMessageStatus(selectedMessage.id, e.target.value);
                  setSelectedMessage(m => ({ ...m, status: e.target.value }));
                }}
                className="form-input py-2 text-xs font-semibold"
              >
                <option value="Novo">Novo</option>
                <option value="Aceitado">Aceitado</option>
                <option value="Recusado">Recusado</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="form-label mb-1.5">Marcar Leitura</label>
              <button
                onClick={() => {
                  const newStatus = selectedMessage.read_status === 'Lido' ? 'Nao Lido' : 'Lido';
                  updateMessageReadStatus(selectedMessage.id, newStatus);
                  setSelectedMessage(m => ({ ...m, read_status: newStatus }));
                }}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
                  selectedMessage.read_status === 'Lido'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    : 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm'
                }`}
              >
                {selectedMessage.read_status === 'Lido' ? 'Marcar como Nao Lido' : 'Marcar como Lido'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
