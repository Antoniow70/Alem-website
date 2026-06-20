import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../cards/ProjectCard';
import { Search, Filter, Loader2, X, Tag } from 'lucide-react';
import { getAllActivities, getProjects } from '../services/projetosApi';

const getYouTubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function ProjetosSociais({ isSection = false }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos'); // 'Todos' or activityId
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getAllActivities();
        setActivities(data || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    }
    loadActivities();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const params = {};
        if (filter !== 'Todos') {
          params.activityId = filter;
        }
        const data = await getProjects(params);
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [filter]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.objetivos_especificos || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={isSection ? "" : "bg-transparent min-h-screen pb-24"}>
      {!isSection && (
        /* Header */
        <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/projetos.jpg"
              alt="Projetos Sociais"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center rounded-lg bg-brand-horizon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Iniciativas
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Destaques</h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Conheca as nossas iniciativas em curso e o impacto que estamos a gerar nas comunidades.
            </p>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 px-6 md:px-12 lg:px-16 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex bg-transparent p-1 rounded-xl shadow-sm border border-slate-200/60 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilter('Todos')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'Todos'
                  ? 'bg-brand-horizon text-white shadow-sm'
                  : 'text-brand-eastBay dark:text-dark-muted hover:text-brand-bigStone dark:text-dark-text hover:bg-transparent'
              }`}
            >
              Todos
            </button>
            {activities.map((act) => (
              <button
                key={act.id}
                onClick={() => setFilter(act.id)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filter === act.id
                    ? 'bg-brand-horizon text-white shadow-sm'
                    : 'text-brand-eastBay dark:text-dark-muted hover:text-brand-bigStone dark:text-dark-text hover:bg-transparent'
                }`}
              >
                {act.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm transition-all placeholder-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-brand-horizon" size={36} />
            <p className="text-brand-eastBay dark:text-dark-muted text-sm font-medium">A carregar projetos...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth scrollbar-none pb-6 md:grid md:grid-cols-4 md:gap-6 md:pb-0">
            {filteredProjects.map((project) => (
              <div key={project.id} className="w-[85%] sm:w-[45%] md:w-full shrink-0 snap-center">
                <ProjectCard
                  project={project}
                  onClick={() => navigate('/projetos-sociais/' + project.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-5 bg-transparent rounded-2xl border border-dashed border-slate-200 max-w-3xl mx-auto">
            <div className="w-14 h-14 bg-transparent rounded-xl flex items-center justify-center mx-auto text-slate-400">
              <Filter size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-bigStone dark:text-dark-text">Nenhum projeto encontrado</h3>
              <p className="text-brand-eastBay dark:text-dark-muted text-sm">Tente ajustar os filtros ou o termo de pesquisa.</p>
            </div>
            <button
              onClick={() => { setFilter('Todos'); setSearchTerm(''); }}
              className="text-brand-horizon text-sm font-bold hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-brand-bigStone dark:text-dark-text/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-transparent w-full h-full relative z-10 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-brand-poloBlue/20 flex justify-between items-center bg-transparent sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-horizon rounded-xl flex items-center justify-center text-white">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-bigStone">{selectedProject.name}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-feedback-successBorder text-feedback-success">
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-brand-poloBlue/20 rounded-full transition-colors text-slate-400 hover:text-brand-eastBay dark:text-dark-muted"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-4 md:p-12 space-y-12">
                {/* Media Section */}
                <div className="rounded-[32px] overflow-hidden bg-brand-poloBlue/20 max-h-[70vh] relative shadow-inner flex items-center justify-center">
                  {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                    selectedProject.gallery[0].type === 'image' ? (
                      <img src={selectedProject.gallery[0].url} alt={selectedProject.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : selectedProject.gallery[0].url?.includes('youtube.com') || selectedProject.gallery[0].url?.includes('youtu.be') ? (
                      <div className="w-full aspect-video">
                        <iframe src={`https://www.youtube.com/embed/${getYouTubeId(selectedProject.gallery[0].url)}`} title={selectedProject.name} className="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    ) : (
                      <div className="w-full aspect-video">
                        <video src={selectedProject.gallery[0].url} className="w-full h-full object-contain" controls />
                      </div>
                    )
                  ) : (
                    <img src={selectedProject.capa_url} alt={selectedProject.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-brand-bigStone">{selectedProject.name}</h3>
                      <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-lg whitespace-pre-wrap">
                        {selectedProject.objetivos_especificos}
                      </p>
                    </div>

                    {/* Gallery Section */}
                    {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                      <div className="space-y-6 pt-8 border-t border-brand-poloBlue/20">
                        <h3 className="text-2xl font-bold text-brand-bigStone">Galeria do Projeto</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {selectedProject.gallery.map((item, idx) => (
                            <div key={idx} className="space-y-2 group">
                              <div className="rounded-2xl overflow-hidden bg-brand-poloBlue/20 aspect-video relative shadow-sm">
                                {item.type === 'image' ? (
                                  <img
                                    src={item.url}
                                    alt={item.description || `Media ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : item.type === 'video' && !item.url?.includes('youtube.com') && !item.url?.includes('youtu.be') ? (
                                  <video
                                    controls
                                    className="w-full h-full object-contain bg-black"
                                    src={item.url}
                                  />
                                ) : (
                                  <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
                                    title={`Video ${idx + 1}`}
                                    className="w-full h-full border-none"
                                    allowFullScreen
                                  />
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-brand-eastBay dark:text-dark-muted italic px-2">{item.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="bg-transparent p-8 rounded-[32px] space-y-6">
                      <h4 className="font-bold text-brand-bigStone uppercase text-xs tracking-widest">Detalhes</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-eastBay dark:text-dark-muted">
                          <Tag size={18} className="text-brand-horizon" />
                          <div className="text-sm">
                            <p className="font-bold text-brand-bigStone">Estado Atual</p>
                            <p>{selectedProject.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        navigate('/contactos');
                      }}
                      className="w-full bg-brand-horizon hover:bg-brand-eastBay text-white py-5 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      Quero Ajudar
                    </button>
                  </div>
                </div>

                {/* Other Projects */}
                <div className="space-y-8 pt-12 border-t border-brand-poloBlue/20">
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold text-brand-bigStone">Outros Projetos</h3>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-brand-horizon font-bold text-sm hover:underline"
                    >
                      Ver Todos
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    {projects
                      .filter(p => p.id !== selectedProject.id)
                      .slice(0, 2)
                      .map(p => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProject(p)}
                          className="flex gap-4 p-4 bg-transparent rounded-3xl hover:bg-transparent hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-brand-poloBlue/20"
                        >
                          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img
                              src={p.capa_url || 'https://via.placeholder.com/150'}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-brand-bigStone group-hover:text-brand-horizon transition-colors">{p.name}</h4>
                            <p className="text-xs text-brand-eastBay dark:text-dark-muted line-clamp-2 mt-1">{p.objetivos_especificos || ''}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
