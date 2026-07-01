import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import ProjectCard from '../cards/ProjectCard';
import { Search, Filter, Loader2, Calendar, ChevronRight, Newspaper, Play } from 'lucide-react';
import { getAllActivities, getProjects } from '../services/projetosApi';
import { getNews } from '../../noticias/services/noticiasApi';
import Partners from '../../parceiros/components/Partners';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProjetosSociais() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos'); // 'Todos' or activityId
  const [searchTerm, setSearchTerm] = useState('');

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
        const [data, newsData] = await Promise.all([
          getProjects(params),
          getNews().catch(() => [])
        ]);
        setProjects(data || []);
        setNewsList((newsData || []).slice(0, 6));
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
    <div className="bg-white dark:bg-dark-bg min-h-screen pb-24">
      {/* Header */}
      <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/ImagemDaTelaDestaques.png"
            alt="ALEM Destaques"
            className="w-full h-full object-cover opacity-[0.35]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bigStone/40 via-transparent to-brand-bigStone/95 dark:from-dark-bg/85 dark:via-dark-bg/70 dark:to-dark-bg z-10" />
        </div>

        <div className="max-w-7xl mx-auto relative z-20 text-center space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Nossos Projectos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            Destaques
          </motion.h1>
        </div>
      </section>

      {/* Documentary Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-horizon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-horizon">
            <Play size={12} /> Documentario
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-white tracking-tight">
            Conheca a Nossa Historia em Video
          </h2>
          <p className="text-brand-eastBay dark:text-dark-muted text-sm max-w-xl mx-auto leading-relaxed">
            Assista ao documentario que conta a trajetoria da ALEM e o impacto que temos criado nas comunidades mocambicanas.
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-poloBlue/15 dark:border-dark-muted/10 aspect-video max-w-4xl mx-auto bg-black">
          <iframe
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Documentario ALEM"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto -mt-10 relative z-30 pb-10">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-brand-poloBlue/10 dark:border-dark-muted/10 p-5 flex flex-col md:flex-row gap-4 items-center">
          {/* Activity Pills */}
          <div className="flex flex-wrap gap-2 flex-grow">
            <button
              onClick={() => setFilter('Todos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'Todos'
                  ? 'bg-brand-horizon text-white shadow-md shadow-brand-horizon/25'
                  : 'bg-brand-poloBlue/10 text-brand-eastBay dark:text-dark-muted hover:bg-brand-poloBlue/20'
              }`}
            >
              Todos
            </button>
            {activities.map((act) => (
              <button
                key={act.id}
                onClick={() => setFilter(act.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === act.id
                    ? 'bg-brand-horizon text-white shadow-md shadow-brand-horizon/25'
                    : 'bg-brand-poloBlue/10 text-brand-eastBay dark:text-dark-muted hover:bg-brand-poloBlue/20'
                }`}
              >
                {act.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate('/projetos-sociais/' + project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-5 bg-transparent rounded-2xl border border-dashed border-slate-200 max-w-3xl mx-auto">
            <div className="w-14 h-14 bg-transparent rounded-xl flex items-center justify-center mx-auto text-slate-400 flex items-center justify-center">
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

      {/* Ultimas Noticias Section */}
      {newsList.length > 0 && (
        <section className="mt-20 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-horizon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-horizon"
            >
              <Newspaper size={12} />
              Ultimas Noticias
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text tracking-tight"
            >
              Fique por dentro
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  to={`/noticias/${item.id}`}
                  className="group block bg-white dark:bg-dark-surface rounded-2xl border border-brand-poloBlue/10 dark:border-dark-muted/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                >
                  {(item.capa_url || item.capa_data) && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.capa_data || item.capa_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2.5">
                    <span className="text-[10px] font-bold text-brand-horizon uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(item.news_date)}
                    </span>
                    <h3 className="text-sm font-bold text-brand-bigStone dark:text-dark-text line-clamp-2 group-hover:text-brand-horizon transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-eastBay dark:text-dark-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[10px] font-bold text-brand-horizon flex items-center gap-1 pt-1">
                      Ler mais <ChevronRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Partners Section */}
      <section className="mt-20 py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto">
          <Partners />
        </div>
      </section>
    </div>
  );
}
