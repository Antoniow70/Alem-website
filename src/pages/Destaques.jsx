import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase, isMock, resolveProjectMediaUrls } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, Loader2, AlertCircle, X, Play, Calendar, Tag } from 'lucide-react';

const getYouTubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function ProjetosSociais({ isSection = false }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();

    const handleStorageChange = (e) => {
      if (e.key === 'alem_projects_db') {
        fetchProjects();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Resolve idb:// URLs to blob:// URLs for uploaded media
      const resolved = await resolveProjectMediaUrls(data || []);
      setProjects(resolved);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'Todos' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.objetivos_especificos || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={isSection ? "" : "bg-slate-50 min-h-screen pb-24"}>
      {!isSection && (
        /* Header */
        <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-slate-900">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="Imagem/projetos.jpg"
              alt="Projetos Sociais"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Iniciativas
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Destaques</h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Conheca as nossas iniciativas em curso e o impacto que estamos a gerar nas comunidades.
            </p>
          </div>
        </section>
      )}

      {/* Demo Mode Banner */}
      {isMock && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-800 text-sm font-medium">
              <AlertCircle size={18} className="shrink-0" />
              <p>
                <span className="font-bold">Modo de Demonstracao:</span> O Supabase nao esta configurado. Os dados abaixo sao ficticios.
              </p>
            </div>
            <a
              href="/admin"
              className="text-amber-900 text-xs font-bold underline hover:no-underline"
            >
              Configurar Agora
            </a>
          </div>
        </div>
      )}

      {/* Filters */}
      <section className="py-8 px-6 md:px-12 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200/60 w-full md:w-auto overflow-x-auto">
            {['Todos', 'Planeamento', 'Em Curso', 'Concluido'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {f}
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
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm transition-all placeholder-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-slate-500 text-sm font-medium">A carregar projetos...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id}>
                <ProjectCard
                  project={project}
                  onClick={() => navigate('/projetos-sociais/' + project.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-5 bg-white rounded-2xl border border-dashed border-slate-200 max-w-3xl mx-auto">
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-slate-400">
              <Filter size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Nenhum projeto encontrado</h3>
              <p className="text-slate-500 text-sm">Tente ajustar os filtros ou o termo de pesquisa.</p>
            </div>
            <button
              onClick={() => { setFilter('Todos'); setSearchTerm(''); }}
              className="text-blue-600 text-sm font-bold hover:underline"
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
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full h-full relative z-10 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#14213D]">{selectedProject.name}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-4 md:p-12 space-y-12">
                {/* Media Section */}
                <div className="rounded-[32px] overflow-hidden bg-slate-100 max-h-[70vh] relative shadow-inner flex items-center justify-center">
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
                      <h3 className="text-3xl font-bold text-[#14213D]">{selectedProject.name}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                        {selectedProject.objetivos_especificos}
                      </p>
                    </div>

                    {/* Gallery Section */}
                    {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                      <div className="space-y-6 pt-8 border-t border-slate-100">
                        <h3 className="text-2xl font-bold text-[#14213D]">Galeria do Projeto</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {selectedProject.gallery.map((item, idx) => (
                            <div key={idx} className="space-y-2 group">
                              <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video relative shadow-sm">
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
                                <p className="text-sm text-slate-500 italic px-2">{item.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-[32px] space-y-6">
                      <h4 className="font-bold text-[#14213D] uppercase text-xs tracking-widest">Detalhes</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Tag size={18} className="text-blue-600" />
                          <div className="text-sm">
                            <p className="font-bold text-[#14213D]">Estado Atual</p>
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      Quero Ajudar
                    </button>
                  </div>
                </div>

                {/* Other Projects */}
                <div className="space-y-8 pt-12 border-t border-slate-100">
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold text-[#14213D]">Outros Projetos</h3>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-blue-600 font-bold text-sm hover:underline"
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
                          className="flex gap-4 p-4 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
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
                            <h4 className="font-bold text-[#14213D] group-hover:text-blue-600 transition-colors">{p.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.objetivos_especificos || ''}</p>
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
