import { motion, AnimatePresence } from 'motion/react';
import { History, Target, Users, Award, UserCircle, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import TeamMemberCard from '../components/TeamMemberCard';

import { supabase } from '../lib/supabase';

export default function QuemSomos() {
  const [team, setTeam] = useState([]);
  const [flippedId, setFlippedId] = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase.from('team').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setTeam(data);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative text-white pt-28 pb-12 px-4 overflow-hidden bg-slate-900">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="Imagem/quem somos nos.jpg"
            alt="Quem Somos"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/45 to-slate-950/20" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Quem Somos</h1>
            <p className="text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Uma associacao sem fins lucrativos comprometida com o futuro das criancas mocambicanas, focada na inclusao e no direito a educacao de qualidade para todos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="pt-8 pb-4 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              A Nossa Historia
            </span>
            <h2 className="text-4xl font-bold text-[#14213D] leading-tight">
              A Associacao Lacos Especiais de Mocambique (ALEM)
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
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
              className="rounded-[40px] shadow-2xl w-full aspect-[4/3] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="pt-4 pb-4 px-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Missao',
              desc: 'Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.',
              icon: <Target className="text-blue-600" />,
              color: 'bg-white border border-slate-200'
            },
            {
              title: 'Visao',
              desc: 'Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.',
              icon: <Award className="text-green-600" />,
              color: 'bg-white border border-slate-200'
            },
            {
              title: 'Valores',
              desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.',
              icon: <Users className="text-purple-600" />,
              color: 'bg-white border border-slate-200'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`${item.color} p-10 rounded-[32px] space-y-6 shadow-lg transition-all duration-300`}
            >
              <div className="w-14 h-14 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#14213D]">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="pb-24 pt-8 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-left space-y-4">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                A Nossa Equipa
              </span>
              <h3 className="text-4xl font-bold text-[#14213D]">Membros</h3>
              <p className="text-slate-500 text-base">Clique em saber mais para conhecer o membro.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
          </div>
        </section>
      )}
    </div>
  );
}
