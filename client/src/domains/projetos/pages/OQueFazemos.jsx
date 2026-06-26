import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, GraduationCap, Loader2 } from 'lucide-react';
import { getPillars, getActivities, getProjects } from '../services/projetosApi';
import ProjectCard from '../cards/ProjectCard';
import { useNavigate } from 'react-router-dom';

const exactPillarTitles = [
  "Rastreamento e insercao das pessoas com necessidades especiais em diferentes subsistemas.",
  "Garantir o acompanhamento e a qualidade de ensino para pessoas com necessidades especiais.",
  "Promover a insercao no mercado de trabalho a pessoas com necessidades especiais."
];

export default function OQueFazemos() {
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
    <div className="bg-transparent min-h-screen">
      
      {/* Header */}
      <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/O que fazemos.jpg"
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
            <span className="inline-flex items-center rounded-lg bg-brand-horizon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
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

      {/* Static Pillars List block exactly as requested */}
      <section className="pt-16 px-6 md:px-12 lg:px-16 bg-transparent">
        <div className="max-w-4xl mx-auto bg-white dark:bg-dark-surface rounded-[32px] p-8 md:p-10 border border-brand-poloBlue/20 shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-brand-bigStone dark:text-dark-text border-b border-slate-100 pb-4">
            Pilares da ALEM
          </h3>
          <ul className="space-y-4 text-brand-eastBay dark:text-dark-muted font-medium">
            <li className="flex items-start gap-3 text-sm md:text-base leading-relaxed">
              <span className="text-brand-horizon text-lg mt-0.5 shrink-0">➢</span>
              <span>Rastreamento e insercao das pessoas com necessidades especiais em diferentes subsistemas.</span>
            </li>
            <li className="flex items-start gap-3 text-sm md:text-base leading-relaxed">
              <span className="text-brand-horizon text-lg mt-0.5 shrink-0">➢</span>
              <span>Garantir o acompanhamento e a qualidade de ensino para pessoas com necessidades especiais.</span>
            </li>
            <li className="flex items-start gap-3 text-sm md:text-base leading-relaxed">
              <span className="text-brand-horizon text-lg mt-0.5 shrink-0">➢</span>
              <span>Promover a insercao no mercado de trabalho a pessoas com necessidades especiais.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Dynamic Pillars, Activities, and Projects Section */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-b border-brand-poloBlue/20">
        <div className="max-w-7xl mx-auto space-y-12">
          {loadingPillars ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-brand-horizon" size={36} />
              <p className="text-brand-eastBay dark:text-dark-muted text-sm mt-3">A carregar os pilares estrategicos...</p>
            </div>
          ) : (
            <>
              {/* Pillars Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pillars.map((pillar, i) => {
                  const icons = [<GraduationCap size={24} />, <BookOpen size={24} />, <Users size={24} />];
                  const isActive = activePillar?.id === pillar.id;
                  const displayTitle = exactPillarTitles[i] || pillar.name;

                  return (
                    <motion.button
                      key={pillar.id}
                      onClick={() => setActivePillar(pillar)}
                      whileHover={{ y: -2 }}
                      className={`p-6 rounded-2xl border text-left transition-all relative ${
                        isActive
                          ? 'border-brand-horizon bg-brand-poloBlue/20 shadow-md shadow-brand-horizon/5'
                          : 'border-brand-poloBlue/20 bg-transparent hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-brand-horizon text-white' : 'bg-brand-poloBlue/10 text-brand-horizon dark:text-brand-poloBlue'}`}>
                          {icons[i % icons.length]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-brand-bigStone dark:text-dark-text text-sm md:text-base leading-snug">
                            {displayTitle}
                          </h4>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Activities Bar under selected Pilar */}
              <div className="pt-6 border-t border-brand-poloBlue/20">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Areas de Atividade do Pilar Selecionado
                </h4>
                {loadingActivities ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="animate-spin text-brand-horizon" size={16} />
                    <span className="text-brand-eastBay dark:text-dark-muted text-xs">A carregar atividades...</span>
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
                              ? 'bg-brand-horizon text-white shadow-sm'
                              : 'bg-transparent hover:bg-brand-poloBlue/20 text-brand-eastBay dark:text-dark-muted hover:text-brand-bigStone dark:text-dark-text border border-brand-poloBlue/20'
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
              <div className="pt-6 border-t border-brand-poloBlue/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Projetos em "{activeActivity?.name || 'Selecione uma atividade'}"
                  </h4>
                </div>
                {loadingProjects ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-brand-horizon" size={32} />
                    <p className="text-brand-eastBay dark:text-dark-muted text-xs mt-2">A carregar iniciativas...</p>
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
                  <div className="text-center py-16 bg-transparent/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-brand-eastBay dark:text-dark-muted text-sm font-semibold">Sem projetos associados de momento</p>
                    <p className="text-slate-400 text-xs mt-1">Brevemente teremos novas iniciativas a decorrer nesta area.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-transparent text-brand-bigStone dark:text-dark-text overflow-hidden relative border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-horizon">
              O Nosso Impacto
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-brand-bigStone dark:text-white">
              O nosso impacto vai alem dos numeros. E sobre vidas transformadas.
            </h2>
            <p className="text-brand-eastBay dark:text-dark-muted text-sm md:text-base leading-relaxed">
              Cada crianca que aprende a ler apesar da dislexia, ou que consegue focar-se na aula com estrategias para TDAH, representa uma vitoria para toda a comunidade.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-feedback-success">85%</p>
                <p className="text-xs text-brand-eastBay/70 dark:text-dark-muted uppercase font-semibold tracking-wider mt-1">Melhoria Escolar</p>
              </div>
              <div>
                <p className="text-4xl font-black text-brand-poloBlue">92%</p>
                <p className="text-xs text-brand-eastBay/70 dark:text-dark-muted uppercase font-semibold tracking-wider mt-1">Satisfacao Familiar</p>
              </div>
            </div>
          </div>
          <div className="bg-transparent/40 dark:bg-dark-surface/40 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-brand-poloBlue/20 dark:border-dark-muted/10 shadow-lg">
            <blockquote className="text-base md:text-lg italic text-brand-eastBay dark:text-dark-text leading-relaxed">
              "Antes da ALEM, o meu filho era visto como 'preguicoso'. Hoje, ele entende que apenas aprende de forma diferente e a sua autoestima mudou completamente. Ele agora sonha em ser engenheiro."
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-poloBlue/15 dark:bg-dark-bg rounded-full flex items-center justify-center border border-brand-poloBlue/20 dark:border-dark-muted/10 text-brand-horizon dark:text-white font-bold text-xs uppercase">
                HM
              </div>
              <div>
                <p className="font-bold text-sm text-brand-bigStone dark:text-white">Dra. Helena Matsinhe</p>
                <p className="text-xs text-brand-eastBay dark:text-dark-muted">Mae e Beneficiaria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
