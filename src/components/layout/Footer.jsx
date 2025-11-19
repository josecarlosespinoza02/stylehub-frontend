import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Youtube, Mail, Phone, 
  MapPin, Heart, Truck, Shield, Award, Clock, Package, 
  Headphones, Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  const footerLinks = {
    shop: [
      { name: 'Hombre', href: '/hombre' },
      { name: 'Mujer', href: '/mujer' },
      { name: 'Niños', href: '/ninos' },
      { name: 'Ofertas Especiales', href: '/ofertas' },
      { name: 'Novedades', href: '/novedades' },
    ],
  };

  const socialMedia = [
    { 
      icon: Facebook, 
      href: 'https://facebook.com/LoyolaCreaTuEstilo', 
      label: 'Facebook',
      color: 'from-blue-600 to-blue-700'
    },
    { 
      icon: Instagram, 
      href: 'https://instagram.com/LoyolaCreaTuEstilo', 
      label: 'Instagram',
      color: 'from-purple-600 to-pink-600'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/LoyolaCreaTuEstilo', 
      label: 'Twitter',
      color: 'from-sky-500 to-blue-500'
    },
    { 
      icon: Youtube, 
      href: 'https://youtube.com/@LoyolaCreaTuEstilo', 
      label: 'YouTube',
      color: 'from-red-600 to-red-700'
    },
  ];

  const benefits = [
    { icon: Truck, text: 'Envío rápido', color: 'from-red-600 to-orange-600' },
    { icon: Shield, text: 'Compra segura', color: 'from-green-600 to-emerald-600' },
    { icon: Award, text: 'Calidad garantizada', color: 'from-red-600 to-pink-600' },
    { icon: Headphones, text: 'Soporte 24/7', color: 'from-green-600 to-teal-600' },
  ];

  const ChevronRight = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <footer className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} mt-0`}>
      
      {/* Efectos de fondo sutiles - Solo desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        <div className={`absolute top-0 left-0 w-[600px] h-[600px] ${isDark ? 'bg-red-900/20' : 'bg-red-200/30'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] ${isDark ? 'bg-green-900/20' : 'bg-green-200/30'} rounded-full blur-3xl`}></div>
      </div>

      {/* Sección de beneficios */}
      <div className={`relative border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 md:gap-3 text-center group">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <span className={`text-xs md:text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} group-hover:text-red-500 transition-colors`}>
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-8">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300 ${isDark ? '' : 'shadow-red-500/30'}`}>
                  <span className="text-white font-black text-2xl md:text-3xl">L</span>
                </div>
              </div>
              <div>
                <span className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} block leading-tight`}>
                  Loyola
                </span>
                <span className={`text-sm md:text-base font-bold flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Crea Tu Estilo
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </span>
              </div>
            </Link>

            <p className={`text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed font-medium`}>
              Especialistas en bordados personalizados desde 2018. Transformamos tus ideas en prendas únicas con la mejor calidad.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 md:space-y-4">
              <a 
                href="mailto:info@loyolacreatuEstilo.com" 
                className={`flex items-center gap-3 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors group`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md`}>
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wide block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</span>
                  <span className="text-sm md:text-base font-semibold">info@loyolacreatuEstilo.com</span>
                </div>
              </a>
              
              <a 
                href="tel:+59177718159" 
                className={`flex items-center gap-3 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors group`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md`}>
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wide block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>WhatsApp</span>
                  <span className="text-sm md:text-base font-semibold">+591 77718159</span>
                </div>
              </a>
              
              <div className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center shadow-md`}>
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wide block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Ubicación</span>
                  <span className="text-sm md:text-base font-semibold">La Paz, Bolivia</span>
                </div>
              </div>

              <div className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md`}>
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wide block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Horario</span>
                  <span className="text-sm md:text-base font-semibold">Lun - Sáb: 9:00 - 19:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-4">
            <div className={`p-6 md:p-8 rounded-2xl ${isDark ? 'bg-slate-900/70 border border-slate-800' : 'bg-gray-50 border border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <Package className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                Tienda
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.href}
                      className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors text-sm md:text-base hover:translate-x-2 inline-flex items-center gap-2 group/link font-medium`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                      {link.name}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`relative border-t ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center lg:justify-start gap-2 mb-2 font-medium`}>
                © 2025 Loyola Crea Tu Estilo. Hecho con 
                <Heart className="w-4 h-4 text-red-500" /> 
                en Bolivia
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} font-medium`}>
                Todos los derechos reservados.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <p className={`text-sm md:text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 text-center`}>
                Síguenos:
              </p>
              <div className="flex items-center gap-3">
                {socialMedia.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg`}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Developer Info */}
            <div className="text-center lg:text-right">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Desarrollado por</p>
              <p className={`text-sm md:text-base font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Jose Carlos Espinoza Laura
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-4 text-xs md:text-sm font-medium">
                <Link to="/privacy" className={`${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}>
                  Privacidad
                </Link>
                <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
                <Link to="/terms" className={`${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}>
                  Términos
                </Link>
                <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
                <Link to="/cookies" className={`${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}>
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}