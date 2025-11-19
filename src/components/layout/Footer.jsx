import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Youtube, Mail, Phone, 
  MapPin, Heart, Truck, Shield, Award, Clock, Package, 
  Headphones, Gift, Sparkles
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
    { icon: Gift, text: 'Envío rápido 24-48h', color: 'from-red-600 to-orange-600' },
    { icon: Shield, text: 'Compra 100% segura', color: 'from-green-600 to-emerald-600' },
    { icon: Award, text: 'Calidad garantizada', color: 'from-red-600 to-pink-600' },
    { icon: Headphones, text: 'Soporte 24/7', color: 'from-green-600 to-teal-600' },
  ];

  const ChevronRight = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <footer className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-900 via-red-950 to-gray-900'} mt-0`}>
      
      {/* 🎄 EFECTOS NAVIDEÑOS DE FONDO - ULTRA PREMIUM */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradientes navideños intensos */}
        <div className={`absolute top-0 left-0 w-[800px] h-[800px] ${isDark ? 'bg-red-900/30' : 'bg-red-900/40'} rounded-full blur-3xl animate-pulse-slow`}></div>
        <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] ${isDark ? 'bg-green-900/30' : 'bg-green-900/40'} rounded-full blur-3xl animate-pulse-slow`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ${isDark ? 'bg-red-800/25' : 'bg-red-800/35'} rounded-full blur-3xl animate-pulse-slow`} style={{ animationDelay: '2s' }}></div>
        
        {/* Copos de nieve flotantes mejorados */}
        {[...Array(25)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className={`absolute text-4xl ${isDark ? 'text-white/20' : 'text-white/35'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate`,
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
              filter: 'blur(1px)'
            }}
          >
            ❄️
          </div>
        ))}

        {/* Estrellas brillantes mejoradas */}
        {[...Array(35)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 25 + 10}px`,
              animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              filter: 'drop-shadow(0 0 10px currentColor)'
            }}
          >
            ✨
          </div>
        ))}

        {/* Decoraciones navideñas grandes premium */}
        <div className="absolute top-20 left-[10%] text-8xl opacity-15 animate-bounce-slow" style={{filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.7))'}}>🎄</div>
        <div className="absolute top-40 right-[15%] text-7xl opacity-15 animate-bounce-slow" style={{animationDelay: '1s', filter: 'drop-shadow(0 0 25px rgba(34, 197, 94, 0.7))'}}>🎁</div>
        <div className="absolute bottom-32 left-[20%] text-7xl opacity-15 animate-bounce-slow" style={{animationDelay: '0.5s', filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.7))'}}>🔔</div>
        <div className="absolute bottom-48 right-[10%] text-8xl opacity-15 animate-bounce-slow" style={{animationDelay: '1.5s', filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.7))'}}>🎄</div>
      </div>

      {/* Sección de beneficios ULTRA PREMIUM */}
      <div className="relative border-b-2 border-red-500/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-4 group text-center md:text-left">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}
                    style={{
                      boxShadow: '0 20px 50px rgba(239, 68, 68, 0.5), 0 20px 60px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    {/* Efecto de brillo interno */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <span className="text-base font-black text-gray-200 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content ULTRA PREMIUM */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20">
          
          {/* Brand Column PREMIUM */}
          <div className="lg:col-span-8 pr-0 md:pr-8">
            <Link to="/" className="flex items-center gap-5 mb-10 group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 via-red-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow relative overflow-hidden"
                  style={{
                    boxShadow: '0 0 60px rgba(239, 68, 68, 0.6), 0 0 100px rgba(34, 197, 94, 0.5)'
                  }}
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-white font-black text-5xl relative z-10">L</span>
                </div>
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce-slow" style={{animationDuration: '2s'}}>🎄</div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-3 border-slate-950 animate-pulse shadow-xl"></div>
              </div>
              <div>
                <span className="text-4xl font-black text-white block leading-tight">
                  Loyola
                </span>
                <span className="text-xl text-red-400 font-black flex items-center gap-2">
                  Crea Tu Estilo
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </span>
              </div>
            </Link>

            <p className="text-gray-300 mb-10 leading-relaxed text-xl font-semibold">
              🎄 Especialistas en bordados personalizados desde 2018. Transformamos tus ideas en prendas únicas con la mejor calidad y atención al detalle. ✨
            </p>

            {/* Contact Info ULTRA PREMIUM */}
            <div className="space-y-5 mb-10">
              <a 
                href="mailto:info@loyolacreatuEstilo.com" 
                className="flex items-center gap-5 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-red-500/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Mail className="w-8 h-8 text-white relative z-10" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-black uppercase tracking-widest">Email</span>
                  <span className="text-lg font-black">info@loyolacreatuEstilo.com</span>
                </div>
              </a>
              
              <a 
                href="tel:+59177718159" 
                className="flex items-center gap-5 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-green-500/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Phone className="w-8 h-8 text-white relative z-10" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-black uppercase tracking-widest">WhatsApp</span>
                  <span className="text-lg font-black">+591 77718159</span>
                </div>
              </a>
              
              <div className="flex items-start gap-5 text-gray-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center mt-0.5 shadow-2xl shadow-red-500/50">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-black uppercase tracking-widest">Ubicación</span>
                  <span className="text-lg font-black">La Paz, Bolivia 🇧🇴</span>
                </div>
              </div>

              <div className="flex items-start gap-5 text-gray-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mt-0.5 shadow-2xl shadow-green-500/50">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block font-black uppercase tracking-widest">Horario</span>
                  <span className="text-lg font-black">Lun - Sáb: 9:00 - 19:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Links ULTRA PREMIUM */}
          <div className="lg:col-span-4">
            <div className={`p-10 rounded-3xl ${isDark ? 'bg-slate-900/70 border-2 border-red-500/50' : 'bg-slate-900/90 border-2 border-red-500/60'} backdrop-blur-2xl shadow-2xl relative overflow-hidden hover:scale-105 transition-all duration-500 group`}>
              {/* Efectos de fondo */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="absolute top-5 right-5 text-5xl opacity-20 animate-bounce-slow" style={{animationDuration: '3s'}}>🎁</div>
              <div className="absolute bottom-5 left-5 text-4xl opacity-20" style={{animation: 'float 5s ease-in-out infinite'}}>❄️</div>
              
              <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-3 relative z-10">
                <Package className="w-8 h-8 text-red-400" />
                Tienda
                <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
              </h3>
              <ul className="space-y-5 relative z-10">
                {footerLinks.shop.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-xl hover:translate-x-4 inline-flex items-center gap-4 group/link font-bold relative"
                    >
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-green-500 opacity-0 group-hover/link:opacity-100 transition-opacity shadow-xl group-hover/link:shadow-2xl"></span>
                      {link.name}
                      <ChevronRight className="w-6 h-6 opacity-0 group-hover/link:opacity-100 transition-all duration-300 group-hover/link:translate-x-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar ULTRA PREMIUM */}
      <div className="relative border-t-2 border-red-500/40 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Copyright PREMIUM */}
            <div className="text-center lg:text-left">
              <p className="text-base text-gray-300 flex items-center justify-center lg:justify-start gap-2 mb-3 font-bold">
                © 2025 Loyola Crea Tu Estilo. Hecho con 
                <Heart className="w-6 h-6 text-red-500 animate-pulse" style={{filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))'}} /> 
                en Bolivia 🎄
              </p>
              <p className="text-sm text-gray-500 font-semibold">
                Todos los derechos reservados. ✨ Felices Fiestas ✨
              </p>
            </div>

            {/* Social Media ULTRA PREMIUM */}
            <div>
              <p className="text-lg font-black text-white mb-5 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                Síguenos:
              </p>
              <div className="flex items-center gap-5">
                {socialMedia.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${social.color} backdrop-blur-2xl flex items-center justify-center text-white transition-all duration-500 hover:scale-125 hover:rotate-12 shadow-2xl hover:shadow-3xl relative overflow-hidden group`}
                    >
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <Icon className="w-7 h-7 relative z-10" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Developer Info PREMIUM */}
            <div className="text-center lg:text-right">
              <p className="text-xs text-gray-500 mb-2 font-black uppercase tracking-widest">Desarrollado por</p>
              <p className="text-lg text-gray-300 font-black mb-4">
                Jose Carlos Espinoza Laura
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-5 text-sm font-bold">
                <Link to="/privacy" className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:scale-110">
                  Privacidad
                </Link>
                <span className="text-red-500 animate-pulse text-xl">❄️</span>
                <Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:scale-110">
                  Términos
                </Link>
                <span className="text-green-500 animate-pulse text-xl">❄️</span>
                <Link to="/cookies" className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:scale-110">
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
            transform: translateY(-25px) rotate(5deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.6);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
          }
          50% { 
            box-shadow: 0 0 60px rgba(239, 68, 68, 0.8), 0 0 90px rgba(34, 197, 94, 0.6);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}