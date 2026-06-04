import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '258840000000'; // Replace with real number
  const message = encodeURIComponent('Olá ALEM! Gostaria de saber mais sobre os vossos projetos.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
      aria-label="Contactar via WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}
