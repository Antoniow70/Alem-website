import { useEffect } from 'react';

// Inject keyframe styles once
const STYLE_ID = 'whatsapp-btn-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes wa-pulse-ring {
      0%   { transform: scale(1);   opacity: 0.6; }
      70%  { transform: scale(1.9); opacity: 0;   }
      100% { transform: scale(1.9); opacity: 0;   }
    }
    @keyframes wa-pulse-ring2 {
      0%   { transform: scale(1);   opacity: 0.4; }
      70%  { transform: scale(2.4); opacity: 0;   }
      100% { transform: scale(2.4); opacity: 0;   }
    }
    @keyframes wa-float {
      0%, 100% { transform: translateY(0px);   }
      50%       { transform: translateY(-6px);  }
    }
    .wa-btn-wrapper {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wa-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #22c55e;
      animation: wa-pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .wa-ring2 {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #22c55e;
      animation: wa-pulse-ring2 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.4s;
    }
    .wa-btn {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
      color: #fff;
      box-shadow: 0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15);
      animation: wa-float 3s ease-in-out infinite;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      text-decoration: none;
      cursor: pointer;
    }
    .wa-btn:hover {
      transform: scale(1.12) translateY(-3px);
      box-shadow: 0 16px 48px rgba(37,211,102,0.55), 0 4px 12px rgba(0,0,0,0.2);
    }
    .wa-tooltip {
      position: absolute;
      right: 72px;
      background: #1f2937;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 10px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transform: translateX(6px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }
    .wa-tooltip::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -6px;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: #1f2937;
      border-right: none;
    }
    .wa-btn-wrapper:hover .wa-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);
}

export default function WhatsAppButton() {
  useEffect(() => { injectStyles(); }, []);

  const phoneNumber = '258840000000'; // Replace with real number
  const message = encodeURIComponent('Ola ALEM! Gostaria de saber mais sobre os vossos projetos.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="wa-btn-wrapper">
      {/* Pulse rings */}
      <span className="wa-ring" aria-hidden="true" />
      <span className="wa-ring2" aria-hidden="true" />

      {/* Tooltip */}
      <span className="wa-tooltip">Fale connosco 💬</span>

      {/* Main button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
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

