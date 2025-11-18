import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Youtube, Mail, Phone, 
  MapPin, Heart, Truck, Shield, Award, Clock, Package, 
  Headphones, CreditCard, CheckCircle
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
    { icon: Truck, text: 'Envío rápido 24-48h' },
    { icon: Shield, text: 'Compra 100% segura' },
    { icon: Award, text: 'Calidad garantizada' },
    { icon: Headphones, text: 'Soporte 24/7' },
  ];

  return (
    <footer className={`relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-gray-900'} mt`}>
      
      {/* Decoración de fondo mejorada */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Beneficios destacados */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column - 4 columns */}
          <div className="lg:col-span-8 pr-36 ">
            <Link to="/" className="flex items-center gap-6 mb-6 group">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 transform group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-white block">
                  Loyola
                </span>
                <span className="text-sm text-purple-400">
                  Crea Tu Estilo
                </span>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Especialistas en bordados personalizados desde 2018. Transformamos tus ideas en prendas únicas con la mejor calidad y atención al detalle.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:info@loyolacreatuEstilo.com" 
                className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Email</span>
                  <span className="text-sm">info@loyolacreatuEstilo.com</span>
                </div>
              </a>
              
              <a 
                href="tel:+59177718159" 
                className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">WhatsApp</span>
                  <span className="text-sm">+591 77718159</span>
                </div>
              </a>
              
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Ubicación</span>
                  <span className="text-sm">La Paz, Bolivia</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Horario</span>
                  <span className="text-sm">Lun - Sáb: 9:00 - 19:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Links - 2 columns */}
          <div className="lg:col-span-2 py-16">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Tienda
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-all text-sm hover:translate-x-1 inline-flex items-center gap-2 duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-400 flex items-center justify-center lg:justify-start gap-2 mb-2">
                © 2025 Loyola Crea Tu Estilo. Hecho con 
                <Heart className="w-4 h-4 text-red-500 animate-pulse" /> 
                en Bolivia
              </p>
              <p className="text-xs text-gray-500">
                Todos los derechos reservados.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm font-semibold text-white mb-3">Síguenos:</p>
              <div className="flex items-center gap-2">
                {socialMedia.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-11 h-11 rounded-xl bg-white/5 backdrop-blur-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/10 hover:border-transparent ${social.color} hover:scale-110 hover:shadow-lg`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Developer Info */}
            <div className="text-center lg:text-right pr-10">
              <p className="text-xs text-gray-500 mb-1">Desarrollado por</p>
              <p className="text-sm text-gray-400 font-semibold">
                Jose Carlos Espinoza Laura
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-4 mt-2 text-xs">
                <Link to="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors">
                  Privacidad
                </Link>
                <span className="text-gray-600">•</span>
                <Link to="/terms" className="text-gray-500 hover:text-purple-400 transition-colors">
                  Términos
                </Link>
                <span className="text-gray-600">•</span>
                <Link to="/cookies" className="text-gray-500 hover:text-purple-400 transition-colors">
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