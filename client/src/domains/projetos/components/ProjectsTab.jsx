import { Pencil, Trash2, Users, Image as ImageIcon } from 'lucide-react';

/**
 * Projects list tab. Extracted from Admin.jsx lines 1213–1258.
 */
export default function ProjectsTab({ projects, statusSelectClasses, updateProjectStatus, openEdit, deleteProject }) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="card-surface p-5 flex flex-col md:flex-row md:items-center gap-5 transition-all duration-300 hover:shadow-lg border border-slate-100 dark:border-dark-muted/10 hover:border-brand-horizon/30 relative overflow-hidden group"
        >
          {/* Hover Accent Strip */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-horizon to-brand-eastBay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Project Cover Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-brand-poloBlue/10 shrink-0 border border-brand-poloBlue/20 shadow-sm relative group/image">
            <img
              src={project.capa_url || 'https://via.placeholder.com/200?text=Sem+Capa'}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Project Details */}
          <div className="flex-grow min-w-0 flex flex-col justify-between h-full py-0.5">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2.5">
                <h3 className="font-extrabold text-lg text-brand-bigStone dark:text-dark-text tracking-tight truncate leading-tight max-w-[280px] sm:max-w-md">
                  {project.name}
                </h3>
                
                {project.activities && project.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.activities.map((act) => (
                      <span key={act.id || act.name} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-poloBlue/15 text-brand-eastBay dark:text-dark-muted border border-brand-poloBlue/10 whitespace-nowrap">
                        {act.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Styled status select with custom dot indicator */}
                <div className="relative flex items-center ml-auto md:ml-0">
                  <span className={`absolute left-3 w-1.5 h-1.5 rounded-full z-10 ${
                    project.status === 'Planeamento' ? 'bg-amber-500 animate-pulse' :
                    project.status === 'Em Curso' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse' :
                    'bg-slate-400'
                  }`} />
                  <select
                    value={project.status}
                    onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                    className={`${statusSelectClasses(project.status)} !pl-8 font-bold tracking-wide shadow-sm`}
                  >
                    <option value="Planeamento">Planeamento</option>
                    <option value="Em Curso">Em Curso</option>
                    <option value="Concluido">Concluido</option>
                  </select>
                </div>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted text-sm line-clamp-2 mb-3.5 pr-4 leading-relaxed">
                {project.objetivos_especificos}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 dark:text-dark-muted/80">
              <div className="flex items-center gap-1.5 hover:text-brand-horizon transition-colors duration-200">
                <Users size={14} className="text-brand-poloBlue" />
                <span>{project.equipa_responsavel?.length || 0} na equipa</span>
              </div>
              <div className="h-3 w-px bg-slate-200 dark:bg-dark-muted/20" />
              <div className="flex items-center gap-1.5 hover:text-brand-horizon transition-colors duration-200">
                <ImageIcon size={14} className="text-brand-poloBlue" />
                <span>{project.gallery?.length || 0} ficheiros na galeria</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 sm:self-center ml-auto md:ml-4 border-t border-slate-100 dark:border-dark-muted/10 pt-4 md:pt-0 md:border-none w-full md:w-auto justify-end">
            <button
              onClick={() => openEdit(project)}
              className="p-3 bg-brand-poloBlue/10 hover:bg-brand-horizon text-brand-horizon hover:text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 flex items-center justify-center cursor-pointer"
              title="Editar projeto"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => deleteProject(project.id)}
              className="p-3 bg-feedback-errorLight hover:bg-feedback-error text-feedback-error hover:text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 flex items-center justify-center cursor-pointer"
              title="Eliminar projeto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

