import { motion } from 'motion/react';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const statusColors = {
    'Planeamento': 'bg-blue-600/90 text-white',
    'Em Curso': 'bg-emerald-600/90 text-white',
    'Concluido': 'bg-slate-600/95 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Full-bleed image */}
      <img
        src={project.capa_url || 'https://via.placeholder.com/800x1200?text=Sem+Capa'}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        referrerPolicy="no-referrer"
      />

      {/* Gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent group-hover:from-slate-950/90 transition-all duration-300" />

      {/* Status badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm ${statusColors[project.status] || 'bg-slate-500/90 text-white'}`}>
          {project.status}
        </span>
      </div>

      {/* Icon */}
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-1.5 rounded-lg text-white z-10 border border-white/10 opacity-70">
        <ImageIcon size={12} />
      </div>

      {/* Text overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
          {project.name}
        </h3>
        <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {project.objetivos_especificos}
        </p>
        <div className="flex items-center justify-end pt-2 border-t border-white/10">
          <span className="text-white text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Ver mais <ExternalLink size={12} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
