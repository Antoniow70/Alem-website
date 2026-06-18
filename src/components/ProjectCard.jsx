import { motion } from 'motion/react';
import { Play, Image as ImageIcon, ExternalLink } from 'lucide-react';

const getYouTubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function ProjectCard({ project, onClick }) {
  const statusColors = {
    'Planeamento': 'bg-green-500/90 text-white',
    'Em Curso': 'bg-green-500/90 text-white',
    'Concluido': 'bg-green-500/90 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="relative rounded-[20px] overflow-hidden group cursor-pointer aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Full-bleed image */}
      <img
        src={project.capa_url || 'https://via.placeholder.com/800x1200?text=Sem+Capa'}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        referrerPolicy="no-referrer"
      />

      {/* Gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />

      {/* Status badge */}
      <div className="absolute top-5 left-5 z-10">
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* Icon */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md p-2 rounded-full text-white z-10">
        <ImageIcon size={14} />
      </div>

      {/* Text overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
          {project.name}
        </h3>
        <p className="text-white/70 text-sm line-clamp-2 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {project.objetivos_especificos}
        </p>
        <div className="flex items-center justify-end pt-3 border-t border-white/10">
          <span className="text-white text-sm font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Ver mais <ExternalLink size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

