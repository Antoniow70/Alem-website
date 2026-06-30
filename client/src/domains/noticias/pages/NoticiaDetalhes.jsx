import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { getNewsById, getNews } from '../services/noticiasApi';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function NoticiaDetalhes() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [item, all] = await Promise.all([getNewsById(id), getNews()]);
        setNews(item);
        setRelated((all || []).filter(n => n.id !== id).slice(0, 3));
      } catch (err) {
        console.error('Erro ao carregar noticia:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-horizon" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-6">
        <h2 className="text-2xl font-bold text-brand-bigStone dark:text-dark-text mb-4">Noticia nao encontrada</h2>
        <Link to="/destaques" className="btn-primary px-6 py-2 text-sm">Voltar a Destaques</Link>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen">
      {/* Hero Header */}
      <section className="relative text-white pt-32 pb-20 px-6 overflow-hidden bg-brand-bigStone">
        <div className="absolute inset-0 z-0">
          {(news.capa_url || news.capa_data) && (
            <img
              src={news.capa_data || news.capa_url}
              alt={news.title}
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/destaques"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} />
              Voltar a Destaques
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-brand-horizon" />
                {formatDate(news.news_date)}
              </span>
              {news.created_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} className="text-brand-horizon" />
                  Publicada em {formatDate(news.created_at)}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {news.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 -mt-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-dark-surface rounded-3xl shadow-xl border border-brand-poloBlue/10 dark:border-dark-muted/10 overflow-hidden"
          >
            {/* Cover Image */}
            {(news.capa_url || news.capa_data) && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={news.capa_data || news.capa_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Text Body */}
            <div className="p-8 md:p-12 space-y-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {news.description.split('\n').map((paragraph, i) => (
                  paragraph.trim() ? (
                    <p key={i} className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-base mb-4">
                      {paragraph}
                    </p>
                  ) : <br key={i} />
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related News */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
          <h2 className="text-xl font-extrabold text-brand-bigStone dark:text-dark-text tracking-tight">
            Outras Noticias
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link
                  to={`/noticias/${item.id}`}
                  className="group block bg-white dark:bg-dark-surface rounded-2xl border border-brand-poloBlue/10 dark:border-dark-muted/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {(item.capa_url || item.capa_data) && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.capa_data || item.capa_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold text-brand-horizon uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(item.news_date)}
                    </span>
                    <h3 className="text-sm font-bold text-brand-bigStone dark:text-dark-text line-clamp-2 group-hover:text-brand-horizon transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-eastBay dark:text-dark-muted line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[10px] font-bold text-brand-horizon flex items-center gap-1 pt-1">
                      Ler mais <ChevronRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
