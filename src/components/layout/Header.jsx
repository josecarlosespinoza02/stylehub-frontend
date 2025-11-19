import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ShoppingCart, Search, User, Sun, Moon, 
  Heart, Package, ChevronDown, LogOut, LayoutDashboard,
  BarChart3, TrendingUp, FileBarChart, Box, Wrench, LineChart, Layers,
  Sparkles, Zap
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { getCartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const adminMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const cartCount = getCartCount();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú al cambiar ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
    setShowAdminMenu(false);
  }, [navigate]);

  // Menú público con tema navideño
  const publicMenu = [
    { name: 'Ofertas', href: '/ofertas', badge: '🎁', color: 'red', icon: Sparkles },
    { name: 'Hombre', href: '/hombre' },
    { name: 'Mujer', href: '/mujer' },
    { name: 'Novedades', href: '/novedades', badge: '🎄', color: 'green', icon: Zap },
    { name: 'Niño/a', href: '/ninos' },
  ];

  // Menú admin para dropdown (desktop)
  const adminDropdownMenu = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { name: 'Inventario', href: '/admin/inventario', icon: Package, color: 'from-red-500 to-green-500' },
    { name: 'Materiales', href: '/admin/materiales', icon: Layers, color: 'from-orange-500 to-red-500' },
    { name: 'Análisis', href: '/admin/analisis', icon: FileBarChart, color: 'from-green-500 to-emerald-500' },
    { name: 'Operaciones', href: '/admin/operaciones', icon: Box, color: 'from-amber-500 to-yellow-500' },
    { name: 'Ventas', href: '/admin/ventas', icon: ShoppingCart, color: 'from-green-500 to-emerald-500' },
  ];

  // Menú admin para móvil
  const adminMenu = [
    { separator: true, sectionTitle: 'Panel Administrativo' },
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventario', href: '/admin/inventario', icon: Package },
    { name: 'Materiales', href: '/admin/materiales', icon: Layers },
    { name: 'Análisis', href: '/admin/analisis', icon: FileBarChart },
    { name: 'Operaciones', href: '/admin/operaciones', icon: Box },
    { name: 'Ventas', href: '/admin/ventas', icon: ShoppingCart },
  ];

  const menuItems = isAdmin() ? [...publicMenu, ...adminMenu] : publicMenu;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Header Principal - ULTRA MODERNO */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isDark ? 'bg-slate-950/90' : 'bg-white/90'
        } backdrop-blur-2xl ${
          isScrolled
            ? `shadow-2xl ${isDark ? 'shadow-red-500/20 border-b-2 border-red-500/40' : 'shadow-red-300/50 border-b-2 border-red-200/60'}`
            : 'border-b-2 border-transparent'
        }`}
      >
        
        {/* Efectos de luz de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-red-500/10' : 'bg-red-200/30'} rounded-full blur-3xl animate-pulse-slow`}></div>
          <div className={`absolute top-0 left-0 w-[400px] h-[400px] ${isDark ? 'bg-green-500/10' : 'bg-green-200/30'} rounded-full blur-3xl animate-pulse-slow`} style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Hamburger Menu (Mobile) - MEJORADO */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isDark 
                  ? 'text-white hover:bg-gradient-to-br hover:from-red-600 hover:to-green-600' 
                  : 'text-gray-900 hover:bg-gradient-to-br hover:from-red-100 hover:to-green-100'
              } shadow-xl hover:shadow-2xl hover:scale-110`}
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {isMenuOpen ? <X className="w-6 h-6 relative z-10" /> : <Menu className="w-6 h-6 relative z-10" />}
            </button>

            {/* Logo ULTRA PREMIUM */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                {/* Logo principal con efecto glow */}
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 via-red-500 to-green-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-red-500/60 group-hover:shadow-red-500/80 animate-pulse-glow relative overflow-hidden">
                  {/* Efecto de brillo interno */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-white font-black text-2xl relative z-10">L</span>
                </div>
                
                {/* Indicador online premium */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-3 border-slate-950 animate-ping-slow shadow-lg"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-3 border-slate-950"></div>
                
                {/* Emoji navideño decorativo */}
                <div className="absolute -bottom-2 -left-2 text-3xl animate-bounce-slow filter drop-shadow-lg">🎄</div>
              </div>
              
              <div className="hidden sm:block">
                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} block leading-tight tracking-tight`}>
                  Loyola
                </span>
                <span className="text-base bg-gradient-to-r from-red-500 via-green-500 to-red-600 bg-clip-text text-transparent font-bold flex items-center gap-2">
                  Crea Tu Estilo
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </span>
              </div>
            </Link>

            {/* Desktop Menu - PREMIUM */}
            <nav className="hidden lg:flex items-center gap-2">
              {publicMenu.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`relative px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 group overflow-hidden ${
                      isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {/* Efecto de fondo hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-green-600/0 to-red-600/0 group-hover:from-red-600/20 group-hover:via-green-600/20 group-hover:to-red-600/20 transition-all duration-500 rounded-2xl"></div>
                    
                    {/* Borde animado */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/30 transition-all duration-300"></div>
                    
                    {Icon && <Icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />}
                    <span className="relative z-10">{item.name}</span>
                    {item.badge && (
                      <span className="text-xl animate-bounce-slow relative z-10 filter drop-shadow-lg">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Admin Panel ULTRA PREMIUM */}
              {isAdmin() && (
                <div className="relative ml-3" ref={adminMenuRef}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className={`px-3 py-1 rounded-2xl font-black bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      showAdminMenu ? 'ring-4 ring-red-400/60 scale-105' : ''
                    } animate-shimmer bg-[length:200%_100%] relative overflow-hidden`}
                  >
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <LayoutDashboard className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Admin Panel</span>
                    <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-500 ${showAdminMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu PREMIUM */}
                  {showAdminMenu && (
                    <div className={`absolute right-0 mt-4 w-80 rounded-3xl shadow-2xl overflow-hidden z-50 animate-slideDown border-2 ${
                      isDark ? 'bg-slate-900/95 border-red-500/40' : 'bg-white/95 border-red-300'
                    } backdrop-blur-2xl`}>
                      {/* Header del dropdown */}
                      <div className={`px-6 py-5 border-b-2 relative overflow-hidden ${isDark ? 'border-slate-800 bg-gradient-to-r from-red-900/50 to-green-900/50' : 'border-gray-200 bg-gradient-to-r from-red-50 to-green-50'}`}>
                        {/* Efectos de fondo */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                        
                        <p className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 relative z-10 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          Panel Administrativo
                        </p>
                      </div>
                      
                      <div className="py-3">
                        {adminDropdownMenu.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={idx}
                              to={item.href}
                              onClick={() => setShowAdminMenu(false)}
                              className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative overflow-hidden ${
                                isDark 
                                  ? 'hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30 text-gray-300 hover:text-white' 
                                  : 'hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 text-gray-700 hover:text-gray-900'
                              }`}
                            >
                              {/* Barra lateral animada */}
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-green-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                              
                              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <span className="font-bold text-lg">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Actions - PREMIUM */}
            <div className="flex items-center gap-3">

              {/* Theme Toggle ULTRA PREMIUM */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl transition-all duration-500 group shadow-xl hover:shadow-2xl hover:scale-110 relative overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-yellow-400 hover:from-yellow-500 hover:to-orange-500 hover:text-white' 
                    : 'bg-gradient-to-br from-red-100 to-red-200 text-red-600 hover:from-slate-800 hover:to-slate-900 hover:text-yellow-400'
                }`}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {isDark ? (
                  <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                ) : (
                  <Moon className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-500 relative z-10" />
                )}
              </button>

              {/* User Menu PREMIUM */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-2 ${
                      isDark 
                        ? 'text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30 border-slate-800 hover:border-red-500/50' 
                        : 'text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full border-3 border-red-500 shadow-lg"
                    />
                    {isAdmin() && (
                      <span className="px-3 py-1 text-xs font-black bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full shadow-lg animate-pulse">
                        ADMIN
                      </span>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 mt-3 w-80 rounded-3xl shadow-2xl overflow-hidden z-50 border-2 ${
                      isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-gray-200'
                    } backdrop-blur-2xl`}>
                      <div className={`px-6 py-5 border-b-2 ${isDark ? 'border-slate-800 bg-gradient-to-r from-red-900/20 to-green-900/20' : 'border-gray-200 bg-gradient-to-r from-red-50 to-green-50'}`}>
                        <p className={`font-black text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.name}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user?.email}
                        </p>
                        {isAdmin() && (
                          <span className="inline-block mt-2 px-3 py-1 text-xs font-bold bg-red-500/20 text-red-400 rounded-full">
                            Administrador
                          </span>
                        )}
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <User className="w-5 h-5" />
                          <span className="font-semibold">Mi Perfil</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-red-400' : 'hover:bg-gray-100 text-red-600'
                          }`}
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-semibold">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:flex p-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 ${
                    isDark 
                      ? 'text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-green-600' 
                      : 'text-gray-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100'
                  }`}
                  aria-label="Login"
                >
                  <User className="w-6 h-6" />
                </Link>
              )}

              {/* Cart ULTRA PREMIUM */}
              <Link to="/cart" className="relative group">
                <div className={`p-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 ${
                  isDark 
                    ? 'text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-green-600' 
                    : 'text-gray-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100'
                }`}>
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-xl animate-bounce border-3 border-slate-950">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar - ULTRA PREMIUM */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-md`}
        ></div>

        <div
          className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] ${
            isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-white'
          } transform transition-transform duration-500 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } shadow-2xl overflow-y-auto`}
        >
          {/* Barra superior animada */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-green-500 via-red-600 via-green-500 to-red-600 animate-shimmer bg-[length:200%_100%]"></div>
          
          {/* Header del Sidebar PREMIUM */}
          <div className={`p-6 border-b-2 ${isDark ? 'border-red-500/30 bg-gradient-to-r from-red-900/30 to-green-900/30' : 'border-red-200 bg-gradient-to-r from-red-50 to-green-50'} relative overflow-hidden`}>
            {/* Efectos de fondo */}
            <div className={`absolute top-0 right-0 w-40 h-40 ${isDark ? 'bg-red-500/10' : 'bg-red-200/30'} rounded-full blur-3xl`}></div>
            <div className={`absolute bottom-0 left-0 w-40 h-40 ${isDark ? 'bg-green-500/10' : 'bg-green-200/30'} rounded-full blur-3xl`}></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/60 animate-pulse-glow">
                  <span className="text-white font-black text-3xl">L</span>
                </div>
                <div>
                  <h3 className={`font-black text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Loyola</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1 font-bold`}>
                    {isAdmin() ? (
                      <>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="w-2 h-2 bg-red-500 rounded-full absolute"></span>
                        Admin Mode
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <span className="w-2 h-2 bg-green-500 rounded-full absolute"></span>
                        Explorar 🎄
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            {/* User Info Card PREMIUM */}
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900/70 border-2 border-red-500/40' : 'bg-white border-2 border-red-200'} shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden`}>
              {/* Efecto de brillo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl"></div>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-16 h-16 rounded-full border-3 border-red-500 shadow-xl"
                    />
                    <div className="flex-1">
                      <p className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin() && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-green-600 rounded-xl shadow-xl mb-3">
                      <LayoutDashboard className="w-5 h-5 text-white" />
                      <span className="text-sm font-black text-white">ADMINISTRADOR</span>
                    </div>
                  )}
                  <Link 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-base text-red-500 hover:text-red-400 font-black transition-colors"
                  >
                    Ver mi perfil →
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ¡Hola, Invitado! 🎅
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Inicia sesión para más
                      </p>
                    </div>
                  </div>
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-6 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white text-base font-black rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menu Items PREMIUM */}
          <nav className="p-5">
            {menuItems.map((item, index) => {
              if (item.separator) {
                return (
                  <div key={index} className="my-6">
                    <div className={`h-px ${isDark ? 'bg-gradient-to-r from-transparent via-red-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-red-300 to-transparent'}`}></div>
                    <div className={`mt-5 px-6 py-4 rounded-2xl ${isDark ? 'bg-gradient-to-r from-red-900/40 to-green-900/40 border-2 border-red-500/30' : 'bg-gradient-to-r from-red-50 to-green-50 border-2 border-red-200'} shadow-xl`}>
                      <p className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        {item.sectionTitle}
                      </p>
                    </div>
                  </div>
                );
              }

              const Icon = item.icon;
              const isAdminItem = item.href?.includes('/admin/');
              
              return (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl mb-3 transition-all duration-300 group shadow-lg hover:shadow-2xl hover:scale-105 relative overflow-hidden ${
                    isAdminItem
                      ? isDark
                        ? 'text-red-300 hover:text-white bg-gradient-to-r from-red-900/40 to-green-900/40 border-2 border-red-500/40 hover:border-red-500/70'
                        : 'text-red-700 hover:text-red-900 bg-gradient-to-r from-red-100 to-green-100 border-2 border-red-300 hover:border-red-400'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-slate-900/70 border-2 border-slate-800 hover:border-red-500/40'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-200 hover:border-red-300'
                  }`}
                >
                  {/* Barra lateral animada */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-green-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full"></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    {Icon && (
                      <div className={`p-3 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ${
                        isAdminItem
                          ? 'bg-gradient-to-br from-red-600 to-green-600 shadow-red-500/50'
                          : isDark
                            ? 'bg-slate-800'
                            : 'bg-gray-200'
                      }`}>
                        <Icon className={`w-6 h-6 ${isAdminItem ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                    <span className="font-bold text-lg">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-2xl animate-bounce-slow">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer del Sidebar PREMIUM */}
          {isAuthenticated && (
            <div className={`sticky bottom-0 left-0 right-0 p-5 border-t-2 ${
              isDark 
                ? 'border-red-500/30 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent' 
                : 'border-red-200 bg-gradient-to-t from-white via-gray-50 to-transparent'
            } backdrop-blur-xl`}>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white rounded-2xl font-black hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-105 shadow-xl animate-shimmer bg-[length:200%_100%] relative overflow-hidden"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
          }
          50% { 
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(34, 197, 94, 0.6);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
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
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}