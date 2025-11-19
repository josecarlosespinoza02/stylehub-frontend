import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ShoppingCart, Search, User, Sun, Moon, 
  Heart, Package, ChevronDown, LogOut, LayoutDashboard,
  BarChart3, TrendingUp, FileBarChart, Box, Wrench, LineChart, Layers,
  Sparkles, Zap, Gift, Snowflake
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

  // Menú público con temática navideña
  const publicMenu = [
    { name: 'Ofertas', href: '/ofertas', badge: 'HOT', color: 'red', icon: Gift },
    { name: 'Hombre', href: '/hombre' },
    { name: 'Mujer', href: '/mujer' },
    { name: 'Novedades', href: '/novedades', badge: 'NEW', color: 'green', icon: Sparkles },
    { name: 'Niño/a', href: '/ninos' },
  ];

  // Menú admin para dropdown (desktop)
  const adminDropdownMenu = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'from-red-500 to-green-500' },
    { name: 'Inventario', href: '/admin/inventario', icon: Package, color: 'from-green-500 to-emerald-500' },
    { name: 'Materiales', href: '/admin/materiales', icon: Layers, color: 'from-red-500 to-pink-500' },
    { name: 'Análisis', href: '/admin/analisis', icon: FileBarChart, color: 'from-green-500 to-teal-500' },
    { name: 'Operaciones', href: '/admin/operaciones', icon: Box, color: 'from-red-600 to-orange-600' },
    { name: 'Ventas', href: '/admin/ventas', icon: ShoppingCart, color: 'from-green-600 to-emerald-600' },
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
      {/* ❄️ Efectos navideños en el header */}
      <style jsx>{`
        @keyframes snowDrift {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(20vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes twinkleHeader {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(34, 197, 94, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(34, 197, 94, 0.4);
          }
        }
      `}</style>

      {/* Header Principal con efectos navideños */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950' 
            : 'bg-gradient-to-r from-white via-red-50 to-white'
        } backdrop-blur-xl ${
          isScrolled
            ? isDark 
              ? 'shadow-2xl border-b-2 border-red-500/30' 
              : 'shadow-2xl border-b-2 border-red-300'
            : 'border-b border-transparent'
        }`}
        style={{
          boxShadow: isScrolled && isDark 
            ? '0 10px 40px rgba(239, 68, 68, 0.2), 0 10px 60px rgba(34, 197, 94, 0.15)' 
            : undefined
        }}
      >
        {/* Efectos de fondo navideños */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Copos de nieve flotantes */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`header-snow-${i}`}
              className={`absolute text-lg ${isDark ? 'text-white/20' : 'text-blue-300/40'}`}
              style={{
                left: `${Math.random() * 100}%`,
                animation: `snowDrift ${8 + Math.random() * 8}s linear ${Math.random() * 5}s infinite`,
                textShadow: isDark ? '0 0 8px rgba(255,255,255,0.3)' : '0 0 8px rgba(59,130,246,0.3)'
              }}
            >
              ❄️
            </div>
          ))}
          
          {/* Estrellas brillantes */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`header-star-${i}`}
              className={`absolute ${isDark ? 'text-yellow-400/40' : 'text-yellow-500/50'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 12 + 8}px`,
                animation: `twinkleHeader ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
                filter: 'drop-shadow(0 0 4px currentColor)'
              }}
            >
              ✨
            </div>
          ))}

          {/* Gradientes de color navideño */}
          <div className={`absolute top-0 right-0 w-64 h-64 ${isDark ? 'bg-red-900/10' : 'bg-red-200/20'} rounded-full blur-3xl`}></div>
          <div className={`absolute top-0 left-0 w-64 h-64 ${isDark ? 'bg-green-900/10' : 'bg-green-200/20'} rounded-full blur-3xl`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-red-500/20' 
                  : 'text-gray-900 hover:bg-red-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo navideño mejorado */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-red-600 via-green-600 to-red-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative"
                  style={{
                    animation: isDark ? 'glow 3s ease-in-out infinite' : undefined
                  }}
                >
                  <span className="text-white font-black text-2xl relative z-10">L</span>
                  {/* Decoración navideña en el logo */}
                  <div className="absolute -top-2 -right-2 text-lg animate-bounce" style={{animationDuration: '2s'}}>🎄</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
              </div>
              <div>
                <span className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Loyola
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    Crea Tu Estilo
                  </span>
                  <Snowflake className={`w-3 h-3 ${isDark ? 'text-blue-400' : 'text-blue-500'} animate-spin`} style={{animationDuration: '4s'}} />
                </div>
              </div>
            </Link>

            {/* Desktop Menu con estilo navideño */}
            <nav className="hidden lg:flex items-center gap-2">
              {publicMenu.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 relative group ${
                      isDark
                        ? 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-black rounded-full animate-pulse ${
                        item.color === 'red'
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      }`}
                      style={{
                        boxShadow: item.color === 'red' 
                          ? '0 0 15px rgba(239, 68, 68, 0.5)' 
                          : '0 0 15px rgba(34, 197, 94, 0.5)'
                      }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {/* Decoración hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className={`absolute top-1 right-1 text-xs ${isDark ? 'text-red-400/40' : 'text-red-500/30'}`}>❄️</div>
                    </div>
                  </Link>
                );
              })}

              {/* Admin Panel con tema navideño */}
              {isAdmin() && (
                <div className="relative ml-2" ref={adminMenuRef}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className={`px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                      showAdminMenu ? 'ring-2 ring-red-400' : ''
                    }`}
                    style={{
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3), 0 10px 40px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdminMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu navideño */}
                  {showAdminMenu && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideDown ${
                      isDark 
                        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-red-500/30' 
                        : 'bg-white border-2 border-red-300'
                    }`}
                    style={{
                      boxShadow: isDark 
                        ? '0 20px 60px rgba(239, 68, 68, 0.2), 0 20px 80px rgba(34, 197, 94, 0.15)' 
                        : '0 20px 60px rgba(0,0,0,0.15)'
                    }}
                    >
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800 bg-gradient-to-r from-red-900/30 to-green-900/30' : 'border-gray-200 bg-gradient-to-r from-red-50 to-green-50'}`}>
                        <p className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <Gift className="w-4 h-4" />
                          Panel Administrativo
                        </p>
                      </div>
                      
                      <div className="py-2">
                        {adminDropdownMenu.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={idx}
                              to={item.href}
                              onClick={() => setShowAdminMenu(false)}
                              className={`flex items-center gap-3 px-4 py-3 transition-all group ${
                                isDark 
                                  ? 'hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30 text-gray-300 hover:text-white' 
                                  : 'hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100 text-gray-700 hover:text-gray-900'
                              }`}
                            >
                              <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-semibold">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Actions con estilo navideño */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Theme Toggle navideño */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-yellow-400 hover:shadow-yellow-400/30' 
                    : 'bg-gradient-to-br from-red-100 to-green-100 text-red-600 hover:shadow-red-400/30'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu navideño */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`hidden sm:flex items-center gap-2 p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark 
                        ? 'text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30' 
                        : 'text-gray-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100'
                    }`}
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full border-2 border-red-500 shadow-lg"
                    />
                    {isAdmin() && (
                      <span className="px-2 py-0.5 text-xs font-black bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full animate-pulse shadow-lg">
                        ADMIN
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                      isDark 
                        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-red-500/30' 
                        : 'bg-white border-2 border-red-300'
                    }`}>
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800 bg-gradient-to-r from-red-900/30 to-green-900/30' : 'border-gray-200 bg-gradient-to-r from-red-50 to-green-50'}`}>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.name}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user?.email}
                        </p>
                        {isAdmin() && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-black bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full">
                            Administrador
                          </span>
                        )}
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-red-50 text-gray-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-red-400' : 'hover:bg-red-50 text-red-600'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:flex p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    isDark 
                      ? 'text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30' 
                      : 'text-gray-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100'
                  }`}
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Cart navideño */}
              <Link to="/cart" className="relative group">
                <div className={`p-2.5 rounded-xl transition-all duration-300 transform group-hover:scale-110 shadow-lg ${
                  isDark 
                    ? 'text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30' 
                    : 'text-gray-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100'
                }`}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-600 to-green-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-xl animate-bounce"
                    style={{
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 30px rgba(34, 197, 94, 0.3)'
                    }}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden pb-4 animate-slideDown">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'
                  } border-2 focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Sidebar - Tema navideño */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`}
        ></div>

        {/* Sidebar con decoraciones navideñas */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] ${
            isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-white via-red-50 to-white'
          } transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } shadow-2xl overflow-y-auto relative`}
        >
          {/* Efectos navideños en sidebar */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={`sidebar-snow-${i}`}
                className={`absolute text-2xl ${isDark ? 'text-white' : 'text-blue-400'}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animation: `snowDrift ${10 + Math.random() * 10}s linear ${Math.random() * 5}s infinite`,
                }}
              >
                ❄️
              </div>
            ))}
          </div>

          {/* Header del Sidebar con gradiente navideño */}
          <div className={`p-6 border-b ${isDark ? 'border-slate-800 bg-gradient-to-r from-red-900/20 to-green-900/20' : 'border-red-200 bg-gradient-to-r from-red-100 to-green-100'} relative z-10`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-green-600 to-red-600 rounded-xl flex items-center justify-center shadow-xl animate-pulse relative">
                  <span className="text-white font-black text-xl">L</span>
                  <div className="absolute -top-1 -right-1 text-sm">🎄</div>
                </div>
                <div>
                  <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Loyola</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}>
                    {isAdmin() ? (
                      <>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Modo Administrador
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Explorar Tienda 🎁
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-red-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            {/* User Info Card navideño */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/50 border-2 border-red-500/30' : 'bg-white border-2 border-red-300'} shadow-xl relative overflow-hidden`}>
              {/* Decoración navideña en la card */}
              <div className="absolute top-2 right-2 text-2xl opacity-30">🎄</div>
              <div className="absolute bottom-2 left-2 text-xl opacity-30">❄️</div>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full border-2 border-red-500 shadow-lg"
                    />
                    <div className="flex-1">
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin() && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-600 to-green-600 rounded-lg shadow-lg mb-3">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span className="text-xs font-black text-white">ADMINISTRADOR</span>
                    </div>
                  )}
                  <Link 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-center text-sm font-bold transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                  >
                    Ver mi perfil →
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ¡Hola, Invitado! 🎅
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Inicia sesión para más beneficios
                      </p>
                    </div>
                  </div>
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2 bg-gradient-to-r from-red-600 to-green-600 text-white text-sm font-black rounded-lg hover:shadow-xl transition-all"
                    style={{
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3), 0 10px 40px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 relative z-10">
            {menuItems.map((item, index) => {
              // Separador para sección admin
              if (item.separator) {
                return (
                  <div key={index} className="my-6">
                    <div className={`h-px ${isDark ? 'bg-gradient-to-r from-transparent via-red-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-red-300 to-transparent'}`}></div>
                    <div className={`mt-4 px-4 py-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-red-900/20 to-green-900/20 border border-red-500/20' : 'bg-gradient-to-r from-red-100 to-green-100 border border-red-300'}`}>
                      <p className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        <LayoutDashboard className="w-4 h-4" />
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
                  className={`flex items-center justify-between px-4 py-3 rounded-xl mb-2 transition-all duration-300 group relative overflow-hidden ${
                    isAdminItem
                      ? isDark
                        ? 'text-red-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/50 hover:to-green-900/50 border-2 border-transparent hover:border-red-500/30'
                        : 'text-red-700 hover:text-red-900 hover:bg-gradient-to-r hover:from-red-100 hover:to-green-100 border-2 border-transparent hover:border-red-300'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-green-900/30'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className={`p-2 rounded-lg ${
                        isAdminItem
                          ? 'bg-gradient-to-br from-red-600 to-green-600 shadow-lg'
                          : isDark
                            ? 'bg-slate-800'
                            : 'bg-gray-200'
                      } transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                        <Icon className={`w-4 h-4 ${isAdminItem ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2.5 py-1 text-xs font-black rounded-full shadow-lg animate-pulse ${
                      item.color === 'red'
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    }`}
                    style={{
                      boxShadow: item.color === 'red' 
                        ? '0 0 15px rgba(239, 68, 68, 0.5)' 
                        : '0 0 15px rgba(34, 197, 94, 0.5)'
                    }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer del Sidebar - Logout navideño */}
          {isAuthenticated && (
            <div className={`sticky bottom-0 left-0 right-0 p-4 border-t ${
              isDark 
                ? 'border-red-500/30 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent' 
                : 'border-red-300 bg-gradient-to-t from-white via-red-50 to-transparent'
            } relative z-10`}>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-black hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                style={{
                  boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)'
                }}
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spacer para el header fixed */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}