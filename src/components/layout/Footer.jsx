import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Youtube, Mail, Phone, 
  MapPin, Heart, Truck, Shield, Award, Clock, Package, 
  Headphones, CreditCard, CheckCircle, Gift, Snowflake, Sparkles
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
      color: 'hover:bg-blue-600'
    },
    { 
      icon: Instagram, 
      href: 'https://instagram.com/LoyolaCreaTuEstilo', 
      label: 'Instagram',
      color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/LoyolaCreaTuEstilo', 
      label: 'Twitter',
      color: 'hover:bg-sky-500'
    },
    { 
      icon: Youtube, 
      href: 'https://youtube.com/@LoyolaCreaTuEstilo', 
      label: 'YouTube',
      color: 'hover:bg-red-600'
    },
  ];

  const benefits = [
    { icon: Gift, text: 'Envío rápido 24-48h', color: 'from-red-600 to-orange-600' },
    { icon: Shield, text: 'Compra 100% segura', color: 'from-green-600 to-emerald-600' },
    { icon: Award, text: 'Calidad garantizada', color: 'from-red-600 to-pink-600' },
    { icon: Headphones, text: 'Soporte 24/7', color: 'from-green-600 to-teal-600' },
  ];

  // Componente para ChevronRight SVG
  const ChevronRight = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <footer className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-900 via-red-950 to-gray-900'} mt-0`}>
      
      {/* ❄️ EFECTOS NAVIDEÑOS DE FONDO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradientes navideños más intensos */}
        <div className={`absolute top-0 left-0 w-[600px] h-[600px] ${isDark ? 'bg-red-900/20' : 'bg-red-900/30'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] ${isDark ? 'bg-green-900/20' : 'bg-green-900/30'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isDark ? 'bg-red-800/15' : 'bg-red-800/25'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        
        {/* Copos de nieve flotantes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`footer-snow-${i}`}
            className={`absolute text-2xl ${isDark ? 'text-white/20' : 'text-white/30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate`,
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            ❄️
          </div>
        ))}

        {/* Estrellas brillantes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`footer-star-${i}`}
            className="absolute text-yellow-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 15 + 10}px`,
              animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              filter: 'drop-shadow(0 0 6px currentColor)'
            }}
          >
            ✨
          </div>
        ))}

        {/* Decoraciones navideñas grandes */}
        <div className="absolute top-20 left-[10%] text-6xl opacity-15 animate-bounce" style={{animationDuration: '3s', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))'}}>🎄</div>
        <div className="absolute top-40 right-[15%] text-5xl opacity-15 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))'}}>🎁</div>
        <div className="absolute bottom-32 left-[20%] text-5xl opacity-15 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s', filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.5))'}}>🔔</div>
        <div className="absolute bottom-48 right-[10%] text-6xl opacity-15 animate-bounce" style={{animationDuration: '4.2s', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))'}}>🎄</div>
      </div>

      {/* Sección de beneficios con diseño navideño */}
      <div className="relative border-b-2 border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-3 group text-center md:text-left">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all`}
                    style={{
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3), 0 10px 40px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content con diseño navideño */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand Column - 8 columns */}
          <div className="lg:col-span-8 pr-0 md:pr-8">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-green-600 to-red-600 rounded-xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all animate-pulse"
                  style={{
                    boxShadow: '0 0 40px rgba(239, 68, 68, 0.4), 0 0 60px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <span className="text-white font-black text-3xl">L</span>
                </div>
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{animationDuration: '2s'}}>🎄</div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">
                  Loyola
                </span>
                <span className="text-base text-red-400 font-bold flex items-center gap-2">
                  Crea Tu Estilo
                  <Snowflake className="w-4 h-4 text-blue-400 animate-spin" style={{animationDuration: '4s'}} />
                </span>
              </div>
            </Link>

            <p className="text-gray-300 mb-6 leading-relaxed text-base font-medium">
              🎄 Especialistas en bordados personalizados desde 2018. Transformamos tus ideas en prendas únicas con la mejor calidad y atención al detalle. ✨
            </p>

            {/* Contact Info con diseño navideño */}
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:info@loyolacreatuEstilo.com" 
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-semibold">Email</span>
                  <span className="text-sm font-bold">info@loyolacreatuEstilo.com</span>
                </div>
              </a>
              
              <a 
                href="tel:+59177718159" 
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-semibold">WhatsApp</span>
                  <span className="text-sm font-bold">+591 77718159</span>
                </div>
              </a>
              
              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center mt-0.5 shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-semibold">Ubicación</span>
                  <span className="text-sm font-bold">La Paz, Bolivia 🇧🇴</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mt-0.5 shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-semibold">Horario</span>
                  <span className="text-sm font-bold">Lun - Sáb: 9:00 - 19:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Links - 4 columns */}
          <div className="lg:col-span-4">
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-900/50 border-2 border-red-500/30' : 'bg-slate-900/70 border-2 border-red-500/40'} backdrop-blur-xl shadow-2xl relative overflow-hidden`}>
              {/* Decoración navideña en la card */}
              <div className="absolute top-3 right-3 text-3xl opacity-20 animate-bounce" style={{animationDuration: '3s'}}>🎁</div>
              <div className="absolute bottom-3 left-3 text-2xl opacity-20" style={{animation: 'float 5s ease-in-out infinite'}}>❄️</div>
              
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 relative z-10">
                <Package className="w-6 h-6 text-red-400" />
                Tienda
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </h3>
              <ul className="space-y-3 relative z-10">
                {footerLinks.shop.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-all text-base hover:translate-x-2 inline-flex items-center gap-3 duration-300 group font-semibold"
                    >
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></span>
                      {link.name}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar con diseño navideño premium */}
      <div className="relative border-t-2 border-red-500/20 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Copyright con tema navideño */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-300 flex items-center justify-center lg:justify-start gap-2 mb-2 font-semibold">
                © 2025 Loyola Crea Tu Estilo. Hecho con 
                <Heart className="w-4 h-4 text-red-500 animate-pulse" style={{filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))'}} /> 
                en Bolivia 🎄
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Todos los derechos reservados. ✨ Felices Fiestas ✨
              </p>
            </div>

            {/* Social Media con diseño navideño */}
            <div>
              <p className="text-sm font-black text-white mb-3 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
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
                      className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 border-2 border-white/10 hover:border-transparent ${social.color} hover:scale-110 hover:rotate-6 shadow-lg hover:shadow-2xl`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Developer Info con diseño navideño */}
            <div className="text-center lg:text-right">
              <p className="text-xs text-gray-500 mb-1 font-semibold">Desarrollado por</p>
              <p className="text-sm text-gray-300 font-black mb-2">
                Jose Carlos Espinoza Laura
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-4 text-xs font-semibold">
                <Link to="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">
                  Privacidad
                </Link>
                <span className="text-red-500">❄️</span>
                <Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                  Términos
                </Link>
                <span className="text-green-500">❄️</span>
                <Link to="/cookies" className="text-gray-400 hover:text-red-400 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </footer>
  );
}