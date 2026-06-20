import { Link } from 'react-router-dom';

export default function WhatsAppButton() {
  const phoneNumber = '258840000000'; // Real WhatsApp number
  const message = encodeURIComponent('Ola ALEM! Gostaria de saber mais sobre os vossos projetos.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-7 right-7 z-50 flex items-center justify-center group">
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-brand-poloBlue/40 animate-wa-ring" aria-hidden="true" />
      <span className="absolute inset-0 rounded-full bg-brand-poloBlue/30 animate-wa-ring2" aria-hidden="true" />

      {/* Tooltip */}
      <span className="absolute right-[72px] bg-brand-bigStone text-white text-xs font-semibold px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-200 shadow-md whitespace-nowrap dark:bg-dark-surface dark:text-dark-text">
        Fale connosco 💬
        {/* Tooltip Arrow */}
        <span className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-brand-bigStone dark:bg-dark-surface" />
      </span>

      {/* Main button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center w-[60px] h-[60px] rounded-full bg-gradient-to-br from-whatsapp-primary to-whatsapp-dark text-white shadow-lg animate-wa-float transition-all duration-200 hover:scale-110"
        aria-label="Contactar via WhatsApp"
      >
        {/* Official WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.635 4.64 1.84 6.653L2.667 29.333l6.88-1.8A13.28 13.28 0 0016.004 29.333c7.36 0 13.333-5.973 13.333-13.333S23.364 2.667 16.004 2.667zm0 24c-2.187 0-4.32-.587-6.187-1.707l-.44-.267-4.08 1.067 1.093-3.973-.28-.453A10.613 10.613 0 015.334 16c0-5.88 4.787-10.667 10.667-10.667S26.667 10.12 26.667 16 21.88 26.667 16.004 26.667zm5.84-7.973c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.96 1.253-.133.213-.267.24-.587.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.52-.533-.72-.547-.187-.013-.4-.013-.613-.013-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.453 4.827.76.333 1.36.533 1.827.68.76.24 1.453.2 2 .12.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
        </svg>
      </a>
    </div>
  );
}
