import PaymentMethod from '../components/PaymentMethod';
import { CreditCard, Smartphone } from 'lucide-react';

export default function MeiosFinanciamento() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-primary-dark via-brand-primary to-slate-950 text-white py-28 px-4 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-brand-primary-light/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-brand-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl font-bold tracking-tight">Como Ajudar</h1>
          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            A sua contribuição é o motor que nos permite continuar a apoiar centenas de crianças. Escolha o método mais conveniente para si.
          </p>
        </div>
      </section>

      {/* Payment Methods Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <PaymentMethod
            type="mpesa"
            title="M-Pesa"
            value="84 000 0000"
            instructions="Transferência direta via menu *150#"
            icon={<Smartphone size={32} />}
            color="bg-red-600"
          />
          <PaymentMethod
            type="emola"
            title="e-Mola"
            value="87 000 0000"
            instructions="Transferência direta via menu *155#"
            icon={<Smartphone size={32} />}
            color="bg-orange-500"
          />
          <PaymentMethod
            type="bank"
            title="Conta Bancária"
            value="MZ59 0000 0000 0000 0000 0"
            instructions="Transferência ou Depósito (Millennium BIM)"
            icon={<CreditCard size={32} />}
            color="bg-blue-600"
          />
        </div>
      </section>
    </div>
  );
}
