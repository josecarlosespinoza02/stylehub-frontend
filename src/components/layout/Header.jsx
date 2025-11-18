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

  // Menú público
  const publicMenu = [
    { name: 'Ofertas', href: '/ofertas', badge: 'HOT', color: 'red', icon: Sparkles },
    { name: 'Hombre', href: '/hombre' },
    { name: 'Mujer', href: '/mujer' },
    { name: 'Novedades', href: '/novedades', badge: 'NEW', color: 'green', icon: Zap },
    { name: 'Niño/a', href: '/ninos' },
  ];

  // Menú admin para dropdown (desktop)
  const adminDropdownMenu = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { name: 'Inventario', href: '/admin/inventario', icon: Package, color: 'from-purple-500 to-pink-500' },
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
      {/* Header Principal */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark ? 'bg-slate-950/95' : 'bg-white/95'
        } backdrop-blur-xl ${
          isScrolled
            ? `shadow-lg ${isDark ? 'shadow-purple-500/10 border-b border-slate-800' : 'shadow-gray-200 border-b border-gray-200'}`
            : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-white hover:bg-slate-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-120 transition-transform duration-300 shadow-lg shadow-purple-500/50 absolute -top-4 -right-1">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div className="absolute -top-4 -right-1 le w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
              </div>
              <span className={`text-l font-bold hidden sm:block ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Loyola Crea tu Estilo
              </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicMenu.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-slate-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        item.color === 'red'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Admin Panel con Dropdown (Solo Desktop) */}
              {isAdmin() && (
                <div className="relative ml-2" ref={adminMenuRef}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className={`px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 ${
                      showAdminMenu ? 'ring-2 ring-purple-400' : ''
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdminMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showAdminMenu && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl overflow-hidden z-50 animate-slideDown ${
                      isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'
                    }`}>
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800 bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
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
                                  ? 'hover:bg-slate-800 text-gray-300 hover:text-white' 
                                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                              }`}
                            >
                              <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                    : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`hidden sm:flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'text-white hover:bg-slate-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border-2 border-purple-500"
                    />
                    {isAdmin() && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                        ADMIN
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg overflow-hidden z-50 ${
                      isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'
                    }`}>
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.name}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user?.email}
                        </p>
                        {isAdmin() && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-400 rounded-full">
                            Administrador
                          </span>
                        )}
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                            isDark ? 'hover:bg-slate-800 text-red-400' : 'hover:bg-gray-100 text-red-600'
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
                  className={`hidden sm:flex p-2 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'text-white hover:bg-slate-800' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'text-white hover:bg-slate-800' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
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
                  } border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Sidebar - MEJORADO */}
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

        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] ${
            isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-white'
          } transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } shadow-2xl overflow-y-auto`}
        >
          {/* Header del Sidebar con gradiente */}
          <div className={`p-6 border-b ${isDark ? 'border-slate-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Loyola Crea Tu Estilo</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}>
                    {isAdmin() ? (
                      <>
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                        Modo Administrador
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Explorar Tienda
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            {/* User Info Card */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'} shadow-lg`}>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-lg"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin() && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold text-white">ADMINISTRADOR</span>
                    </div>
                  )}
                  <Link 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-3 block text-center text-sm text-purple-500 hover:text-purple-400 font-medium transition-colors"
                  >
                    Ver mi perfil →
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ¡Hola, Invitado!
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Inicia sesión para más beneficios
                      </p>
                    </div>
                  </div>
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4">
            {menuItems.map((item, index) => {
              // Separador para sección admin
              if (item.separator) {
                return (
                  <div key={index} className="my-6">
                    <div className={`h-px ${isDark ? 'bg-gradient-to-r from-transparent via-slate-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
                    <div className={`mt-4 px-4 py-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
                      <p className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
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
                  className={`flex items-center justify-between px-4 py-3 rounded-xl mb-2 transition-all duration-300 group ${
                    isAdminItem
                      ? isDark
                        ? 'text-purple-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-pink-900/50 border border-transparent hover:border-purple-500/30'
                        : 'text-purple-700 hover:text-purple-900 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border border-transparent hover:border-purple-300'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-slate-900'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className={`p-2 rounded-lg ${
                        isAdminItem
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30'
                          : isDark
                            ? 'bg-slate-800'
                            : 'bg-gray-200'
                      }`}>
                        <Icon className={`w-4 h-4 ${isAdminItem ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
                      item.color === 'red'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer del Sidebar - Logout con mejor diseño */}
          {isAuthenticated && (
            <div className={`sticky bottom-0 left-0 right-0 p-4 border-t ${
              isDark 
                ? 'border-slate-800 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent' 
                : 'border-gray-200 bg-gradient-to-t from-white via-gray-50 to-transparent'
            }`}>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
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