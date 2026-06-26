import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../cards/ProjectCard';
import { Search, Filter, Loader2 } from 'lucide-react';
import { getAllActivities, getProjects } from '../services/projetosApi';
import Partners from '../../parceiros/components/Partners';

export default function ProjetosSociais() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
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
    <div className="bg-transparent min-h-screen pb-24">
      {/* Header */}
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

      {/* Documentary Video Section */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-b border-brand-poloBlue/20">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-horizon">Video</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text">Documentario ALEM</h3>
              <p className="text-brand-eastBay dark:text-dark-muted text-sm md:text-base max-w-xl mx-auto">
                Conheca a historia da Associacao ALEM e o impacto que estamos a gerar na vida das criancas e familias em Mocambique.
              </p>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black border border-slate-200/20 max-w-4xl mx-auto">
              <div className="relative pb-[56.25%] w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/8qAz0MZgoA8"
                  title="Documentario ALEM"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Partners Section */}
      <section className="mt-20 py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto">
          <Partners />
        </div>
      </section>
    </div>
  );
}
