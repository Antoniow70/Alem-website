import { motion } from 'motion/react';
import { Image as ImageIcon, ExternalLink, Users, Heart } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const statusColors = {
    'Planeamento': 'bg-brand-horizon text-white backdrop-blur-md border-brand-poloBlue/30',
    'Em Curso': 'bg-brand-horizon text-white backdrop-blur-md border-brand-poloBlue/30',
    'Concluido': 'bg-brand-horizon text-white backdrop-blur-md border-brand-poloBlue/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="relative rounded-3xl overflow-hidden group cursor-pointer aspect-[3/4] border border-brand-poloBlue/15 hover:border-brand-horizon/45 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out bg-slate-950"
    >
      {/* Full-bleed cover image with zoom effect */}
      <img
        src={project.capa_url || 'https://via.placeholder.com/800x1200?text=Sem+Capa'}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover scale-101 group-hover:scale-108 transition-transform duration-700 ease-out"
        referrerPolicy="no-referrer"
      />

      {/* Advanced multi-stop gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 via-slate-900/35 to-transparent opacity-95" />

      {/* Status badge with animated pulsing indicator dot */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border border-white/10 shadow-sm ${statusColors[project.status] || 'bg-slate-500/80 text-white'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          {project.status}
        </span>
      </div>

      {/* Card Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        {/* Category / Pillar Tag */}
        {project.activities && project.activities.length > 0 && (
          <span className="text-[10px] text-brand-poloBlue font-black tracking-widest uppercase mb-1.5 block truncate">
            {project.activities.map(a => a.name).join(', ')}
          </span>
        )}

        <h3 className="text-lg font-black text-white mb-2 leading-tight tracking-tight">
          {project.name}
        </h3>

        {/* Short Description */}
        <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mb-3.5">
          {project.objetivos_especificos}
        </p>

        {/* Micro-stats row */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300 font-semibold mb-4.5">
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-brand-poloBlue" />
            {project.equipa_responsavel?.length || 0} na equipa
          </span>
          {project.num_beneficiarios > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5" title="Beneficiarios">
                <Heart size={12} className="text-brand-poloBlue" />
                {project.num_beneficiarios} beneficiarios
              </span>
            </>
          )}
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="flex items-center gap-1.5">
            <ImageIcon size={12} className="text-brand-poloBlue" />
            {project.gallery?.length || 0} ficheiros
          </span>
        </div>

        {/* Read More Link */}
        <div className="flex items-center justify-end pt-3.5 border-t border-white/10">
          <span className="text-white text-xs font-bold flex items-center gap-1.5 group-hover:text-brand-poloBlue transition-colors duration-300">
            Ver detalhes 
            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

