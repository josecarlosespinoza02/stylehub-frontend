import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ShoppingCart, Search, User, Sun, Moon, 
  Heart, Package, ChevronDown, LogOut, LayoutDashboard,
  BarChart3, TrendingUp, FileBarChart, Box, Wrench, LineChart, Layers,
  Sparkles, Zap, Target, CheckCircle, PlayCircle, XCircle, Settings
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

  // Detectar scroll - OPTIMIZADO
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Usar requestAnimationFrame para mejor performance
    let ticking = false;
    const updateScroll = () => {
      handleScroll();
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  // Menú público
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
    { name: 'Planificación', href: '/admin/planificacion', icon: Target, color: 'from-indigo-500 to-purple-500' },
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
    { name: 'Planificación', href: '/admin/planificacion', icon: Target },
  ];

  const menuItems = isAdmin() ? [...publicMenu, ...adminMenu] : publicMenu;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Header Principal - COMPACTO */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark ? 'bg-slate-950/95' : 'bg-white/95'
        } backdrop-blur-xl ${
          isScrolled
            ? `shadow-lg ${isDark ? 'shadow-red-500/10 border-b border-red-500/20' : 'shadow-red-300/20 border-b border-red-200/30'}`
            : 'border-b border-transparent'
        }`}
        style={{ height: '64px' }} // ALTURA FIJA REDUCIDA
      >
        
        {/* Efectos de luz de fondo - SIMPLIFICADOS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-40 h-40 ${isDark ? 'bg-red-500/5' : 'bg-red-200/10'} rounded-full blur-2xl`}></div>
          <div className={`absolute -top-20 -left-20 w-40 h-40 ${isDark ? 'bg-green-500/5' : 'bg-green-200/10'} rounded-full blur-2xl`} style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Hamburger Menu (Mobile) - OPTIMIZADO */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                isDark 
                  ? 'text-white hover:bg-slate-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo COMPACTO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Logo principal compacto */}
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-500 to-green-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-black text-lg">L</span>
                </div>
                
                {/* Indicador online más pequeño */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-slate-950"></div>
              </div>
              
              <div className="hidden sm:block">
                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'} block leading-tight`}>
                  Loyola
                </span>
                <span className="text-xs bg-gradient-to-r from-red-500 via-green-500 to-red-600 bg-clip-text text-transparent font-bold">
                  Crea Tu Estilo
                </span>
              </div>
            </Link>

            {/* Desktop Menu - COMPACTO */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicMenu.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-slate-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="text-sm">{item.name}</span>
                    {item.badge && (
                      <span className="text-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Admin Panel COMPACTO */}
              {isAdmin() && (
                <div className="relative ml-2" ref={adminMenuRef}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className={`px-3 py-2 rounded-xl font-bold bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 ${
                      showAdminMenu ? 'ring-2 ring-red-400' : ''
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm">Admin</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showAdminMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu COMPACTO */}
                  {showAdminMenu && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl overflow-hidden z-50 border ${
                      isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                    }`}>
                      {/* Header del dropdown compacto */}
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <Sparkles className="w-4 h-4" />
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
                              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                                isDark 
                                  ? 'hover:bg-slate-800 text-gray-300 hover:text-white' 
                                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                              }`}
                            >
                              <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-semibold text-sm">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Actions - COMPACTOS */}
            <div className="flex items-center gap-2">

              {/* Theme Toggle COMPACTO */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                    : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                }`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* User Menu COMPACTO */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border ${
                      isDark 
                        ? 'text-white hover:bg-slate-800 border-slate-700' 
                        : 'text-gray-900 hover:bg-gray-100 border-gray-300'
                    }`}
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-6 h-6 rounded-full border border-red-500"
                    />
                    {isAdmin() && (
                      <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full">
                        ADMIN
                      </span>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50 border ${
                      isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user?.email}
                        </p>
                        {isAdmin() && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-bold bg-red-500/20 text-red-400 rounded-full">
                            Administrador
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          <span className="font-semibold text-sm">Mi Perfil</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-2 px-4 py-2 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-red-400' : 'hover:bg-gray-100 text-red-600'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-semibold text-sm">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:flex p-2 rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'text-white hover:bg-slate-800' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Login"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              {/* Cart COMPACTO */}
              <Link to="/cart" className="relative group">
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isDark 
                    ? 'text-white hover:bg-slate-800' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}>
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar - OPTIMIZADO */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm transition-opacity duration-300`}
        ></div>

        <div
          className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] ${
            isDark ? 'bg-slate-900' : 'bg-white'
          } transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } shadow-2xl overflow-y-auto`}
        >
          {/* Barra superior */}
          <div className="h-1 bg-gradient-to-r from-red-600 to-green-600"></div>
          
          {/* Header del Sidebar COMPACTO */}
          <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">L</span>
                </div>
                <div>
                  <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Loyola</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-bold`}>
                    {isAdmin() ? 'Admin Mode' : 'Explorar 🎄'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            {/* User Info Card COMPACTO */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} shadow-lg`}>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full border-2 border-red-500"
                    />
                    <div className="flex-1">
                      <p className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin() && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-green-600 rounded-lg shadow-lg mb-2">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span className="text-xs font-black text-white">ADMINISTRADOR</span>
                    </div>
                  )}
                  <Link 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-sm text-red-500 hover:text-red-400 font-bold transition-colors"
                  >
                    Ver mi perfil →
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                    className="block text-center px-4 py-2 bg-gradient-to-r from-red-600 to-green-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all duration-200 shadow-md"
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menu Items COMPACTOS */}
          <nav className="p-4">
            {menuItems.map((item, index) => {
              if (item.separator) {
                return (
                  <div key={index} className="my-4">
                    <div className={`h-px ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className={`mt-3 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                      <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
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
                  className={`flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                    isAdminItem
                      ? isDark
                        ? 'text-red-300 bg-slate-800 border border-red-500/30'
                        : 'text-red-700 bg-red-50 border border-red-300'
                      : isDark
                        ? 'text-gray-300 hover:bg-slate-800 border border-slate-700'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className={`p-2 rounded-lg ${
                        isAdminItem
                          ? 'bg-gradient-to-br from-red-600 to-green-600'
                          : isDark
                            ? 'bg-slate-700'
                            : 'bg-gray-200'
                      }`}>
                        <Icon className={`w-4 h-4 ${isAdminItem ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-lg">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer del Sidebar COMPACTO */}
          {isAuthenticated && (
            <div className={`sticky bottom-0 left-0 right-0 p-4 border-t ${
              isDark 
                ? 'border-slate-700 bg-slate-900' 
                : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Espacio para el header fijo */}
      <div style={{ height: '64px' }}></div>
    </>
  );
}