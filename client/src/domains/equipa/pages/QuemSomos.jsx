import { motion } from 'motion/react';
import { Target, Users, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import TeamMemberCard from '../cards/TeamMemberCard';
import { getTeam } from '../services/equipaApi';
import { getDocuments } from '../services/documentosApi';

export default function QuemSomos() {
  const [team, setTeam] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [flippedId, setFlippedId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [teamData, docsData] = await Promise.all([
          getTeam(),
          getDocuments()
        ]);
        setTeam(teamData || []);
        setDocuments(docsData || []);
      } catch (err) {
        console.error('Error fetching QuemSomos data:', err);
      }
    }
    loadData();
  }, []);

  const handleDownload = async (e, url, title) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Error downloading document:', err);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      
      {/* Header */}
      <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/quem somos nos.jpg"
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
            <span className="inline-flex items-center rounded-lg bg-brand-horizon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Quem Somos
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Nossa Historia e Valores
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-transparent border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
              A Nossa Historia
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text leading-tight">
              A Associacao Lacos Especiais de Mocambique (ALEM)
            </h2>
            <div className="space-y-4 text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
              <p>
                E uma organizacao nao governamental, que surgiu de uma iniciativa de estudantes da Universidade Zambeze em Julho de 2021, com a finalidade de responder aos principais desafios dos estudantes com necessidades especiais da Faculdade de Ciencias Sociais e Humanidades (FCSH).
              </p>
              <p>
                Das dificuldades partilhadas pelos mesmos, os pontos comuns foram: falta de condicoes (financeiras, infraestruturas, humanas) para a educacao inclusiva; falta de oportunidade no mercado laboral e ausencia da sensibilizacao em relacao ao direito a educacao inclusiva das pessoas com necessidades especiais. Em virtude das reflexoes, surgiu a ideia da criacao de sinergias para ajudar os individuos com qualquer tipo de "deficiencia". Para tal, optou-se por eleger a educacao como veiculo da mudanca.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/membrosAlem.jpg"
              alt="Equipa ALEM - A nossa historia"
              className="rounded-2xl shadow-md w-full aspect-[4/3] object-cover border border-brand-poloBlue/20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-b border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Missao',
              desc: 'Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.',
              icon: <Target className="text-brand-horizon w-8 h-8" />
            },
            {
              title: 'Visao',
              desc: 'Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.',
              icon: <Award className="text-brand-horizon w-8 h-8" />
            },
            {
              title: 'Valores',
              desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.',
              icon: <Users className="text-brand-horizon w-8 h-8" />
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white/40 dark:bg-dark-surface/40 border border-brand-poloBlue/20 dark:border-dark-muted/10 p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 backdrop-blur-xs"
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

      {/* Documentos Institucionais Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-white dark:bg-dark-bg border-b border-brand-poloBlue/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-3">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
              Transparencia
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text">Documentos Institucionais</h3>
            <p className="text-brand-eastBay dark:text-dark-muted text-sm">Aceda e faca o download dos nossos relatorios, estatutos e outros documentos oficiais.</p>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-medium">
              Nenhum documento disponivel de momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-brand-poloBlue/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-poloBlue/15 flex items-center justify-center text-brand-horizon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-bigStone dark:text-dark-text text-base mb-1">{doc.title}</h4>
                      <p className="text-brand-eastBay dark:text-dark-muted text-xs leading-relaxed line-clamp-3">{doc.description || 'Sem descricao adicional.'}</p>
                    </div>
                  </div>
                  {(doc.file_url || doc.file_data) && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={(e) => handleDownload(e, doc.file_data || doc.file_url, doc.title)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-horizon hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Descarregar Documento <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20 px-6 md:px-12 lg:px-16 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-left space-y-3">
              <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
                A Nossa Equipa
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text">Membros</h3>
              <p className="text-brand-eastBay dark:text-dark-muted text-sm">Clique em saber mais para conhecer o membro.</p>
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
