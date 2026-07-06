import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getProjectById } from '../services/projetosApi';
import { getTeam, TeamMemberCard } from '../../equipa';
import { ArrowRight, Heart, X, Play, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function ProjetoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [flippedId, setFlippedId] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -clientWidth : clientWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectAndTeam();

    const handleStorageChange = (e) => {
      if (e.key === 'alem_projects_db' || e.key === 'alem_team') {
        fetchProjectAndTeam();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [id]);

  async function fetchProjectAndTeam() {
    try {
      setLoading(true);
      const proj = await getProjectById(id);
      
      if (!proj) {
        navigate('/projetos-sociais');
        return;
      }
      setProject(proj);

      // Fetch team
      const teamData = await getTeam();
      if (teamData) {
        if (proj.equipa_responsavel && Array.isArray(proj.equipa_responsavel)) {
          setTeam(teamData.filter(member => proj.equipa_responsavel.includes(member.id) || proj.equipa_responsavel.includes(member.name)));
        } else {
          setTeam([]);
        }
      } else {
        setTeam([]);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      navigate('/projetos-sociais');
    } finally {
      setLoading(false);
    }
  }

  const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-poloBlue/15">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-horizon border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-brand-eastBay dark:text-dark-muted font-bold">A carregar projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-dark-bg min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
        <div className="absolute top-4 left-4 md:left-8 z-30">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white font-bold transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar
          </button>
        </div>
        <div className="absolute inset-0 z-0">
          <img
            src={project.capa_url || 'https://via.placeholder.com/1920x1080?text=Sem+Capa'}
            alt={project.name}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-lg bg-brand-horizon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">
              Projeto {project.status === 'Em Curso' ? 'em Curso' : project.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-xl">
              <span className="text-white">{project.name}</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                to="/doar"
                className="btn-primary"
              >
                Doar Agora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Objectives & Media Section */}
      <section className="py-16 px-4 relative z-30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-stretch">
              {/* Text side – General & Specific objectives */}
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-black dark:text-white">{project.name}</h3>

                {/* Objetivo Geral */}
                {project.objetivo_geral && (
                  <div className="space-y-2">
                    <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
                      Objetivo Geral
                    </span>
                    <p className="text-base text-black dark:text-dark-text leading-relaxed">
                      {project.objetivo_geral}
                    </p>
                  </div>
                )}

                {/* Objetivos Especificos */}
                {project.objetivos_especificos && (
                  <div className="space-y-3">
                    <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
                      Objetivos Especificos
                    </span>
                    <div className="space-y-3">
                      {project.objetivos_especificos.split('\n').filter(line => line.trim()).map((obj, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <p className="text-base text-black dark:text-dark-text leading-relaxed">{obj.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Principais Atividades */}
                {project.principais_atividades && (
                  <div className="space-y-3">
                    <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
                      Principais Atividades
                    </span>
                    <div className="space-y-3">
                      {project.principais_atividades.split('\n').filter(line => line.trim()).map((activity, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <Check className="text-blue-500 shrink-0 mt-0.5" size={18} />
                          <p className="text-base text-black dark:text-dark-text leading-relaxed">{activity.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Media side */}
              <div className="rounded-2xl overflow-hidden shadow-md border border-brand-poloBlue/20 aspect-[4/3] lg:aspect-auto lg:h-full bg-brand-poloBlue/20 relative group">
                {(() => {
                  const mediaItems = [];
                  if (project.gallery && project.gallery.length > 0) {
                    mediaItems.push(...project.gallery);
                  }

                  if (mediaItems.length === 0) {
                    return <div className="w-full h-full flex items-center justify-center text-slate-400">Sem media</div>;
                  }

                  return (
                    <>
                      <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory h-full w-full scroll-smooth [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {mediaItems.map((item, idx) => (
                          <div key={idx} className="flex-none w-full h-full snap-center relative">
                            {item.type === 'image' ? (
                              <img src={item.url} alt={item.description || project.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : item.url?.includes('youtube.com') || item.url?.includes('youtu.be') ? (
                              <iframe src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`} title={project.name} className="w-full h-full border-none" allowFullScreen />
                            ) : (
                              <video src={item.url} className="w-full h-full object-cover" controls />
                            )}
                          </div>
                        ))}
                      </div>

                      {mediaItems.length > 1 && (
                        <>
                          <button
                            onClick={() => scroll('left')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-horizon p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={() => scroll('right')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-horizon p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
                          >
                            <ChevronRight size={24} />
                          </button>

                          {/* Indicator dots */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                            {mediaItems.map((_, idx) => (
                              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/60" />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipe Responsavel */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">A Nossa Equipa</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text">Equipa Responsavel</h3>
          </div>

          {team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
              {team.map((person, i) => (
                <TeamMemberCard
                  key={person.id}
                  person={person}
                  index={i}
                  isFlipped={flippedId === person.id}
                  onToggle={() => setFlippedId(flippedId === person.id ? null : person.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-2xl border border-brand-poloBlue/20 dark:border-dark-muted/10 max-w-2xl mx-auto">
              <p className="text-brand-eastBay dark:text-dark-muted text-base font-semibold">Ainda nao foi atribuida nenhuma equipa a este projeto.</p>
              <p className="text-slate-400 dark:text-dark-muted text-xs mt-1">Esta informacao pode ser adicionada pelo administrador no painel de gestao.</p>
            </div>
          )}
        </div>
      </section>
    </div >
  );
}
