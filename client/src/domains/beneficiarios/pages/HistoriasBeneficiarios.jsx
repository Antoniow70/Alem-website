import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Loader2, AlertCircle, X, ArrowRight, BookOpen } from 'lucide-react';
import { getBeneficiaryStories } from '../services/beneficiariosApi';
import { getProjects } from '../../projetos';

const isMock = false;

export default function HistoriasBeneficiarios() {
  const [stories, setStories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    fetchData();

    const handleStorageChange = (e) => {
      if (e.key === 'alem_beneficiary_stories_db' || e.key === 'alem_projects_db') {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [storyData, projData] = await Promise.all([
        getBeneficiaryStories(),
        getProjects()
      ]);
      setStories(storyData || []);
      setProjects(projData || []);
    } catch (error) {
      console.error('Error fetching beneficiary stories:', error);
    } finally {
      setLoading(false);
    }
  }

  const getProjectName = (story) => {
    if (story.projects && story.projects.name) return story.projects.name;
    const proj = projects.find(p => p.id === story.project_id);
    return proj ? proj.name : 'Projeto Geral';
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = 
      story.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(story).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-brand-poloBlue/15 min-h-screen pb-24">
      {/* Header */}
      <section className="relative text-white py-28 px-4 overflow-hidden bg-brand-bigStone dark:text-dark-text">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/nossa historia.jpg"
            alt="Historias de Beneficiarios"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/50 to-slate-950/30" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Historias de Impacto</h1>
          <p className="text-xl text-brand-poloBlue/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Conheca as trajetorias de superacao e inclusao das vidas transformadas atraves do apoio da ALEM.
          </p>
        </div>
      </section>

      {/* Demo Mode Banner */}
      {isMock && (
        <div className="bg-feedback-warningLight border-b border-amber-200 py-3 px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-feedback-warningText text-sm font-medium">
              <AlertCircle size={18} className="shrink-0" />
              <p>
                <span className="font-bold">Modo de Demonstracao:</span> O Supabase nao esta configurado. Os dados abaixo sao guardados localmente.
              </p>
            </div>
            <a
              href="/admin"
              className="text-feedback-warningMuted text-xs font-bold underline hover:no-underline"
            >
              Configurar Agora
            </a>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-end">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por nome, historia ou projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-brand-horizon focus:border-transparent shadow-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-brand-horizon" size={48} />
            <p className="text-brand-eastBay dark:text-dark-muted font-medium">A carregar historias...</p>
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-brand-poloBlue/20 hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-poloBlue/20">
                  <img
                    src={story.image_data || story.image_url || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=500&q=80'}
                    alt={story.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-horizon rounded-full mb-2 inline-block">
                      {getProjectName(story)}
                    </span>
                    <h3 className="text-xl font-bold line-clamp-1">{story.full_name}</h3>
                  </div>
                </div>

                {/* Text and Actions */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <p className="text-brand-eastBay dark:text-dark-muted text-sm leading-relaxed line-clamp-3 mb-6">
                    {story.story}
                  </p>
                  <button
                    className="text-brand-horizon font-bold text-sm flex items-center gap-1.5 group-hover:text-brand-eastBay transition-colors w-fit"
                  >
                    Ler Historia Completa <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-brand-poloBlue/20 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Heart size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-bigStone">Nenhuma historia encontrada</h3>
              <p className="text-brand-eastBay dark:text-dark-muted">Tente ajustar o termo de pesquisa ou adicione novas historias pelo painel admin.</p>
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="text-brand-horizon font-bold hover:underline"
            >
              Limpar pesquisa
            </button>
          </div>
        )}
      </section>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-brand-bigStone dark:text-dark-text/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-brand-poloBlue/20 flex justify-between items-center bg-brand-poloBlue/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-poloBlue/20 text-brand-horizon rounded-xl flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-bigStone">{selectedStory.full_name}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-eastBay dark:text-dark-muted">
                      {getProjectName(selectedStory)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-brand-eastBay dark:text-dark-muted"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-8 md:p-10 space-y-8 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-brand-poloBlue/20 shadow-md">
                    <img
                      src={selectedStory.image_data || selectedStory.image_url || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=500&q=80'}
                      alt={selectedStory.full_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Beneficiario</p>
                      <h3 className="text-2xl font-black text-brand-bigStone leading-tight">{selectedStory.full_name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projeto Relacionado</p>
                      <p className="font-semibold text-brand-horizon">{getProjectName(selectedStory)}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data de Publicacao</p>
                      <p className="text-sm text-brand-eastBay dark:text-dark-muted">
                        {new Date(selectedStory.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-brand-poloBlue/20">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historia de Impacto</h4>
                  <p className="text-brand-eastBay dark:text-dark-text leading-relaxed whitespace-pre-line text-base">
                    {selectedStory.story}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-brand-poloBlue/15 border-t border-brand-poloBlue/20 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-6 py-3 bg-brand-horizon hover:bg-brand-eastBay text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
