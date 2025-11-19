import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Star, Heart, Eye, TrendingUp, Sparkles, 
  Package, Truck, Shield, Users, Scissors, ChevronRight,
  Zap, Award, Gift, Snowflake, Calendar
} from 'lucide-react';

const API_URL = 'https://stylehub-backend-1-zeja.onrender.com/api';

export default function ChristmasHome() {
  const [isDark, setIsDark] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

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

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    alert(`✅ ${product.name} agregado al carrito`);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-sky-50 via-white to-blue-50'} relative overflow-hidden transition-colors duration-500`}>
      
      {/* ❄️ EFECTOS NAVIDEÑOS ANIMADOS - NIEVE Y ESTRELLAS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradientes de fondo navideños */}
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${isDark ? 'bg-red-600/10' : 'bg-red-200/30'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${isDark ? 'bg-green-600/10' : 'bg-green-200/30'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-200/30'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        
        {/* Copos de nieve flotantes - más densos */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className={`absolute text-2xl ${isDark ? 'text-white/40' : 'text-blue-300/60'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationName: 'snowfall',
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear'
            }}
          >
            ❄️
          </div>
        ))}
        
        {/* Estrellas brillantes navideñas */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute ${isDark ? 'text-yellow-300/50' : 'text-yellow-400/60'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationName: 'twinkle',
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
              animationIterationCount: 'infinite',
              animationDirection: 'alternate'
            }}
          >
            ✨
          </div>
        ))}

        {/* Decoraciones navideñas flotantes */}
        <div className={`absolute top-[10%] left-[5%] text-5xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '3s'}}>🎄</div>
        <div className={`absolute top-[20%] right-[8%] text-4xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '4s', animationDelay: '1s'}}>🎁</div>
        <div className={`absolute top-[40%] left-[10%] text-4xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>⭐</div>
        <div className={`absolute top-[60%] right-[12%] text-4xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '4.5s', animationDelay: '2s'}}>🔔</div>
        <div className={`absolute bottom-[30%] left-[15%] text-3xl animate-bounce ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationDuration: '3.8s', animationDelay: '1.5s'}}>🎅</div>
        <div className={`absolute bottom-[50%] right-[5%] text-5xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '4.2s'}}>🎄</div>
        <div className={`absolute top-[70%] left-[25%] text-3xl ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationName: 'float', animationDuration: '6s', animationIterationCount: 'infinite'}}>❄️</div>
        <div className={`absolute top-[15%] right-[20%] text-4xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '3.3s', animationDelay: '0.8s'}}>🎀</div>
        <div className={`absolute bottom-[15%] right-[25%] text-4xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-30'}`} style={{animationDuration: '4.8s', animationDelay: '1.2s'}}>🎄</div>
        <div className={`absolute top-[50%] left-[35%] text-3xl ${isDark ? 'opacity-15' : 'opacity-25'}`} style={{animationName: 'float', animationDuration: '8s', animationIterationCount: 'infinite', animationDelay: '2s'}}>⛄</div>
      </div>

      {/* Toggle de Tema - Navideño */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 z-50 w-14 h-14 rounded-full ${
          isDark 
            ? 'bg-gradient-to-br from-red-600 to-green-600 shadow-lg shadow-red-500/50' 
            : 'bg-gradient-to-br from-blue-400 to-sky-300 shadow-lg shadow-blue-400/50'
        } flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300`}
        title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
      >
        {isDark ? '🌙' : '☀️'}
      </button>

      {/* Hero Section Navideño */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          
          {/* Decoraciones navideñas grandes en el hero */}
          <div className={`absolute top-10 left-10 text-8xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-25'}`} style={{animationDuration: '3s'}}>🎄</div>
          <div className={`absolute bottom-10 right-10 text-7xl animate-bounce ${isDark ? 'opacity-20' : 'opacity-25'}`} style={{animationDuration: '3.5s', animationDelay: '1s'}}>🎁</div>
          
          <div className="text-center space-y-8 z-10 relative">
            {/* Badge navideño */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 ${
              isDark 
                ? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border border-red-500/30' 
                : 'bg-gradient-to-r from-red-100 to-green-100 border border-red-300'
            } rounded-full backdrop-blur-xl shadow-2xl`}>
              <Gift className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'} animate-pulse`} />
              <span className={`text-sm font-bold ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                🎄 ESPECIAL NAVIDAD 2024 🎄
              </span>
              <Snowflake className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-spin`} style={{animationDuration: '3s'}} />
            </div>

            {/* Título principal con efecto de nieve */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Loyola{' '}
              <span className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                Crea Tu Estilo
              </span>
            </h1>

            {/* Subtítulo navideño */}
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              ✨ Regalos perfectos para esta Navidad ✨<br/>
              Bordados personalizados con el espíritu de la temporada
            </p>

            {/* Contador regresivo navideño */}
            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${
              isDark 
                ? 'bg-slate-800/80 border border-red-500/30' 
                : 'bg-white/80 border border-red-300'
            } backdrop-blur-xl shadow-xl`}>
              <Calendar className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Días para Navidad</p>
                <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {Math.max(0, Math.ceil((new Date('2024-12-25') - new Date()) / (1000 * 60 * 60 * 24)))}
                </p>
              </div>
            </div>

            {/* CTA Navideños */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <button className="group px-10 py-5 bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
                <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Ver Regalos Navideños
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                isDark
                  ? 'bg-slate-800/80 text-white border-2 border-green-500 hover:bg-slate-700'
                  : 'bg-white text-gray-900 border-2 border-green-600 hover:bg-gray-50'
              } backdrop-blur-xl hover:scale-105`}>
                <Snowflake className="w-6 h-6" />
                Ofertas Especiales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Promocional Navideño */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-12 md:p-16 shadow-2xl">
          {/* Efectos decorativos */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Decoraciones navideñas */}
          <div className="absolute top-6 left-6 text-6xl animate-bounce opacity-30">🎄</div>
          <div className="absolute bottom-6 right-6 text-6xl animate-bounce opacity-30" style={{animationDelay: '0.5s'}}>🎁</div>
          <div className="absolute top-1/2 left-1/4 text-5xl opacity-20" style={{animationName: 'float', animationDuration: '4s', animationIterationCount: 'infinite'}}>❄️</div>
          <div className="absolute top-1/4 right-1/3 text-5xl opacity-20" style={{animationName: 'float', animationDuration: '5s', animationIterationCount: 'infinite', animationDelay: '1s'}}>⭐</div>

          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">
                SUPER OFERTA NAVIDEÑA
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white">
              🎅 ¡Hasta 40% OFF en selección navideña! 🎄
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Personaliza tus regalos con diseños exclusivos de temporada
            </p>

            <button className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-600 rounded-2xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Comprar Ahora
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Productos Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className={`text-4xl md:text-5xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎁 Regalos Perfectos
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {products.length} productos especiales para Navidad
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className={`w-20 h-20 border-4 ${
              isDark ? 'border-red-600 border-t-green-600' : 'border-red-400 border-t-green-400'
            } rounded-full animate-spin mx-auto mb-6`}></div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cargando regalos navideños... 🎄
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
              const imageUrl = images[0] || 'https://via.placeholder.com/400x600?text=Producto';
              
              return (
                <div
                  key={product.id}
                  className={`group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer relative ${
                    isDark 
                      ? 'bg-slate-900/80 border-2 border-slate-800 hover:border-red-500/50' 
                      : 'bg-white border-2 border-gray-200 hover:border-red-400/50 shadow-lg'
                  } backdrop-blur-xl transform hover:scale-105`}
                >
                  {/* Decoración navideña en hover */}
                  <div className="absolute -top-4 -right-4 text-5xl z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12">
                    🎄
                  </div>
                  
                  {/* Copos de nieve en la imagen */}
                  <div className="absolute top-2 left-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 animate-pulse">❄️</div>
                  <div className="absolute top-2 right-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
                  
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=Producto';
                      }}
                    />
                    
                    {/* Badge navideño */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-red-600 to-green-600 text-white text-sm font-black rounded-full shadow-lg animate-pulse">
                      🎁 REGALO IDEAL
                    </div>

                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-lg animate-bounce">
                        ¡Solo {product.stock}! 🔥
                      </div>
                    )}

                    {/* Botones de acción navideños */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button className="w-14 h-14 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:scale-110 shadow-xl">
                        <Heart className="w-6 h-6" />
                      </button>
                      <button className="w-14 h-14 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all hover:scale-110 shadow-xl">
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>

                    {product.stock > 0 && (
                      <button 
                        onClick={() => addToCart(product)}
                        className="absolute bottom-4 left-4 right-4 py-4 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-2xl font-black opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-2xl text-lg"
                      >
                        <ShoppingBag className="w-6 h-6" />
                        Agregar al Carrito
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className={`text-sm font-bold mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
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
                              i < Math.floor(product.rating || 4)
                                ? 'text-yellow-400 fill-yellow-400'
                                : isDark ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({product.reviews || 0})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Bs{product.price?.toFixed(2)}
                      </span>
                      {product.old_price && (
                        <>
                          <span className={`text-xl line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            Bs{product.old_price.toFixed(2)}
                          </span>
                          <span className="px-3 py-1 bg-red-500 text-white text-sm font-black rounded-full animate-pulse">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
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
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Features Navideños */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: '🎁 Envío Express Navideño',
              description: 'Llega antes de Navidad - Garantizado',
              color: isDark ? 'from-red-600 to-red-800' : 'from-red-400 to-red-600',
            },
            {
              icon: Award,
              title: '⭐ Calidad Premium',
              description: 'Bordados especiales para regalar',
              color: isDark ? 'from-green-600 to-green-800' : 'from-green-400 to-green-600',
            },
            {
              icon: Shield,
              title: '🎄 Satisfacción Garantizada',
              description: 'Cambios y devoluciones sin problema',
              color: isDark ? 'from-blue-600 to-blue-800' : 'from-blue-400 to-blue-600',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                  isDark
                    ? 'bg-slate-900/80 border-2 border-slate-800 hover:border-red-500/50'
                    : 'bg-white border-2 border-gray-200 hover:border-red-400/50 shadow-lg'
                } backdrop-blur-xl`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

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
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}