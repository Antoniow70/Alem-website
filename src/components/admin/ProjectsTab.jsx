import { Pencil, Trash2 } from 'lucide-react';

/**
 * Projects list tab. Extracted from Admin.jsx lines 1213–1258.
 */
export default function ProjectsTab({ projects, statusSelectClasses, updateProjectStatus, openEdit, deleteProject }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="card-surface p-4 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
            <img
              src={project.capa_url || 'https://via.placeholder.com/150?text=Capa'}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h3 className="font-bold text-base text-slate-900 truncate">{project.name}</h3>
              <select
                value={project.status}
                onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                className={statusSelectClasses(project.status)}
              >
                <option value="Planeamento">Planeamento</option>
                <option value="Em Curso">Em Curso</option>
                <option value="Concluido">Concluido</option>
              </select>
            </div>
            <p className="text-slate-500 text-sm line-clamp-1">{project.objetivos_especificos}</p>
          </div>
          <div className="flex gap-2 self-end sm:self-auto ml-auto">
            <button
              onClick={() => openEdit(project)}
              className="p-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all"
              title="Editar projeto"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => deleteProject(project.id)}
              className="p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all"
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
