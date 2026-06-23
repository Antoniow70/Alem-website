import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProjects } from '../../projetos';
import { submitDonation } from '../services/doacoesApi';

export default function Doar() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    causa: '',
    valor: '',
    mensagem: '',
    metodoPagamento: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const paymentDetails = {
    'transferencia': {
      icon: <Building2 className="w-6 h-6 text-brand-horizon" />,
      title: 'Transferencia Bancaria',
      number: 'MZ59 0000 0000 0000 0000 0 (Millennium BIM)',
      instruction: 'Envie o comprovativo para info@alem.mz'
    },
    'mpesa': {
      icon: <Smartphone className="w-6 h-6 text-feedback-error" />,
      title: 'M-Pesa',
      number: '84 000 0000',
      instruction: 'Transferencia direta via menu *150#'
    },
    'cartao': {
      icon: <CreditCard className="w-6 h-6 text-brand-eastBay dark:text-dark-text" />,
      title: 'Cartao de Credito',
      number: 'Redirecionamento Seguro',
      instruction: 'Ira ser redirecionado para o portal de pagamentos apos confirmar.'
    }
  };

  const [causas, setCausas] = useState(['Geral']);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        if (data) {
          setCausas(['Geral', ...data.map(p => p.name)]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    }
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome completo e obrigatorio';
    if (!formData.email.trim()) newErrors.email = 'Email e obrigatorio';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email invalido';
    if (!formData.telefone.trim()) newErrors.telefone = 'Contacto telefonico e obrigatorio';
    if (!formData.causa) newErrors.causa = 'Selecione uma causa a apoiar';
    if (!formData.valor.trim() || isNaN(formData.valor) || Number(formData.valor) <= 0) newErrors.valor = 'Insira um valor valido';
    if (!formData.metodoPagamento) newErrors.metodoPagamento = 'Selecione um metodo de pagamento';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const paymentMap = {
          'mpesa': 'M-Pesa',
          'transferencia': 'Transferencia Bancaria',
          'cartao': 'Cartao'
        };
        
        await submitDonation({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          causa: formData.causa,
          valor: parseFloat(formData.valor),
          mensagem: formData.mensagem,
          metodo_pagamento: paymentMap[formData.metodoPagamento] || formData.metodoPagamento
        });
        
        setIsSubmitted(true);
      } catch (err) {
        console.error('Error saving donation:', err);
        alert('Ocorreu um erro ao submeter a sua doacao. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="bg-brand-poloBlue/15 min-h-screen pb-24">
      <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Doar.jpg"
            alt="Doacao"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="inline-flex items-center rounded-lg bg-brand-horizon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Apoie a Nossa Missao
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Cada doacao e uma vida transformada
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A sua contribuicao e o motor que nos permite continuar a apoiar centenas de criancas. Junte-se a nos nesta causa.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 border border-brand-poloBlue/20">

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-feedback-successLight text-feedback-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-brand-bigStone">Obrigado pela sua Doacao!</h2>
                <p className="text-brand-bigStone max-w-md mx-auto leading-relaxed text-sm">
                  A sua generosidade fara a diferenca na vida de muitas criancas. Recebera um email com os detalhes e o recibo da sua contribuicao.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ nome: '', email: '', telefone: '', causa: '', valor: '', mensagem: '', metodoPagamento: '' });
                  }}
                  className="mt-6 btn-ghost"
                >
                  Fazer nova doacao
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-brand-bigStone">Preencha o Formulario</h2>
                  <p className="text-brand-bigStone text-xs mt-1">Os seus dados estao seguros e encriptados.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nome Completo */}
                  <div className="space-y-1">
                    <label className="form-label !text-brand-bigStone">Nome Completo *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={`form-input ${errors.nome ? 'border-feedback-error focus:ring-feedback-error/10 focus:border-feedback-error' : ''}`}
                      placeholder="Introduza o seu nome"
                    />
                    {errors.nome && <p className="text-feedback-error text-[11px] mt-1">{errors.nome}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="form-label !text-brand-bigStone">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'border-feedback-error focus:ring-feedback-error/10 focus:border-feedback-error' : ''}`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && <p className="text-feedback-error text-[11px] mt-1">{errors.email}</p>}
                  </div>

                  {/* Contacto Telefonico */}
                  <div className="space-y-1">
                    <label className="form-label !text-brand-bigStone">Contacto Telefonico *</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={`form-input ${errors.telefone ? 'border-feedback-error focus:ring-feedback-error/10 focus:border-feedback-error' : ''}`}
                      placeholder="+258 8X XXX XXXX"
                    />
                    {errors.telefone && <p className="text-feedback-error text-[11px] mt-1">{errors.telefone}</p>}
                  </div>

                  {/* Causa a Apoiar */}
                  <div className="space-y-1">
                    <label className="form-label !text-brand-bigStone">Causa a Apoiar *</label>
                    <div className="relative">
                      <select
                        name="causa"
                        value={formData.causa}
                        onChange={handleChange}
                        className={`form-input appearance-none cursor-pointer pr-10 ${errors.causa ? 'border-feedback-error focus:ring-feedback-error/10 focus:border-feedback-error' : ''}`}
                      >
                        <option value="" disabled>Selecione uma causa</option>
                        {causas.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    {errors.causa && <p className="text-feedback-error text-[11px] mt-1">{errors.causa}</p>}
                  </div>

                  {/* Valor da Doacao */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="form-label !text-brand-bigStone">Valor da Doacao (MZN) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">MT</span>
                      <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className={`form-input pl-12 text-base font-bold text-brand-bigStone dark:text-dark-text ${errors.valor ? 'border-feedback-error focus:ring-feedback-error/10 focus:border-feedback-error' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.valor && <p className="text-feedback-error text-[11px] mt-1">{errors.valor}</p>}
                  </div>

                  {/* Metodo de Pagamento */}
                  <div className="space-y-3 md:col-span-2 mt-2">
                    <label className="form-label !text-brand-bigStone">Metodo de Pagamento *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(paymentDetails).map(([key, details]) => (
                        <div
                          key={key}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, metodoPagamento: key }));
                            if (errors.metodoPagamento) setErrors(prev => ({ ...prev, metodoPagamento: '' }));
                          }}
                          className={`relative flex flex-col p-4 cursor-pointer rounded-xl border transition-all ${
                            formData.metodoPagamento === key
                              ? 'border-brand-primary bg-brand-poloBlue/20 ring-2 ring-brand-primary/10 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-brand-poloBlue/15'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <div className="p-1.5 bg-brand-poloBlue/15 rounded-lg border border-brand-poloBlue/20">
                              {details.icon}
                            </div>
                            <span className="font-bold text-brand-bigStone text-xs">{details.title}</span>
                          </div>

                          {/* Expanded Details when selected */}
                          <AnimatePresence>
                            {formData.metodoPagamento === key && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 mt-3 border-t border-slate-200/60 text-left">
                                  <p className="text-[9px] text-brand-bigStone uppercase tracking-wider font-semibold mb-0.5 opacity-70">Dados da Conta</p>
                                  <p className="font-bold text-brand-bigStone text-xs break-all leading-tight">{details.number}</p>
                                  <p className="text-[10px] text-brand-bigStone mt-1.5 leading-snug opacity-80">{details.instruction}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                    {errors.metodoPagamento && <p className="text-feedback-error text-[11px] mt-1">{errors.metodoPagamento}</p>}
                  </div>

                  {/* Mensagem Opcional */}
                  <div className="space-y-1 md:col-span-2 mt-2">
                    <label className="form-label !text-brand-bigStone">Mensagem (Opcional)</label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows="3"
                      className="form-input resize-none h-20"
                      placeholder="Gostaria de deixar alguma mensagem ou observacao?"
                    />
                  </div>

                </div>

                <div className="pt-6 border-t border-brand-poloBlue/20 flex items-center justify-between flex-wrap gap-4 mt-6">
                  <p className="text-xs text-brand-bigStone leading-normal max-w-sm">
                    Ao confirmar, aceita os nossos <a href="#" className="text-brand-horizon hover:underline">Termos de Doacao</a>.
                  </p>
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto text-sm px-6 py-3"
                  >
                    Confirmar Doacao <ArrowRight size={16} />
                  </button>
                </div>

              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </section>
    </div>
  );
}
