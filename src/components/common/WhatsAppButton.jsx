import { FaWhatsapp } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function WhatsAppButton() {
  const { isDark } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const phoneNumber = '59177718159'; // sin el +
  const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus productos.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <>
      {showTooltip && (
        <div className={`fixed bottom-20 right-10 z-50 animate-slideUp ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        } border rounded-xl p-4 shadow-2xl max-w-xs`}>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
          </button>
          <div className="pr-0">
            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ¿Necesitas ayuda?
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Chatea con nosotros en WhatsApp y te responderemos de inmediato.
            </p>
          </div>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed bottom-8 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float group"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8 relative z-10" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </a>
    </>
  );
}
