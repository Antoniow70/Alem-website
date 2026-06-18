import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

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
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      title: 'Transferencia Bancaria',
      number: 'MZ59 0000 0000 0000 0000 0 (Millennium BIM)',
      instruction: 'Envie o comprovativo para info@alem.mz'
    },
    'mpesa': {
      icon: <Smartphone className="w-6 h-6 text-red-600" />,
      title: 'M-Pesa',
      number: '84 000 0000',
      instruction: 'Transferencia direta via menu *150#'
    },
    'cartao': {
      icon: <CreditCard className="w-6 h-6 text-slate-700" />,
      title: 'Cartao de Credito',
      number: 'Redirecionamento Seguro',
      instruction: 'Ira ser redirecionado para o portal de pagamentos apos confirmar.'
    }
  };

  const [causas, setCausas] = useState(['Geral / Onde for mais necessario']);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.from('projects').select('name').order('created_at', { ascending: false });
        if (data) {
          setCausas([...data.map(p => p.name), 'Geral / Onde for mais necessario']);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    }
    fetchProjects();

    const handleStorageChange = (e) => {
      if (e.key === 'alem_projects_db') {
        fetchProjects();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
        const { error } = await supabase.from('donations').insert([{
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          causa: formData.causa,
          valor: parseFloat(formData.valor),
          mensagem: formData.mensagem,
          metodo_pagamento: formData.metodoPagamento,
          status: 'Pendente',
        }]);
        
        if (error) throw error;
        
        // Dispatch storage event to update the UI on other tabs if using mock mode
        window.dispatchEvent(new Event('storage'));
        
        setIsSubmitted(true);
      } catch (err) {
        console.error('Error saving donation:', err);
        alert('Ocorreu um erro ao submeter a sua doacao. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="relative text-white py-28 px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="Imagem/Doar.jpg"
            alt="Doacao"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/45 to-slate-950/20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center rounded-full bg-blue-50/10 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
            Apoie a Nossa Missao
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            Cada doacao e<br />uma vida transformada
          </h1>
          <p className="text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            A sua contribuicao e o motor que nos permite continuar a apoiar centenas de criancas. Junte-se a nos nesta causa.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-6 md:p-12 border border-slate-100">

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 space-y-6"
              >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-8">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Obrigado pela sua Doacao!</h2>
                <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                  A sua generosidade fara a diferenca na vida de muitas criancas. Recebera um email com os detalhes e o recibo da sua contribuicao.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ nome: '', email: '', telefone: '', causa: '', valor: '', mensagem: '', metodoPagamento: '' });
                  }}
                  className="mt-8 btn-ghost"
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
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900">Preencha o Formulario</h2>
                  <p className="text-slate-500 mt-2">Os seus dados estao seguros e encriptados.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nome Completo *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border ${errors.nome ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-brand-primary'} rounded-xl px-5 py-3 focus:outline-none focus:ring-2 transition-all`}
                      placeholder="Introduza o seu nome"
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-brand-primary'} rounded-xl px-5 py-3 focus:outline-none focus:ring-2 transition-all`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Contacto Telefonico */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Contacto Telefonico *</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border ${errors.telefone ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-brand-primary'} rounded-xl px-5 py-3 focus:outline-none focus:ring-2 transition-all`}
                      placeholder="+258 8X XXX XXXX"
                    />
                    {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
                  </div>

                  {/* Causa a Apoiar */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Causa a Apoiar *</label>
                    <select
                      name="causa"
                      value={formData.causa}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border ${errors.causa ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-brand-primary'} rounded-xl px-5 py-3 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Selecione uma causa</option>
                      {causas.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.causa && <p className="text-red-500 text-xs mt-1">{errors.causa}</p>}
                  </div>

                  {/* Valor da Doacao */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Valor da Doacao (MZN) *</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">MT</span>
                      <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border ${errors.valor ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-brand-primary'} rounded-xl pl-14 pr-5 py-3 focus:outline-none focus:ring-2 transition-all text-lg font-bold text-slate-800`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.valor && <p className="text-red-500 text-xs mt-1">{errors.valor}</p>}
                  </div>

                  {/* Metodo de Pagamento */}
                  <div className="space-y-4 md:col-span-2 mt-4">
                    <label className="text-sm font-bold text-slate-700">Metodo de Pagamento *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(paymentDetails).map(([key, details]) => (
                        <div
                          key={key}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, metodoPagamento: key }));
                            if (errors.metodoPagamento) setErrors(prev => ({ ...prev, metodoPagamento: '' }));
                          }}
                          className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border-2 transition-all ${formData.metodoPagamento === key ? 'border-brand-primary bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                              {details.icon}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">{details.title}</span>
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
                                <div className="pt-3 mt-3 border-t border-slate-200/60">
                                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Numero</p>
                                  <p className="font-bold text-brand-primary text-sm break-words">{details.number}</p>
                                  <p className="text-xs text-slate-500 mt-2">{details.instruction}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                    {errors.metodoPagamento && <p className="text-red-500 text-xs mt-1">{errors.metodoPagamento}</p>}
                  </div>

                  {/* Mensagem Opcional */}
                  <div className="space-y-2 md:col-span-2 mt-4">
                    <label className="text-sm font-bold text-slate-700">Mensagem (Opcional)</label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                      placeholder="Gostaria de deixar alguma mensagem ou observacao?"
                    />
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <p className="text-sm text-slate-500">
                    Ao confirmar, aceita os nossos <a href="#" className="text-brand-primary hover:underline">Termos de Doacao</a>.
                  </p>
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto text-lg px-8 py-4"
                  >
                    Confirmar Doacao <ArrowRight size={20} />
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
