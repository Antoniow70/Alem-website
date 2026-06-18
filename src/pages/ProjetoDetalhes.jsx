import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase, resolveProjectMediaUrls } from '../lib/supabase';
import { ArrowRight, Heart, X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import TeamMemberCard from '../components/TeamMemberCard';

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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id);

      if (error) throw error;
      if (!data || data.length === 0) {
        navigate('/projetos-sociais');
        return;
      }

      const resolved = await resolveProjectMediaUrls(data);
      const proj = resolved[0];
      setProject(proj);

      // Fetch team
      const { data: teamData, error: teamError } = await supabase.from('team').select('*');
      if (!teamError && teamData) {
        if (proj.equipa_responsavel && Array.isArray(proj.equipa_responsavel)) {
          setTeam(teamData.filter(member => proj.equipa_responsavel.includes(member.id)));
        } else {
          setTeam([]);
        }
      } else {
        setTeam([]);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold">A carregar projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-slate-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center pt-16 px-6 md:px-12 lg:px-16">
        <div className="absolute top-4 left-4 md:left-8 z-30">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white font-bold transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar
          </button>
        </div>
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/20 z-10" />
          <img
            src={project.capa_url || 'https://via.placeholder.com/1920x1080?text=Sem+Capa'}
            alt={project.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-20 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center px-4 py-1 bg-blue-50/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-blue-600 shadow-lg">
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

      {/* Glass Card Section – Objectives & Media */}
      <section className="pt-24 pb-6 px-4 -mt-20 relative z-30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-[40px] shadow-2xl border border-white/50 p-8 md:p-12 overflow-hidden relative"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text side – General & Specific objectives */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-black drop-shadow-xl">{project.name}</h3>
                <p className="text-lg text-black leading-relaxed whitespace-pre-wrap">{project.objetivos_especificos}</p>
              </div>

              {/* Media side */}
              <div className="rounded-[32px] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-100 relative group">
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={() => scroll('right')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
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
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">A Nossa Equipa</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Equipa Responsavel</h3>
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
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 max-w-2xl mx-auto">
              <p className="text-slate-500 text-base font-semibold">Ainda nao foi atribuida nenhuma equipa a este projeto.</p>
              <p className="text-slate-400 text-xs mt-1">Esta informacao pode ser adicionada pelo administrador no painel de gestao.</p>
            </div>
          )}
        </div>
      </section>
    </div >
  );
}
