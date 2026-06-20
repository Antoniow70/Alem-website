import { motion } from 'motion/react';
import { Target, Users, Award, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import TeamMemberCard from '../cards/TeamMemberCard';
import { getTeam } from '../services/equipaApi';
import { getPartners, Partners } from '../../parceiros';

export default function QuemSomos({ isSection = false }) {
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [flippedId, setFlippedId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [teamData, partnersData] = await Promise.all([
          getTeam(),
          getPartners()
        ]);
        setTeam(teamData || []);
        setPartners(partnersData || []);
      } catch (err) {
        console.error('Error fetching QuemSomos data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className={isSection ? "" : "bg-transparent min-h-screen"}>
      {/* Header */}
      {!isSection && (
        <section className="relative pt-32 pb-16 px-6 overflow-hidden text-brand-bigStone dark:text-dark-text bg-transparent">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/quem somos nos.jpg"
              alt="Quem Somos"
              className="w-full h-full object-cover opacity-20 dark:opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-poloBlue/10 via-transparent to-brand-poloBlue/15 dark:from-dark-bg/85 dark:via-dark-bg/70 dark:to-dark-bg" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 dark:bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-horizon dark:text-white">
                Quem Somos
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-brand-bigStone dark:text-white">
                Nossa Historia e Valores
              </h1>
              <p className="text-base md:text-lg text-brand-eastBay dark:text-dark-muted max-w-2xl mx-auto leading-relaxed">
                Uma associacao sem fins lucrativos comprometida com o futuro das criancas mocambicanas, focada na inclusao e no direito a educacao de qualidade para todos.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-transparent border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 dark:bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-horizon dark:text-white">
              A Nossa Historia
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text leading-tight">
              A Associacao Lacos Especiais de Mocambique (ALEM)
            </h2>
            <div className="space-y-4 text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
              <p>
                E uma organizacao nao governamental, que surgiu em uma iniciativa de estudantes da Universidade Zambeze em Julho de 2021, com a finalidade de responder aos principais desafios dos estudantes com necessidades especiais da Faculdade de Ciencias Sociais e Humanidades (FCSH).
              </p>
              <p>
                Das dificuldades partilhadas pelos mesmos, os pontos comuns foram: falta de condicoes (financeiras, infraestruturas, humanas) para a educacao inclusiva; falta de oportunidade no mercado laboral e ausencia da sensibilizacao em relacao ao direito a educacao inclusiva das pessoas com necessidades especiais. Em virtude das reflexoes, surgiu a ideia da criacao de sinergias para ajudar os individuos com qualquer tipo de "deficiencia". Para tal, optou-se por eleger a educacao como veiculo da mudanca.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/nossa historia.jpg"
              alt="Equipa ALEM - A nossa historia"
              className="rounded-2xl shadow-md w-full aspect-[4/3] object-cover border border-brand-poloBlue/20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth scrollbar-none pb-6 md:grid md:grid-cols-3 md:gap-8 md:pb-0">
          {[
            {
              title: 'Missao',
              desc: 'Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.',
              icon: <Target className="text-brand-horizon w-8 h-8" />
            },
            {
              title: 'Visao',
              desc: 'Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.',
              icon: <Award className="text-feedback-success w-8 h-8" />
            },
            {
              title: 'Valores',
              desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.',
              icon: <Users className="text-brand-eastBay w-8 h-8" />
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white/40 dark:bg-dark-surface/40 border border-brand-poloBlue/20 dark:border-dark-muted/10 p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 w-[85%] sm:w-[45%] md:w-full shrink-0 snap-center backdrop-blur-xs"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-poloBlue/15 dark:bg-dark-bg/60">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">{item.title}</h3>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20 px-6 md:px-12 lg:px-16 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-left space-y-3">
              <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 dark:bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-horizon dark:text-white">
                A Nossa Equipa
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text">Membros</h3>
              <p className="text-brand-eastBay dark:text-dark-muted text-sm">Clique em saber mais para conhecer o membro.</p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth scrollbar-none pb-6 md:grid md:grid-cols-4 md:gap-8 md:pb-0">
              {team.map((person, i) => (
                <div key={person.id} className="w-[85%] sm:w-[45%] md:w-full shrink-0 snap-center">
                  <TeamMemberCard 
                    person={person}
                    index={i}
                    isFlipped={flippedId === person.id}
                    onToggle={() => setFlippedId(flippedId === person.id ? null : person.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      {!isSection && (
        <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
          <div className="max-w-7xl mx-auto">
            <Partners />
          </div>
        </section>
      )}
    </div>
  );
}
