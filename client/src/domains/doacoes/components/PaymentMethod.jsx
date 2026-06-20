import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, CheckCircle2 } from 'lucide-react';

export default function PaymentMethod({ type, title, value, instructions, icon, color }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${color}`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-[#14213D] mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 px-4">{instructions}</p>
      
      <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 group">
        <span className="font-mono font-bold text-slate-700 truncate mr-2">{value}</span>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-blue-600"
          title="Copiar"
        >
          {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
        </button>
      </div>

      {type === 'mpesa' && (
        <div className="mt-6 pt-6 border-t border-slate-50 w-full">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Passo a Passo
          </div>
          <ol className="text-[11px] text-slate-500 mt-3 text-left space-y-1">
            <li>1. Digite *150#</li>
            <li>2. Selecione Transferir Dinheiro</li>
            <li>3. Digite o numero acima</li>
            <li>4. Confirme o valor e PIN</li>
          </ol>
        </div>
      )}

      {type === 'emola' && (
        <div className="mt-6 pt-6 border-t border-slate-50 w-full">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Passo a Passo
          </div>
          <ol className="text-[11px] text-slate-500 mt-3 text-left space-y-1">
            <li>1. Digite *155#</li>
            <li>2. Selecione Transferir Dinheiro</li>
            <li>3. Digite o numero acima</li>
            <li>4. Confirme o valor e PIN</li>
          </ol>
        </div>
      )}

      {type === 'bank' && (
        <div className="mt-6 pt-6 border-t border-slate-50 w-full">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Passo a Passo
          </div>
          <ol className="text-[11px] text-slate-500 mt-3 text-left space-y-1">
            <li>1. Use o App ou ATM</li>
            <li>2. Selecione Transferencia</li>
            <li>3. Digite o NIB/IBAN acima</li>
            <li>4. Confirme o Titular: ALEM</li>
          </ol>
        </div>
      )}
    </motion.div>
  );
}
