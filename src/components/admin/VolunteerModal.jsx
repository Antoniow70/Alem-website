import AdminModal from './AdminModal';

/**
 * Volunteer details and status management modal.
 * Extracted from Admin.jsx lines 2653–2773.
 */
export default function VolunteerModal({
  isOpen,
  onClose,
  editingVolunteer,
  setEditingVolunteer,
  updateVolunteerStatus,
  updateVolunteerReadStatus
}) {
  const footer = (
    <button
      onClick={onClose}
      className="sm:w-28 btn-secondary py-2.5 text-xs font-bold sm:ml-auto"
    >
      Fechar
    </button>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Candidatura"
      footer={footer}
    >
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        {/* Identification */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identificacao do Voluntario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="form-label mb-1">Nome Completo</span>
              <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.full_name}</p>
            </div>
            <div>
              <span className="form-label mb-1">Genero</span>
              <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.genero || 'N/A'}</p>
            </div>
            <div>
              <span className="form-label mb-1">Email</span>
              <p className="text-sm font-semibold text-slate-900 break-all">{editingVolunteer?.email}</p>
            </div>
            <div>
              <span className="form-label mb-1">Telefone</span>
              <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.phone}</p>
            </div>
            <div className="md:col-span-2">
              <span className="form-label mb-1">Endereco</span>
              <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.endereco || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidatura</h3>
          <div>
            <span className="form-label mb-1">Area de Interesse</span>
            <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.area_interesse || 'N/A'}</p>
          </div>
          <div>
            <span className="form-label mb-1">Mensagem/Observacoes do Voluntario</span>
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
              {editingVolunteer?.message || 'Nenhuma mensagem.'}
            </div>
          </div>
        </div>

        {/* Manage Status */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gerir Estado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label mb-1.5">Estado da Candidatura</label>
              <select
                value={editingVolunteer?.status || 'Pendente'}
                onChange={(e) => {
                  updateVolunteerStatus(editingVolunteer.id, e.target.value);
                  setEditingVolunteer({ ...editingVolunteer, status: e.target.value });
                }}
                className="form-input py-2 text-xs font-semibold"
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Analise">Em Analise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Recusado">Recusado</option>
              </select>
            </div>
            <div>
              <label className="form-label mb-1.5">Estado de Leitura</label>
              <select
                value={editingVolunteer?.read_status || 'Nao Lido'}
                onChange={(e) => {
                  updateVolunteerReadStatus(editingVolunteer.id, e.target.value);
                  setEditingVolunteer({ ...editingVolunteer, read_status: e.target.value });
                }}
                className="form-input py-2 text-xs font-semibold"
              >
                <option value="Lido">Lido</option>
                <option value="Nao Lido">Nao Lido</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
