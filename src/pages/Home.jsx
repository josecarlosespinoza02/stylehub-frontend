import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Star, Heart, Eye, TrendingUp, Zap, Award, 
  ChevronRight, Sparkles, Package, Truck, Shield, Users, 
  Scissors, Heart as HeartFilled, Gift, Snowflake
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
    
    // Usa la función addToCart que recibes de props
    if (addToCart) {
      addToCart(product, 1, defaultSize, defaultColor);
    }
    
    alert(`✅ ${product.name} agregado al carrito\n📏 Talla: ${defaultSize}\n🎨 Color: ${defaultColor}`);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-sky-50 via-white to-blue-50'} relative overflow-hidden transition-colors duration-700`}>
      
      {/* ❄️ EFECTOS NAVIDEÑOS PREMIUM - Nieve + Luces */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradientes navideños base más intensos */}
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] ${isDark ? 'bg-red-900/20' : 'bg-red-200/40'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 left-0 w-[800px] h-[800px] ${isDark ? 'bg-green-900/20' : 'bg-green-200/40'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/3 left-1/3 w-[600px] h-[600px] ${isDark ? 'bg-blue-900/15' : 'bg-blue-200/30'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        
        {/* Luces navideñas bokeh */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`bokeh-${i}`}
            className={`absolute rounded-full ${isDark ? 'bg-gradient-to-br from-red-500/30 to-green-500/30' : 'bg-gradient-to-br from-red-400/20 to-green-400/20'} blur-xl`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate`
            }}
          />
        ))}
        
        {/* Copos de nieve premium - más densos */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className={`absolute text-2xl ${isDark ? 'text-white/40' : 'text-blue-400/60'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animation: `snowfall ${5 + Math.random() * 15}s linear ${Math.random() * 8}s infinite`,
              textShadow: isDark ? '0 0 10px rgba(255,255,255,0.5)' : '0 0 10px rgba(59,130,246,0.5)'
            }}
          >
            ❄️
          </div>
        ))}
        
        {/* Estrellas brillantes con efecto fuerte */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute ${isDark ? 'text-yellow-400/60' : 'text-yellow-500/70'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
              animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite alternate`,
              filter: 'drop-shadow(0 0 8px currentColor)'
            }}
          >
            ✨
          </div>
        ))}

        {/* Decoraciones navideñas flotantes más grandes */}
        <div className={`absolute top-32 left-[5%] text-7xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '3s', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5)'}}>🎄</div>
        <div className={`absolute top-[20%] right-[8%] text-6xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '4s', animationDelay: '1s', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5)'}}>🎁</div>
        <div className={`absolute top-[40%] left-[12%] text-6xl animate-bounce ${isDark ? 'opacity-12' : 'opacity-20'}`} style={{animationDuration: '3.5s', animationDelay: '0.5s', filter: 'drop-shadow(0 0 15px rgba(234, 179, 8, 0.5)'}}>⭐</div>
        <div className={`absolute top-[60%] right-[15%] text-6xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '4.5s', animationDelay: '2s', filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.5)'}}>🔔</div>
        <div className={`absolute bottom-[30%] left-[10%] text-5xl animate-bounce ${isDark ? 'opacity-12' : 'opacity-20'}`} style={{animationDuration: '3.8s', animationDelay: '1.5s', filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.5)'}}>🎅</div>
        <div className={`absolute bottom-[50%] right-[5%] text-7xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '4.2s', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5)'}}>🎄</div>
        <div className={`absolute top-[15%] right-[25%] text-6xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '3.3s', animationDelay: '0.8s', filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.5)'}}>🎀</div>
        <div className={`absolute bottom-[15%] right-[30%] text-6xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '4.8s', animationDelay: '1.2s', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5)'}}>🎄</div>
        <div className={`absolute top-[50%] left-[35%] text-5xl ${isDark ? 'opacity-12' : 'opacity-20'}`} style={{animation: 'float 8s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5)'}}>⛄</div>
      </div>

      {/* Hero Section Navideño Premium */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          
          {/* Decoraciones hero más grandes con glow */}
          <div className={`absolute top-10 left-10 text-8xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '3s', filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.6))'}}>🎄</div>
          <div className={`absolute bottom-10 right-10 text-7xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '3.5s', animationDelay: '1s', filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.6))'}}>🎁</div>
          
          <br />
          <br />
          <div className="text-center space-y-8 z-10 relative">
            {/* Badge navideño premium con glow */}
            <div className={`inline-flex items-center gap-3 px-8 py-4 ${
              isDark 
                ? 'bg-gradient-to-r from-red-600/30 to-green-600/30 border-2 border-red-500/50' 
                : 'bg-gradient-to-r from-red-100 to-green-100 border-2 border-red-400'
            } rounded-full backdrop-blur-xl shadow-2xl`} style={{
              boxShadow: isDark ? '0 0 40px rgba(239, 68, 68, 0.3), 0 0 60px rgba(34, 197, 94, 0.2)' : '0 10px 40px rgba(239, 68, 68, 0.2)'
            }}>
              <Sparkles className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-red-600'} animate-pulse`} style={{filter: 'drop-shadow(0 0 8px currentColor)'}} />
              <span className={`text-lg font-black tracking-wide ${isDark ? 'text-white' : 'text-red-800'}`}>
                🎄 ESPECIAL NAVIDAD 2024 🎄
              </span>
              <Snowflake className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-spin`} style={{animationDuration: '4s', filter: 'drop-shadow(0 0 8px currentColor)'}} />
            </div>

            {/* Título con glow navideño */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`} style={{
              textShadow: isDark ? '0 0 40px rgba(239, 68, 68, 0.3), 0 0 60px rgba(34, 197, 94, 0.2)' : 'none'
            }}>
              Loyola{' '}
              <span className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent animate-pulse bg-[length:200%_auto]">
                Crea Tu Estilo
              </span>
            </h1>

            {/* Subtítulo con más impacto */}
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto font-semibold ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
              ✨ Regalos perfectos para esta Navidad ✨<br/>
              <span className={isDark ? 'text-red-400' : 'text-red-600'}>Bordados personalizados</span> con el espíritu de la temporada
            </p>

            {/* CTAs mejorados con glow */}
            <div className="flex flex-wrap gap-6 justify-center pt-4">
              <a 
                href="/productos"
                className="group px-10 py-5 bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 transform hover:scale-110 bg-[length:200%_auto] hover:bg-right"
                style={{
                  boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4), 0 10px 60px rgba(34, 197, 94, 0.3)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Explorar Regalos
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <br/>
      <br/>

      {/* Productos Section con diseño premium */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className={`text-4xl md:text-5xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{
              textShadow: isDark ? '0 0 30px rgba(239, 68, 68, 0.2)' : 'none'
            }}>
              🎁 Todos Nuestros Productos
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {products.length} productos especiales para Navidad
            </p>
          </div>
          <a
            href="/productos"
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
              isDark 
                ? 'bg-gradient-to-r from-red-600/20 to-green-600/20 border-2 border-red-500/30 text-white hover:border-red-500 backdrop-blur-xl' 
                : 'bg-white border-2 border-red-300 text-gray-900 hover:border-red-500 shadow-lg'
            } transform hover:scale-105`}
          >
            Ver Todo
            <ChevronRight className="w-6 h-6" />
          </a>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 border-4 ${
              isDark ? 'border-red-600 border-t-green-600' : 'border-red-400 border-t-green-400'
            } rounded-full animate-spin mx-auto mb-6`} style={{
              filter: isDark ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))' : 'none'
            }}></div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cargando productos navideños... 🎄
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className={`w-24 h-24 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No hay productos disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
              const imageUrl = images[0] || 'https://via.placeholder.com/400x600?text=Hoodie';
              
              return (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer ${
                    isDark 
                      ? 'bg-slate-900/80 border-2 border-slate-800 hover:border-red-500/60 backdrop-blur-xl' 
                      : 'bg-white border-2 border-gray-200 hover:border-red-400 shadow-lg'
                  } relative transform hover:scale-105`}
                  style={{
                    boxShadow: isDark ? 'none' : '0 10px 40px rgba(0,0,0,0.1)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (isDark) {
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(239, 68, 68, 0.3), 0 20px 80px rgba(34, 197, 94, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isDark) {
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Decoración navideña mejorada */}
                  <div className="absolute -top-4 -right-4 text-5xl z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" style={{filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))'}}>
                    🎄
                  </div>
                  
                  {/* Copos de nieve con glow */}
                  <div className={`absolute top-4 left-4 text-2xl opacity-0 group-hover:opacity-80 transition-opacity z-20 ${isDark ? 'text-white' : 'text-blue-400'}`} style={{filter: 'drop-shadow(0 0 10px currentColor)', animation: 'float 3s ease-in-out infinite'}}>❄️</div>
                  <div className={`absolute top-4 right-16 text-2xl opacity-0 group-hover:opacity-80 transition-opacity z-20 ${isDark ? 'text-white' : 'text-blue-400'}`} style={{filter: 'drop-shadow(0 0 10px currentColor)', animation: 'float 3s ease-in-out 0.5s infinite'}}>❄️</div>
                  
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=Hoodie';
                      }}
                    />
                    
                    {/* Overlay navideño en hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-green-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {product.badge && (
                      <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-black ${
                        product.badge === 'HOT' 
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      } shadow-xl animate-pulse`} style={{
                        boxShadow: product.badge === 'HOT' 
                          ? '0 0 20px rgba(239, 68, 68, 0.6)' 
                          : '0 0 20px rgba(34, 197, 94, 0.6)'
                      }}>
                        {product.badge}
                      </div>
                    )}

                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-black rounded-full shadow-xl animate-bounce" style={{
                        boxShadow: '0 0 20px rgba(234, 88, 12, 0.6)'
                      }}>
                        ¡Solo {product.stock}!
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-black text-2xl">AGOTADO</span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('❤️ Agregado a favoritos');
                        }}
                        className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:scale-110 shadow-xl"
                      >
                        <Heart className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all hover:scale-110 shadow-xl"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>

                    {product.stock > 0 && (
                      <button 
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="absolute bottom-4 left-4 right-4 py-4 bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white rounded-2xl font-black text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-2xl bg-[length:200%_auto] hover:bg-right"
                        style={{
                          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5), 0 10px 50px rgba(34, 197, 94, 0.4)'
                        }}
                      >
                        <ShoppingBag className="w-6 h-6" />
                        Agregar al Carrito
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className={`text-sm font-bold mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                    
                    <h3 className={`text-xl font-black mb-3 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                                : isDark ? 'text-gray-700' : 'text-gray-300'
                            }`}
                            style={{
                              filter: i < Math.floor(product.rating) ? 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))' : 'none'
                            }}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                          <span className={`text-xl line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {new Intl.NumberFormat('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                              minimumFractionDigits: 2
                            }).format(product.old_price)}
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-black rounded-full animate-pulse shadow-lg" style={{
                            boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                          }}>
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className={`w-5 h-5 ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`} style={{
                        filter: 'drop-shadow(0 0 4px currentColor)'
                      }} />
                      <span className={`text-sm font-bold ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* Quiénes Somos */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10">
        <div className={`absolute top-10 left-10 text-8xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '3s', filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.5))'}}>🎄</div>
        <div className={`absolute top-20 right-20 text-7xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '4s', animationDelay: '1s', filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.5))'}}>🎁</div>

        <div className="text-center mb-12 relative z-10">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{
            textShadow: isDark ? '0 0 30px rgba(239, 68, 68, 0.2)' : 'none'
          }}>
            Quiénes Somos
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500 mx-auto rounded-full shadow-lg" style={{
            boxShadow: isDark ? '0 0 20px rgba(239, 68, 68, 0.4), 0 0 30px rgba(34, 197, 94, 0.3)' : 'none'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className={`p-8 md:p-12 rounded-3xl ${isDark ? 'bg-slate-900/90 border-2 border-slate-800' : 'bg-white border-2 border-gray-200'} backdrop-blur-xl shadow-2xl relative overflow-hidden`}>
            <div className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'} space-y-6 relative z-10`}>
              <p className="text-center text-2xl md:text-3xl font-black bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent mb-6">
                Desde 2018, creando magia bordada
              </p>
              
              <p>
                En <span className="font-black text-red-500">Loyola</span>, transformamos tus ideas en <span className="font-black text-green-500">bordados personalizados de alta calidad</span>. Cada puntada cuenta una historia, cada diseño refleja tu personalidad única.
              </p>
              
              <p>
                Nos especializamos en <span className="font-semibold">hoodies, crew necks, poleras y gorras</span> confeccionadas con <span className="font-black text-red-500">algodón 100% boliviano</span> y elaboradas por artesanos locales con años de experiencia.
              </p>

              <p className="text-center text-xl md:text-2xl font-black text-green-500 my-8 py-4 border-y-2 border-green-500/40">
                🧵 Algodón boliviano + Talento local = Calidad excepcional 🧵
              </p>

              <div className={`p-6 md:p-8 rounded-2xl ${isDark ? 'bg-gradient-to-br from-red-900/30 to-green-900/30 border-2 border-red-500/40' : 'bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-300'} relative shadow-xl`}>
                <p className={`text-2xl md:text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  🎨 Tú imaginas, nosotros lo bordamos 🎨
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-center text-lg font-semibold`}>
                  Desde ilustraciones y frases inspiradoras hasta diseños corporativos, cada prenda es única y hecha especialmente para ti. Sin mínimos de pedido, con la máxima atención al detalle.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-gray-50'} border-2 ${isDark ? 'border-red-500/30' : 'border-red-200'}`}>
                  <h4 className={`font-black text-lg mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    ✨ Nuestra Promesa
                  </h4>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                    <li>• Bordados de alta durabilidad</li>
                    <li>• Atención personalizada</li>
                    <li>• Entregas puntuales</li>
                    <li>• Diseños ilimitados</li>
                  </ul>
                </div>
                
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-gray-50'} border-2 ${isDark ? 'border-green-500/30' : 'border-green-200'}`}>
                  <h4 className={`font-black text-lg mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    💝 Valores que nos definen
                  </h4>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                    <li>• Compromiso con la calidad</li>
                    <li>• Apoyo al talento local</li>
                    <li>• Productos sustentables</li>
                    <li>• Pasión por el detalle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de características */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Scissors, label: 'Bordados Premium', desc: 'Alta calidad garantizada', color: 'from-red-500 to-pink-500' },
              { icon: Users, label: 'Talento Local', desc: 'Artesanos bolivianos expertos', color: 'from-green-500 to-emerald-500' },
              { icon: HeartFilled, label: '100% Boliviano', desc: 'Algodón nacional de primera', color: 'from-red-500 to-orange-500' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`group p-8 rounded-2xl text-center ${isDark ? 'bg-slate-900/90 border-2 border-slate-800' : 'bg-white border-2 border-gray-200'} hover:scale-105 transition-all duration-500 shadow-xl backdrop-blur-xl`}
                  style={{
                    boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (isDark) {
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(239, 68, 68, 0.3), 0 20px 80px rgba(34, 197, 94, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isDark) {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
                    }
                  }}
                >
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all shadow-2xl`}
                    style={{
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4), 0 10px 40px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <p className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Banner Promocional */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-8 md:p-16 shadow-2xl" style={{
          boxShadow: '0 20px 80px rgba(239, 68, 68, 0.4), 0 20px 100px rgba(34, 197, 94, 0.3)'
        }}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="absolute top-6 left-6 text-7xl animate-bounce opacity-30" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'}}>🎄</div>
          <div className="absolute bottom-6 right-6 text-7xl animate-bounce opacity-30" style={{animationDelay: '0.5s', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'}}>🎁</div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-xl rounded-full mb-6">
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-black text-white">
                  Oferta Limitada
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{
                textShadow: '0 0 30px rgba(0,0,0,0.3)'
              }}>
                ¡Diseños únicos para ti!
              </h2>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 font-semibold">
                Aprovecha nuestras ofertas exclusivas en bordados personalizados de Navidad
              </p>

              <a
                href="/ofertas"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-600 rounded-2xl font-black text-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                style={{
                  boxShadow: '0 10px 40px rgba(255,255,255,0.3)'
                }}
              >
                Comprar Ahora
                <ChevronRight className="w-6 h-6" />
              </a>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <Scissors className="w-28 h-28 text-white mx-auto mb-4" style={{
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'
                    }} />
                    <div className="text-3xl font-black text-white">Bordados</div>
                    <div className="text-xl text-white/90 font-bold">Premium</div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400/50 rounded-full animate-pulse shadow-xl" style={{
                  boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)'
                }}></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-pink-400/50 rounded-full animate-pulse shadow-xl" style={{
                  animationDelay: '0.5s',
                  boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: '🎁 Envío Rápido',
              description: 'Entrega en 24-48 horas a todo el país',
              color: isDark ? 'from-red-600 to-orange-600' : 'from-red-500 to-orange-500',
            },
            {
              icon: Award,
              title: '⭐ Calidad Premium',
              description: 'Productos certificados y de alta calidad',
              color: isDark ? 'from-green-600 to-emerald-600' : 'from-green-500 to-emerald-500',
            },
            {
              icon: Shield,
              title: '🎄 Compra Segura',
              description: 'Pago protegido y devoluciones gratis',
              color: isDark ? 'from-blue-600 to-cyan-600' : 'from-blue-500 to-cyan-500',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group p-8 md:p-10 rounded-3xl transition-all duration-500 hover:shadow-2xl ${
                  isDark
                    ? 'bg-slate-900/90 border-2 border-slate-800 hover:border-red-500/50'
                    : 'bg-white border-2 border-gray-200 hover:border-red-400 shadow-lg'
                } backdrop-blur-xl transform hover:scale-105`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-2xl`}
                  style={{
                    boxShadow: isDark ? '0 10px 40px rgba(239, 68, 68, 0.3), 0 10px 50px rgba(34, 197, 94, 0.2)' : '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className={`text-xl md:text-2xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Animaciones CSS avanzadas */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}