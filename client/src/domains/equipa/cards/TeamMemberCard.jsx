import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function TeamMemberCard({ person, isFlipped, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group cursor-pointer perspective-[1000px]"
      onClick={onToggle}
    >
      <div className={`relative w-full aspect-[4/5] transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

        {/* Front of card */}
        <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
          <img
            src={person.photo_data || person.photo_url || 'https://via.placeholder.com/300?text=Foto'}
            alt={person.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col items-start">
            <h4 className="text-xl font-bold text-white drop-shadow-lg mb-1">{person.name}</h4>
            <p className="text-white/90 text-sm font-medium mb-3">{person.role}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-md"
            >
              Saber Mais <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-900 rounded-3xl shadow-2xl p-6 text-white overflow-hidden flex flex-col text-left">
          
          {/* Header row with profile pic, name and role */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10 w-full shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shrink-0 shadow-md">
              <img
                src={person.photo_data || person.photo_url || 'https://via.placeholder.com/300?text=Foto'}
                alt={person.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-bold leading-tight text-white mb-0.5 truncate">{person.name}</h4>
              <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider truncate">{person.role}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-grow w-full overflow-y-auto text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap pr-2 custom-scrollbar">
            {person.bio || 'Sem informacoes adicionais.'}
          </div>
          
        </div>

      </div>
    </motion.div>
  );
}
