import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, GraduationCap, Loader2, Compass, Heart, Quote } from 'lucide-react';
import { getPillars, getActivities, getProjects } from '../services/projetosApi';
import { getBeneficiaryStories } from '../../beneficiarios/services/beneficiariosApi';
import ProjectCard from '../cards/ProjectCard';
import { useNavigate, Link } from 'react-router-dom';

export default function OQueFazemos() {
  const navigate = useNavigate();
  const [pillars, setPillars] = useState([]);
  const [activePillar, setActivePillar] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stories, setStories] = useState([]);
  
  const [loadingPillars, setLoadingPillars] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingStories, setLoadingStories] = useState(true);

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

    async function loadStories() {
      try {
        setLoadingStories(true);
        const data = await getBeneficiaryStories();
        // Limit to 4 for clean presentation on this page
        setStories((data || []).slice(0, 4));
      } catch (err) {
        console.error('Error loading beneficiary stories:', err);
      } finally {
        setLoadingStories(false);
      }
    }
    loadStories();
  }, []);

  useEffect(() => {
    if (!activePillar) return;
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        setProjects([]);
        const data = await getProjects({ pillarId: activePillar.id });
        setProjects(data || []);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, [activePillar]);

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      
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
          </motion.div>
        </div>
      </section>

      {/* Static Pillars List block - Redesigned to be Premium & Enterprise */}
      <section className="pt-16 px-6 md:px-12 lg:px-16 bg-transparent">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-brand-horizon uppercase tracking-[0.3em] block">
              Estrutura de Acao
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-brand-bigStone dark:text-white tracking-tight">
              Pilares Fundamentais da ALEM
            </h2>
            <div className="w-12 h-1 bg-brand-horizon mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar Card 1 */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.15)' }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-surface border border-brand-poloBlue/15 dark:border-dark-muted/10 rounded-[28px] p-8 space-y-6 relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              {/* Background gradient blur glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-horizon/5 rounded-full blur-2xl group-hover:bg-brand-horizon/10 transition-colors" />
              
              <div className="space-y-6 flex-grow">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-horizon/10 text-brand-horizon flex items-center justify-center font-bold">
                    <Compass size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <span className="font-mono text-3xl font-black text-brand-horizon/10 group-hover:text-brand-horizon/25 transition-colors">
                    01
                  </span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-horizon">Acesso e Inclusao</h4>
                  <p className="text-sm leading-relaxed text-brand-bigStone dark:text-dark-text font-medium">
                    Rastreamento e insercao das Pessoas com Necessidades Especiais em diferentes subsistemas de ensino
                  </p>
                </div>
              </div>
              <div className="w-8 h-1 bg-brand-horizon/20 group-hover:w-full transition-all duration-500 rounded-full mt-4" />
            </motion.div>

            {/* Pillar Card 2 */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.15)' }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-surface border border-brand-poloBlue/15 dark:border-dark-muted/10 rounded-[28px] p-8 space-y-6 relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-horizon/5 rounded-full blur-2xl group-hover:bg-brand-horizon/10 transition-colors" />

              <div className="space-y-6 flex-grow">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-horizon/10 text-brand-horizon flex items-center justify-center font-bold">
                    <GraduationCap size={22} className="group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                  <span className="font-mono text-3xl font-black text-brand-horizon/10 group-hover:text-brand-horizon/25 transition-colors">
                    02
                  </span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-horizon">Acompanhamento e Qualidade</h4>
                  <p className="text-sm leading-relaxed text-brand-bigStone dark:text-dark-text font-medium">
                    Garantir o Acompanhamento e a Qualidade de Ensino para Pessoas com Necessidades Especiais
                  </p>
                </div>
              </div>
              <div className="w-8 h-1 bg-brand-horizon/20 group-hover:w-full transition-all duration-500 rounded-full mt-4" />
            </motion.div>

            {/* Pillar Card 3 */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.15)' }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-surface border border-brand-poloBlue/15 dark:border-dark-muted/10 rounded-[28px] p-8 space-y-6 relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-horizon/5 rounded-full blur-2xl group-hover:bg-brand-horizon/10 transition-colors" />

              <div className="space-y-6 flex-grow">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-horizon/10 text-brand-horizon flex items-center justify-center font-bold">
                    <Users size={22} className="group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <span className="font-mono text-3xl font-black text-brand-horizon/10 group-hover:text-brand-horizon/25 transition-colors">
                    03
                  </span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-horizon">Insercao e Oportunidade</h4>
                  <p className="text-sm leading-relaxed text-brand-bigStone dark:text-dark-text font-medium">
                    Promover a Insercao no Mercado de Trabalho a Pessoas com Necessidades Especiais
                  </p>
                </div>
              </div>
              <div className="w-8 h-1 bg-brand-horizon/20 group-hover:w-full transition-all duration-500 rounded-full mt-4" />
            </motion.div>
          </div>
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
                  const displayTitle = pillar.name;

                  return (
                    <motion.button
                      key={pillar.id}
                      onClick={() => setActivePillar(pillar)}
                      whileHover={{ y: -2 }}
                      className={`p-6 rounded-2xl border text-left transition-all relative cursor-pointer ${
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

              {/* Projects Grid for selected Pilar */}
              <div className="pt-6 border-t border-brand-poloBlue/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Projetos Estrategicos deste Pilar
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

      {/* New Section: Historias de Beneficiarios */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-white dark:bg-dark-bg border-b border-brand-poloBlue/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
              Testemunhos Reais
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-white">
              Historias de Beneficiarios
            </h3>
            <p className="text-brand-eastBay dark:text-dark-muted text-sm max-w-xl mx-auto">
              A verdadeira medida da nossa missao e expressada nas conquistas daqueles que apoiamos todos os dias.
            </p>
          </div>

          {loadingStories ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-horizon" size={36} />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nenhuma historia registada de momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white dark:bg-dark-surface rounded-3xl border border-brand-poloBlue/15 dark:border-dark-muted/10 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <Quote className="absolute top-4 right-4 text-brand-poloBlue/20 w-8 h-8 pointer-events-none" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {story.image_url || story.image_data ? (
                        <img
                          src={story.image_data || story.image_url}
                          alt={story.full_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-brand-horizon"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-horizon/10 text-brand-horizon flex items-center justify-center font-bold">
                          {story.full_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-brand-bigStone dark:text-white text-sm line-clamp-1">{story.full_name}</h4>
                        <span className="text-[9px] uppercase tracking-wider text-brand-horizon font-bold">Beneficiario</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-eastBay dark:text-dark-muted leading-relaxed line-clamp-4 italic">
                      "{story.story}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-brand-poloBlue/10 mt-4 flex justify-between items-center">
                    <Link
                      to="/historias-beneficiarios"
                      className="text-xs font-bold text-brand-horizon hover:text-brand-bigStone transition-colors flex items-center gap-1"
                    >
                      Ler mais testemunhos <Quote size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-transparent text-brand-bigStone dark:text-dark-text overflow-hidden relative border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
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
