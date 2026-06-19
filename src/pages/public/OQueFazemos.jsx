import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Lightbulb, Heart, ShieldCheck, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';
import { getPillars, getActivities, getProjects } from '../../services/adminService';
import ProjectCard from '../../components/cards/ProjectCard';
import { useNavigate } from 'react-router-dom';

export default function OQueFazemos({ isSection = false }) {
  const navigate = useNavigate();
  const [pillars, setPillars] = useState([]);
  const [activePillar, setActivePillar] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeActivity, setActiveActivity] = useState(null);
  const [projects, setProjects] = useState([]);
  
  const [loadingPillars, setLoadingPillars] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    async function loadPillars() {
      try {
        setLoadingPillars(true);
        const data = await getPillars();
        setPillars(data || []);
        if (data && data.length > 0) {
          setActivePillar(data[0]);
        }
      } catch (err) {
        console.error('Error loading pillars:', err);
      } finally {
        setLoadingPillars(false);
      }
    }
    loadPillars();
  }, []);

  useEffect(() => {
    if (!activePillar) return;
    async function loadActivities() {
      try {
        setLoadingActivities(true);
        setActivities([]);
        setActiveActivity(null);
        setProjects([]);
        const data = await getActivities(activePillar.id);
        setActivities(data || []);
        if (data && data.length > 0) {
          setActiveActivity(data[0]);
        }
      } catch (err) {
        console.error('Error loading activities:', err);
      } finally {
        setLoadingActivities(false);
      }
    }
    loadActivities();
  }, [activePillar]);

  useEffect(() => {
    if (!activeActivity) return;
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        setProjects([]);
        const data = await getProjects({ activityId: activeActivity.id });
        setProjects(data || []);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, [activeActivity]);

  return (
    <div className={isSection ? "" : "bg-slate-50 min-h-screen"}>
      {!isSection && (
        /* Header */
        <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-slate-900">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="Imagem/O que fazemos.jpg"
              alt="O que fazemos"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                O Que Fazemos
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                Nossos Programas
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Desenvolvemos programas integrados que abrangem a crianca, a escola, a familia e a sociedade.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Dynamic Pillars, Activities, and Projects Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          {loadingPillars ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={36} />
              <p className="text-slate-500 text-sm mt-3">A carregar os pilares estrategicos...</p>
            </div>
          ) : (
            <>
              {/* Pillars Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pillars.map((pillar, i) => {
                  const icons = [<GraduationCap size={24} />, <BookOpen size={24} />, <Users size={24} />];
                  const isActive = activePillar?.id === pillar.id;
                  return (
                    <motion.button
                      key={pillar.id}
                      onClick={() => setActivePillar(pillar)}
                      whileHover={{ y: -2 }}
                      className={`p-6 rounded-2xl border text-left transition-all relative ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/20 shadow-md shadow-blue-500/5'
                          : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`}>
                          {icons[i % icons.length]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{pillar.name}</h4>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mt-4 leading-relaxed line-clamp-2">{pillar.description}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Activities Bar under selected Pilar */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Areas de Atividade de "{activePillar?.name}"
                </h4>
                {loadingActivities ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                    <span className="text-slate-500 text-xs">A carregar atividades...</span>
                  </div>
                ) : activities.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {activities.map((act) => {
                      const isActive = activeActivity?.id === act.id;
                      return (
                        <button
                          key={act.id}
                          onClick={() => setActiveActivity(act)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-100'
                          }`}
                        >
                          {act.name}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">Sem atividades registadas para este pilar.</p>
                )}
              </div>

              {/* Projects Grid for selected Activity */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Projetos em "{activeActivity?.name || 'Selecione uma atividade'}"
                  </h4>
                </div>
                {loadingProjects ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <p className="text-slate-500 text-xs mt-2">A carregar iniciativas...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => navigate('/projetos-sociais/' + project.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm font-semibold">Sem projetos associados de momento</p>
                    <p className="text-slate-400 text-xs mt-1">Brevemente teremos novas iniciativas a decorrer nesta area.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
              O Nosso Impacto
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              O nosso impacto vai alem dos numeros. E sobre vidas transformadas.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Cada crianca que aprende a ler apesar da dislexia, ou que consegue focar-se na aula com estrategias para TDAH, representa uma vitoria para toda a comunidade.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-emerald-400">85%</p>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Melhoria Escolar</p>
              </div>
              <div>
                <p className="text-4xl font-black text-blue-400">92%</p>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Satisfacao Familiar</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/10 shadow-lg">
            <blockquote className="text-base md:text-lg italic text-slate-300 leading-relaxed">
              "Antes da ALEM, o meu filho era visto como 'preguicoso'. Hoje, ele entende que apenas aprende de forma diferente e a sua autoestima mudou completamente. Ele agora sonha em ser engenheiro."
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-850 rounded-full flex items-center justify-center border border-white/10 text-white font-bold text-xs uppercase">
                HM
              </div>
              <div>
                <p className="font-bold text-sm">Dra. Helena Matsinhe</p>
                <p className="text-xs text-slate-400">Mae e Beneficiaria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentario Video Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="text-center space-y-3">
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">Video</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Documentario</h3>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
