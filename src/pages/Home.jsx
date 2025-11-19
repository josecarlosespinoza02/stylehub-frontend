import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Star, Heart, Eye, TrendingUp, Zap, Award, 
  ChevronRight, Sparkles, Package, Truck, Shield, Users, 
  Scissors, Heart as HeartFilled
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sizes = Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]');
    const colors = Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]');
    
    const defaultSize = sizes[0] || 'M';
    const defaultColor = colors[0] || 'Negro';
    
    addToCart(product, 1, defaultSize, defaultColor);
    
    alert(`✅ ${product.name} agregado al carrito\n📏 Talla: ${defaultSize}\n🎨 Color: ${defaultColor}`);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-red-50 via-white to-green-50'} relative overflow-hidden`}>
      
      {/* 🎄 EFECTOS NAVIDEÑOS ULTRA PREMIUM - FONDO GLOBAL */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradientes navideños intensos y oscuros */}
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] ${isDark ? 'bg-red-900/40' : 'bg-red-900/30'} rounded-full blur-3xl animate-pulse-slow`}></div>
        <div className={`absolute bottom-0 left-0 w-[800px] h-[800px] ${isDark ? 'bg-green-900/40' : 'bg-green-900/30'} rounded-full blur-3xl animate-pulse-slow`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ${isDark ? 'bg-red-800/30' : 'bg-red-800/25'} rounded-full blur-3xl animate-pulse-slow`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/4 right-1/4 w-[600px] h-[600px] ${isDark ? 'bg-green-800/30' : 'bg-green-800/25'} rounded-full blur-3xl animate-pulse-slow`} style={{ animationDelay: '1.5s' }}></div>
        
        {/* COPOS DE NIEVE PREMIUM ANIMADOS */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className={`absolute ${isDark ? 'text-white/25' : 'text-white/20'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 15}px`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate`,
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
              filter: 'blur(0.5px)'
            }}
          >
            ❄️
          </div>
        ))}

        {/* ESTRELLAS BRILLANTES */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 8}px`,
              animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              filter: 'drop-shadow(0 0 8px currentColor)'
            }}
          >
            ✨
          </div>
        ))}
        
        {/* DECORACIONES NAVIDEÑAS GRANDES PREMIUM */}
        <div className="absolute top-32 left-[5%] text-8xl opacity-20 animate-bounce-slow" style={{filter: 'drop-shadow(0 0 40px rgba(239, 68, 68, 0.8))'}}>🎄</div>
        <div className="absolute top-[20%] right-[8%] text-7xl opacity-20 animate-bounce-slow" style={{animationDelay: '1s', filter: 'drop-shadow(0 0 35px rgba(34, 197, 94, 0.8))'}}>🎅</div>
        <div className="absolute top-[40%] left-[12%] text-7xl opacity-15" style={{animation: 'float 6s ease-in-out infinite', filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))'}}>⛄</div>
        <div className="absolute top-[60%] right-[15%] text-7xl opacity-20 animate-bounce-slow" style={{animationDelay: '2s', filter: 'drop-shadow(0 0 35px rgba(239, 68, 68, 0.8))'}}>🎁</div>
        <div className="absolute bottom-[30%] left-[10%] text-6xl opacity-15 animate-bounce-slow" style={{animationDelay: '1.5s', filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))'}}>⭐</div>
        <div className="absolute bottom-[50%] right-[5%] text-8xl opacity-20 animate-bounce-slow" style={{filter: 'drop-shadow(0 0 40px rgba(34, 197, 94, 0.8))'}}>🎄</div>
        <div className="absolute top-[70%] left-[20%] text-6xl animate-spin-slow opacity-15" style={{filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))'}}>❄️</div>
        <div className="absolute top-[15%] right-[25%] text-7xl opacity-20 animate-swing" style={{filter: 'drop-shadow(0 0 35px rgba(251, 191, 36, 0.8))'}}>🔔</div>
        <div className="absolute bottom-[15%] right-[30%] text-7xl opacity-20 animate-bounce-slow" style={{animationDelay: '1.2s', filter: 'drop-shadow(0 0 35px rgba(239, 68, 68, 0.8))'}}>🎅</div>
        <div className="absolute top-[50%] left-[30%] text-6xl animate-spin-slow opacity-15" style={{animationDelay: '3s', filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))'}}>❄️</div>
        <div className="absolute top-[25%] left-[40%] text-7xl opacity-15" style={{animation: 'float 7s ease-in-out infinite alternate', animationDelay: '0.3s', filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.8))'}}>🦌</div>
        <div className="absolute bottom-[40%] right-[20%] text-6xl opacity-20 animate-bounce-slow" style={{animationDelay: '2.5s', filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))'}}>🎁</div>
      </div>

      {/* Hero Section ULTRA PREMIUM */}
      <section className="relative overflow-hidden">
        {/* Gradientes de fondo intensos */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-red-950/50 via-slate-950 to-green-950/50' : 'bg-gradient-to-b from-red-100/50 via-white to-green-100/50'}`}></div>
        
        {/* Luces navideñas decorativas */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-green-500 via-yellow-500 via-red-600 to-green-500 animate-shimmer bg-[length:200%_100%]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Decoraciones navideñas flotantes premium */}
          <div className="absolute top-20 left-10 text-8xl animate-float opacity-30" style={{filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))'}}>🎄</div>
          <div className="absolute top-32 right-20 text-7xl animate-float opacity-30" style={{animationDelay: '1s', filter: 'drop-shadow(0 0 25px rgba(34, 197, 94, 0.8))'}}>🎅</div>
          <div className="absolute bottom-20 left-1/4 text-6xl animate-swing opacity-25" style={{filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))'}}>🔔</div>
          
          <div className="text-center space-y-8 z-10 relative py-12">
            {/* Badge navideño premium */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600/30 via-green-600/30 to-red-600/30 border-2 border-red-500/50 rounded-full backdrop-blur-2xl shadow-2xl shadow-red-500/30 hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className={`text-base font-black ${isDark ? 'text-red-300' : 'text-red-600'} tracking-wide`}>
                🎄 Colección Navideña 2025 🎄
              </span>
              <Sparkles className="w-5 h-5 text-green-400 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>

            {/* Título principal ultra premium */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'} drop-shadow-2xl`}>
              Loyola{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-red-500 via-green-500 via-yellow-500 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_100%]">
                  Crea Tu Estilo
                </span>
                {/* Efecto de brillo debajo del texto */}
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-red-500/50 via-green-500/50 to-red-500/50 blur-xl animate-pulse"></div>
              </span>
            </h1>

            {/* Subtítulo mejorado */}
            <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto leading-relaxed font-semibold`}>
              ✨ Descubre las últimas tendencias en <span className="text-red-500 font-black">hoodies personalizadas</span>. 
              Diseños únicos que combinan <span className="text-green-500 font-black">comodidad y estilo navideño</span>. ✨
            </p>

            {/* Botón CTA ultra premium */}
            <div className="flex flex-wrap gap-6 justify-center pt-4">
              <Link 
                to="/productos"
                className="group relative px-10 py-5 bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 transition-all duration-500 flex items-center gap-3 overflow-hidden animate-shimmer bg-[length:200%_100%]"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">Explorar Ahora</span>
                <Sparkles className="w-6 h-6 animate-pulse relative z-10" />
              </Link>
            </div>

            {/* Features rápidos */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              {[
                { icon: '🎁', text: 'Envío Gratis' },
                { icon: '✨', text: 'Bordados Premium' },
                { icon: '🎅', text: 'Ofertas Navideñas' }
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${isDark ? 'bg-slate-900/70 border-2 border-red-500/40' : 'bg-white border-2 border-red-200'} backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300`}>
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`font-black ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Todos los Productos ULTRA PREMIUM */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10">
        {/* Decoraciones navideñas de sección */}
        <div className="absolute -top-10 left-1/4 text-6xl animate-swing opacity-20" style={{filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))'}}>🔔</div>
        <div className="absolute -top-5 right-1/3 text-5xl animate-float opacity-20" style={{animationDelay: '1s', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))'}}>🎁</div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6">
          <div className="relative">
            {/* Título con efectos premium */}
            <div className="absolute -top-8 -left-8 text-5xl animate-spin-slow opacity-30">❄️</div>
            <h2 className={`text-4xl md:text-5xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'} drop-shadow-xl`}>
              Todos Nuestros Productos
            </h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-red-600 via-green-500 to-red-600 rounded-full mb-3 animate-shimmer bg-[length:200%_100%]"></div>
            <p className={`text-xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
              <Package className="w-6 h-6 text-red-500" />
              {products.length} productos disponibles
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </p>
          </div>
          <Link
            to="/productos"
            className={`group relative px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-110 overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-red-900/50 to-green-900/50 border-2 border-red-500/50 text-white hover:border-red-500/80' 
                : 'bg-gradient-to-r from-red-100 to-green-100 border-2 border-red-300 text-gray-900 hover:border-red-400'
            } backdrop-blur-xl`}
          >
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span className="relative z-10">Ver Todo</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-green-600/30 border-t-green-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
            </div>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center gap-2`}>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              Cargando productos...
              <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl ${isDark ? 'bg-slate-900/70 border-2 border-red-500/30' : 'bg-white border-2 border-red-200'} backdrop-blur-xl shadow-2xl`}>
            <Package className={`w-24 h-24 mx-auto mb-6 ${isDark ? 'text-red-500' : 'text-red-400'} opacity-50`} />
            <p className={`text-2xl font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No hay productos disponibles
            </p>
            <p className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Los productos agregados desde el inventario aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
              const imageUrl = images[0] || 'https://via.placeholder.com/400x600?text=Hoodie';
              
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer ${
                    isDark 
                      ? 'bg-slate-900/70 border-2 border-slate-800 hover:border-red-500/70 shadow-xl shadow-red-500/10' 
                      : 'bg-white border-2 border-gray-200 hover:border-red-500/70 shadow-lg'
                  } backdrop-blur-xl relative hover:scale-105 hover:-translate-y-2`}
                >
                  {/* Decoración navideña en hover */}
                  <div className="absolute -top-4 -right-4 text-4xl animate-bounce-slow z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'}}>🎁</div>
                  
                  {/* Efecto de brillo en el borde */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/0 via-green-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:via-green-500/20 group-hover:to-red-500/20 transition-all duration-500 pointer-events-none"></div>
                  
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=Hoodie';
                      }}
                    />
                    
                    {/* Overlay oscuro en hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {product.badge && (
                      <div className={`absolute top-4 left-4 px-4 py-2 rounded-2xl text-sm font-black shadow-xl backdrop-blur-xl ${
                        product.badge === 'HOT' 
                          ? 'bg-red-600/90 text-white border-2 border-red-400' 
                          : 'bg-green-600/90 text-white border-2 border-green-400'
                      } animate-pulse`}>
                        {product.badge}
                      </div>
                    )}

                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 px-4 py-2 bg-orange-600/90 backdrop-blur-xl text-white text-sm font-black rounded-2xl shadow-xl border-2 border-orange-400 animate-pulse">
                        ¡Solo {product.stock}!
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-black text-2xl drop-shadow-2xl">AGOTADO</span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('❤️ Agregado a favoritos');
                        }}
                        className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:scale-125 hover:rotate-12 shadow-xl"
                      >
                        <Heart className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all hover:scale-125 hover:rotate-12 shadow-xl"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>

                    {product.stock > 0 && (
                      <button 
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="absolute bottom-4 left-4 right-4 py-4 bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white rounded-2xl font-black opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-105 border-2 border-white/30 backdrop-blur-xl"
                      >
                        <ShoppingBag className="w-6 h-6" />
                        Agregar al Carrito
                      </button>
                    )}
                  </div>

                  <div className="p-6 relative z-10">
                    <div className={`text-sm font-black mb-3 uppercase tracking-wide ${isDark ? 'text-red-400' : 'text-red-600'} flex items-center gap-2`}>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                    
                    <h3 className={`text-xl font-black mb-3 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : isDark ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {new Intl.NumberFormat('es-BO', {
                          style: 'currency',
                          currency: 'BOB',
                          minimumFractionDigits: 2
                        }).format(product.price)}
                      </span>
                      {product.old_price && (
                        <>
                          <span className={`text-lg line-through font-semibold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {new Intl.NumberFormat('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                              minimumFractionDigits: 2
                            }).format(product.old_price)}
                          </span>
                          <span className="px-3 py-1 bg-red-500/30 text-red-400 text-sm font-black rounded-full border border-red-500/50 animate-pulse">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className={`w-5 h-5 ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`} />
                      <span className={`text-sm font-bold ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Quiénes Somos ULTRA PREMIUM */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10">
        {/* Decoración navideña premium */}
        <div className="absolute top-10 left-10 text-7xl animate-float opacity-20" style={{filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))'}}>🎄</div>
        <div className="absolute top-20 right-20 text-6xl animate-swing opacity-20" style={{animationDelay: '1s', filter: 'drop-shadow(0 0 25px rgba(34, 197, 94, 0.8))'}}>⛄</div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-float opacity-15" style={{animationDelay: '0.5s', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))'}}>🎁</div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600/30 to-green-600/30 border-2 border-red-500/50 rounded-full backdrop-blur-xl mb-6 shadow-xl">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-red-300' : 'text-red-600'}`}>
              Nuestra Historia
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'} drop-shadow-xl`}>
            Quiénes Somos
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-red-500 mx-auto rounded-full animate-shimmer bg-[length:200%_100%]"></div>
        </div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          {/* Contenido principal PREMIUM */}
          <div className={`relative p-10 md:p-14 rounded-3xl ${isDark ? 'bg-slate-900/80 border-2 border-red-500/40' : 'bg-white border-2 border-red-200'} backdrop-blur-2xl shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
            {/* Efectos de fondo animados */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            {/* Decoración navideña interna */}
            <div className="absolute top-6 right-6 text-3xl animate-spin-slow opacity-20">❄️</div>
            <div className="absolute bottom-6 left-6 text-2xl animate-swing opacity-20">🔔</div>
            
            <div className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'} space-y-8 relative z-10 font-medium`}>
              <p className="text-center text-3xl md:text-4xl font-black bg-gradient-to-r from-red-500 via-green-500 to-red-600 bg-clip-text text-transparent mb-8 drop-shadow-xl">
                ✨ Desde 2018, creando magia bordada ✨
              </p>
              
              <p className="text-xl">
                En <span className="font-black text-red-500 text-2xl">Loyola</span>, transformamos tus ideas en <span className="font-black text-green-500">bordados personalizados de alta calidad</span>. Cada puntada cuenta una historia, cada diseño refleja tu personalidad única.
              </p>
              
              <p className="text-xl">
                Nos especializamos en <span className="font-bold">hoodies, crew necks, poleras y gorras</span> confeccionadas con <span className="font-black text-red-500">algodón 100% boliviano 🇧🇴</span> y elaboradas por artesanos locales con años de experiencia.
              </p>

              <div className={`text-center text-2xl md:text-3xl font-black my-10 py-6 rounded-3xl relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-red-900/50 to-green-900/50 border-2 border-red-500/50' : 'bg-gradient-to-r from-red-100 to-green-100 border-2 border-red-300'} shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer-slow"></div>
                <p className={`relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  🧵 Algodón boliviano + Talento local = Calidad excepcional 🧵
                </p>
              </div>

              <div className={`p-8 md:p-10 rounded-3xl relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-red-900/40 to-green-900/40 border-2 border-red-500/50' : 'bg-gradient-to-br from-red-100 to-green-100 border-2 border-red-300'} shadow-2xl`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                
                <p className={`text-3xl md:text-4xl font-black mb-5 ${isDark ? 'text-white' : 'text-gray-900'} text-center drop-shadow-xl relative z-10 flex items-center justify-center gap-3`}>
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                  Tú imaginas, nosotros lo bordamos
                  <Sparkles className="w-8 h-8 text-green-400 animate-pulse" />
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'} text-center text-xl font-semibold relative z-10`}>
                  Desde ilustraciones y frases inspiradoras hasta diseños corporativos, cada prenda es única y hecha especialmente para ti. Sin mínimos de pedido, con la máxima atención al detalle.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-800/70 border-2 border-red-500/30' : 'bg-gray-50 border-2 border-red-200'} hover:scale-105 transition-all duration-300 shadow-xl backdrop-blur-xl`}>
                  <h4 className={`font-black text-2xl mb-5 flex items-center gap-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    Nuestra Promesa
                  </h4>
                  <ul className={`space-y-3 ${isDark ? 'text-gray-200' : 'text-gray-700'} text-lg font-semibold`}>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Bordados de alta durabilidad
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Atención personalizada
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Entregas puntuales
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Diseños ilimitados
                    </li>
                  </ul>
                </div>
                
                <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-800/70 border-2 border-green-500/30' : 'bg-gray-50 border-2 border-green-200'} hover:scale-105 transition-all duration-300 shadow-xl backdrop-blur-xl`}>
                  <h4 className={`font-black text-2xl mb-5 flex items-center gap-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    Valores que nos definen
                  </h4>
                  <ul className={`space-y-3 ${isDark ? 'text-gray-200' : 'text-gray-700'} text-lg font-semibold`}>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Compromiso con la calidad
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Apoyo al talento local
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Productos sustentables
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Pasión por el detalle
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de características PREMIUM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Scissors, label: 'Bordados Premium', desc: 'Alta calidad garantizada', color: 'from-red-500 to-green-500', emoji: '✨' },
              { icon: Users, label: 'Talento Local', desc: 'Artesanos bolivianos expertos', color: 'from-blue-500 to-cyan-500', emoji: '🇧🇴' },
              { icon: HeartFilled, label: '100% Boliviano', desc: 'Algodón nacional de primera', color: 'from-green-500 to-emerald-500', emoji: '💚' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`group p-8 rounded-3xl text-center ${isDark ? 'bg-slate-900/80 border-2 border-slate-800 hover:border-red-500/70' : 'bg-white border-2 border-gray-200 hover:border-red-500/70'} backdrop-blur-xl hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-red-500/30 relative overflow-hidden`}>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-green-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-green-500/10 group-hover:to-red-500/10 transition-all duration-500"></div>
                  
                  <div className={`w-20 h-20 mx-auto mb-5 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center transform group-hover:scale-125 group-hover:rotate-12 transition-all shadow-2xl relative z-10`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <p className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'} relative z-10 flex items-center justify-center gap-2`}>
                    {item.label}
                    <span className="text-2xl">{item.emoji}</span>
                  </p>
                  
                  <p className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} relative z-10`}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Banner Promocional ULTRA PREMIUM */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-red-600 via-green-600 via-red-600 to-green-600 p-10 md:p-16 shadow-2xl animate-shimmer bg-[length:200%_100%] group">
          {/* Efectos decorativos premium */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>

          {/* Elementos navideños flotantes premium */}
          <div className="absolute top-6 left-6 text-7xl animate-float opacity-30" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))'}}>🎄</div>
          <div className="absolute bottom-6 right-6 text-7xl animate-swing opacity-30" style={{animationDelay: '0.5s', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))'}}>⛄</div>
          <div className="absolute top-1/2 left-1/4 text-6xl animate-spin-slow opacity-20" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))'}}>❄️</div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/30 backdrop-blur-2xl rounded-2xl mb-8 shadow-xl border border-white/50">
                <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                <span className="text-base font-black text-white uppercase tracking-wide">
                  🎄 Oferta Navideña Especial 🎄
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                ¡Diseños únicos para ti esta Navidad!
              </h2>
              
              <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed font-bold drop-shadow-lg">
                ✨ Aprovecha nuestras ofertas exclusivas en bordados personalizados. Haz que tus regalos sean inolvidables. ✨
              </p>

              <Link
                to="/ofertas"
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-red-600 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-white/50 transform hover:scale-110 transition-all duration-500 group/btn relative overflow-hidden"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative z-10">Comprar Ahora</span>
                <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                <Sparkles className="w-6 h-6 animate-pulse relative z-10" />
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 group-hover:scale-110 transition-all duration-500">
                  <div className="text-center">
                    <Scissors className="w-32 h-32 text-white mx-auto mb-6 drop-shadow-2xl group-hover:rotate-12 transition-transform duration-500" />
                    <div className="text-4xl font-black text-white drop-shadow-xl">Bordados</div>
                    <div className="text-2xl font-bold text-white/90">Premium</div>
                  </div>
                </div>
                {/* Círculos decorativos animados */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-yellow-400/60 rounded-full animate-pulse shadow-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-400/60 rounded-full animate-pulse shadow-2xl" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-10 w-20 h-20 bg-red-400/60 rounded-full animate-pulse shadow-2xl" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features ULTRA PREMIUM */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              icon: Truck,
              title: 'Envío Rápido',
              description: 'Entrega en 24-48 horas a todo el país',
              color: 'from-yellow-500 to-orange-500',
              emoji: '🚚'
            },
            {
              icon: Award,
              title: 'Calidad Premium',
              description: 'Productos certificados y de alta calidad',
              color: 'from-red-500 to-green-500',
              emoji: '🏆'
            },
            {
              icon: Shield,
              title: 'Compra Segura',
              description: 'Pago protegido y devoluciones gratis',
              color: 'from-blue-500 to-cyan-500',
              emoji: '🛡️'
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative p-8 md:p-10 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-110 ${
                  isDark
                    ? 'bg-slate-900/80 border-2 border-slate-800 hover:border-red-500/70 shadow-xl'
                    : 'bg-white border-2 border-gray-200 hover:border-red-500/70 shadow-lg'
                } backdrop-blur-xl overflow-hidden`}
              >
                {/* Efecto de brillo de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-green-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-green-500/10 group-hover:to-red-500/10 transition-all duration-700"></div>
                
                {/* Decoración navideña flotante */}
                <div className="absolute -top-3 -right-3 text-4xl animate-float opacity-0 group-hover:opacity-30 transition-opacity duration-500" style={{filter: 'drop-shadow(0 0 10px currentColor)'}}>
                  {feature.emoji}
                </div>
                
                <div className={`relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mb-6 md:mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl z-10`}>
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                
                <h3 className={`text-2xl md:text-3xl font-black mb-3 relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-base md:text-lg font-semibold relative z-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>

                {/* Indicador decorativo */}
                <div className={`absolute bottom-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity shadow-xl animate-pulse`}></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CSS Animations PREMIUM */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }
        
        @keyframes swing {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.8);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.7; 
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}