import { Pencil, Trash2, UserCircle } from 'lucide-react';

/**
 * Team members management tab.
 * Extracted from Admin.jsx lines 1650–1694.
 */
export default function TeamTab({ team, openEditTeamMember, deleteTeamMember }) {
  return (
    <div className="space-y-6">
      {team.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-brand-poloBlue/20 p-16 text-center">
          <UserCircle size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-brand-eastBay dark:text-dark-muted font-medium">Nenhum membro da equipa registado ainda.</p>
          <p className="text-slate-400 text-sm mt-1">Clique em "Novo Membro" para adicionar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.id} className="card-surface p-5 flex flex-col items-center group relative text-center bg-white">
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => openEditTeamMember(member)}
                  className="p-2 bg-white/95 text-brand-eastBay dark:text-dark-text hover:text-white hover:bg-brand-primary rounded-lg transition-all shadow-sm border border-brand-poloBlue/20"
                  title="Editar"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => deleteTeamMember(member.id)}
                  className="p-2 bg-white/95 text-brand-eastBay dark:text-dark-text hover:text-white hover:bg-feedback-error rounded-lg transition-all shadow-sm border border-brand-poloBlue/20"
                  title="Remover"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-poloBlue/15 mb-3 border-2 border-slate-200/60 shadow-sm flex items-center justify-center shrink-0">
                {(member.photo_data || member.photo_url) ? (
                  <img src={member.photo_data || member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-350 bg-brand-poloBlue/20">
                    <UserCircle size={36} />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-brand-bigStone dark:text-dark-text text-base mb-0.5">{member.name}</h3>
              <p className="text-brand-primary font-medium text-xs mb-2.5">{member.role}</p>
              <p className="text-brand-eastBay dark:text-dark-muted text-xs line-clamp-3 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
