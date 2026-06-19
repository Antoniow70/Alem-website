import { motion } from 'motion/react';
import { Target, Users, Award, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import TeamMemberCard from '../../components/cards/TeamMemberCard';
import { getTeam, getPartners } from '../../services/adminService';

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
    <div className={isSection ? "" : "bg-slate-50 min-h-screen"}>
      {/* Header */}
      {!isSection && (
        <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-slate-900">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="Imagem/quem somos nos.jpg"
              alt="Quem Somos"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Quem Somos
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                Nossa Historia e Valores
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Uma associacao sem fins lucrativos comprometida com o futuro das criancas mocambicanas, focada na inclusao e no direito a educacao de qualidade para todos.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              A Nossa Historia
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              A Associacao Lacos Especiais de Mocambique (ALEM)
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
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
              src="Imagem/nossa historia.jpg"
              alt="Equipa ALEM - A nossa historia"
              className="rounded-2xl shadow-md w-full aspect-[4/3] object-cover border border-slate-100"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth scrollbar-none pb-6 md:grid md:grid-cols-3 md:gap-8 md:pb-0">
          {[
            {
              title: 'Missao',
              desc: 'Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.',
              icon: <Target className="text-blue-600 w-8 h-8" />,
              color: 'bg-blue-50/50 border border-slate-100'
            },
            {
              title: 'Visao',
              desc: 'Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.',
              icon: <Award className="text-emerald-600 w-8 h-8" />,
              color: 'bg-emerald-50/30 border border-slate-100'
            },
            {
              title: 'Valores',
              desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.',
              icon: <Users className="text-indigo-600 w-8 h-8" />,
              color: 'bg-indigo-50/30 border border-slate-100'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`${item.color} p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 bg-white w-[85%] sm:w-[45%] md:w-full shrink-0 snap-center`}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20 px-6 md:px-12 lg:px-16 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-left space-y-3">
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                A Nossa Equipa
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Membros</h3>
              <p className="text-slate-500 text-sm">Clique em saber mais para conhecer o membro.</p>
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
      {!isSection && partners.length > 0 && (
        <section className="py-16 px-6 md:px-12 lg:px-16 bg-slate-950">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] block">
                Parcerias de Confianca
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Instituicoes que Apoiam a Nossa Causa
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center pt-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="w-full max-w-[170px] bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 flex items-center justify-center transition-all duration-300"
                >
                  <img
                    src={partner.logo_url || partner.logo_data || 'https://via.placeholder.com/150'}
                    alt={partner.name}
                    className="max-h-12 max-w-full object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
