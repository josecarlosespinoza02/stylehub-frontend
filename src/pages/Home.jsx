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
      
      {/* 🎄 EFECTOS NAVIDEÑOS - FONDO GLOBAL */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Efectos de fondo con colores navideños */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* COPOS DE NIEVE ANIMADOS */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s'}}></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-blue-100/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '9s', animationDelay: '4s'}}></div>
        
        {/* ELEMENTOS NAVIDEÑOS FLOTANTES - SUTILES */}
        <div className="absolute top-32 left-[5%] text-5xl animate-bounce opacity-10" style={{animationDuration: '3s'}}>🎄</div>
        <div className="absolute top-[20%] right-[8%] text-4xl animate-bounce opacity-10" style={{animationDuration: '4s', animationDelay: '1s'}}>🎅</div>
        <div className="absolute top-[40%] left-[12%] text-4xl animate-bounce opacity-8" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>⛄</div>
        <div className="absolute top-[60%] right-[15%] text-4xl animate-bounce opacity-10" style={{animationDuration: '4.5s', animationDelay: '2s'}}>🎁</div>
        <div className="absolute bottom-[30%] left-[10%] text-3xl animate-bounce opacity-8" style={{animationDuration: '3.8s', animationDelay: '1.5s'}}>⭐</div>
        <div className="absolute bottom-[50%] right-[5%] text-5xl animate-bounce opacity-10" style={{animationDuration: '4.2s'}}>🎄</div>
        <div className="absolute top-[70%] left-[20%] text-3xl animate-spin opacity-8" style={{animationDuration: '10s'}}>❄️</div>
        <div className="absolute top-[15%] right-[25%] text-4xl animate-bounce opacity-10" style={{animationDuration: '3.3s', animationDelay: '0.8s'}}>🔔</div>
        <div className="absolute bottom-[15%] right-[30%] text-4xl animate-bounce opacity-10" style={{animationDuration: '4.8s', animationDelay: '1.2s'}}>🎅</div>
        <div className="absolute top-[50%] left-[30%] text-3xl animate-spin opacity-8" style={{animationDuration: '12s', animationDelay: '3s'}}>❄️</div>
        <div className="absolute top-[25%] left-[40%] text-4xl animate-bounce opacity-8" style={{animationDuration: '3.7s', animationDelay: '0.3s'}}>🦌</div>
        <div className="absolute bottom-[40%] right-[20%] text-3xl animate-bounce opacity-8" style={{animationDuration: '4.1s', animationDelay: '2.5s'}}>🎁</div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Elementos navideños decorativos en el Hero */}
          <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-10" style={{animationDuration: '3s'}}>🎄</div>
          <div className="absolute bottom-10 right-10 text-5xl animate-bounce opacity-10" style={{animationDuration: '3.5s', animationDelay: '1s'}}>🎅</div>
          <br />
          <br />
          <div className="text-center space-y-6 z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-green-500/20 border border-red-500/30 rounded-full backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">
                Colección Navideña 2025
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
              Loyola{' '}
              <span className="bg-gradient-to-r from-red-500 via-green-500 to-red-600 bg-clip-text text-transparent">
                Crea Tu Estilo
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Descubre las últimas tendencias en hoodies personalizadas. Diseños únicos que combinan comodidad y estilo navideño.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/productos"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Explorar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>
      <br/>
      <br/>
      <br/>

      {/* Todos los Productos */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Todos Nuestros Productos
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {products.length} productos disponibles
            </p>
          </div>
          <Link
            to="/productos"
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              isDark 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Ver Todo
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No hay productos disponibles
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Los productos agregados desde el inventario aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
              const imageUrl = images[0] || 'https://via.placeholder.com/400x600?text=Hoodie';
              
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                    isDark 
                      ? 'bg-slate-900/50 border border-slate-800 hover:border-red-500/50' 
                      : 'bg-white border border-gray-200 hover:border-red-500/50 shadow-sm'
                  } relative`}
                >
                  {/* Elemento navideño decorativo en hover */}
                  <div className="absolute -top-3 -right-3 text-3xl animate-bounce z-20 opacity-0 group-hover:opacity-100 transition-opacity">🎁</div>
                  
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=Hoodie';
                      }}
                    />
                    
                    {product.badge && (
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                        product.badge === 'HOT' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {product.badge}
                      </div>
                    )}

                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        ¡Solo {product.stock}!
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">AGOTADO</span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('❤️ Agregado a favoritos');
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                      >
                        <Heart className="w-5 h-5 text-gray-900" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                      >
                        <Eye className="w-5 h-5 text-gray-900" />
                      </button>
                    </div>

                    {product.stock > 0 && (
                      <button 
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="absolute bottom-4 left-4 right-4 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Agregar
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className={`text-sm mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : isDark ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {new Intl.NumberFormat('es-BO', {
                          style: 'currency',
                          currency: 'BOB',
                          minimumFractionDigits: 2
                        }).format(product.price)}
                      </span>
                      {product.old_price && (
                        <>
                          <span className={`text-lg line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {new Intl.NumberFormat('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                              minimumFractionDigits: 2
                            }).format(product.old_price)}
                          </span>
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className={`w-4 h-4 ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`} />
                      <span className={`text-sm ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
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

      {/* Quiénes Somos - SOLO TEXTO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10">
        {/* Decoración navideña sutil */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-10" style={{animationDuration: '3s'}}>🎄</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce opacity-10" style={{animationDuration: '4s', animationDelay: '1s'}}>⛄</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-bounce opacity-8" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>🎁</div>

        <div className="text-center mb-12 relative z-10">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quiénes Somos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 via-green-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Contenido de texto */}
          <div className={`p-8 md:p-12 rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'} backdrop-blur-xl shadow-xl relative overflow-hidden`}>
            {/* Decoración navideña interna sutil */}
            <div className="absolute top-4 right-4 text-2xl animate-spin opacity-10" style={{animationDuration: '8s'}}>❄️</div>
            <div className="absolute bottom-4 left-4 text-xl animate-bounce opacity-10">🔔</div>
            
            <div className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-6 relative z-10`}>
              <p className="text-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-red-600 bg-clip-text text-transparent mb-6">
                Desde 2018, creando magia bordada
              </p>
              
              <p>
                En <span className="font-bold text-red-500">Loyola</span>, transformamos tus ideas en <span className="font-bold text-green-600">bordados personalizados de alta calidad</span>. Cada puntada cuenta una historia, cada diseño refleja tu personalidad única.
              </p>
              
              <p>
                Nos especializamos en <span className="font-semibold">hoodies, crew necks, poleras y gorras</span> confeccionadas con <span className="font-bold text-red-500">algodón 100% boliviano</span> y elaboradas por artesanos locales con años de experiencia.
              </p>

              <p className="text-center text-xl md:text-2xl font-bold text-red-500 my-8 py-4 border-y-2 border-red-500/30">
                🧵 Algodón boliviano + Talento local = Calidad excepcional 🧵
              </p>

              <div className={`p-6 md:p-8 rounded-2xl ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'} relative`}>
                <p className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  🎨 Tú imaginas, nosotros lo bordamos 🎨
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-center text-lg`}>
                  Desde ilustraciones y frases inspiradoras hasta diseños corporativos, cada prenda es única y hecha especialmente para ti. Sin mínimos de pedido, con la máxima atención al detalle.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    ✨ Nuestra Promesa
                  </h4>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Bordados de alta durabilidad</li>
                    <li>• Atención personalizada</li>
                    <li>• Entregas puntuales</li>
                    <li>• Diseños ilimitados</li>
                  </ul>
                </div>
                
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    💝 Valores que nos definen
                  </h4>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Scissors, label: 'Bordados Premium', desc: 'Alta calidad garantizada', color: 'from-red-500 to-green-500' },
              { icon: Users, label: 'Talento Local', desc: 'Artesanos bolivianos expertos', color: 'from-blue-500 to-cyan-500' },
              { icon: HeartFilled, label: '100% Boliviano', desc: 'Algodón nacional de primera', color: 'from-green-500 to-emerald-500' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`group p-6 rounded-2xl text-center ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'} hover:scale-105 transition-all duration-300 shadow-lg`}>
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <p className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-8 md:p-16">
          {/* Efectos decorativos */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          {/* Elementos navideños sutiles */}
          <div className="absolute top-4 left-4 text-5xl animate-bounce opacity-20">🎄</div>
          <div className="absolute bottom-4 right-4 text-5xl animate-bounce opacity-20" style={{animationDelay: '0.5s'}}>⛄</div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold text-white">
                  Oferta Navideña
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                ¡Diseños únicos para ti!
              </h2>
              
              <p className="text-lg text-white/90 mb-8">
                Aprovecha nuestras ofertas exclusivas en bordados personalizados esta Navidad.
              </p>

              <Link
                to="/ofertas"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Comprar Ahora
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Scissors className="w-24 h-24 text-white mx-auto mb-4" />
                    <div className="text-2xl font-bold text-white">Bordados</div>
                    <div className="text-lg text-white/90">Premium</div>
                  </div>
                </div>
                {/* Círculos decorativos */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/50 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Truck,
              title: 'Envío Rápido',
              description: 'Entrega en 24-48 horas a todo el país',
              color: 'from-yellow-500 to-orange-500',
            },
            {
              icon: Award,
              title: 'Calidad Premium',
              description: 'Productos certificados y de alta calidad',
              color: 'from-red-500 to-green-500',
            },
            {
              icon: Shield,
              title: 'Compra Segura',
              description: 'Pago protegido y devoluciones gratis',
              color: 'from-blue-500 to-cyan-500',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group p-6 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? 'bg-slate-900/50 border border-slate-800 hover:border-red-500/50'
                    : 'bg-white border border-gray-200 hover:border-red-500/50 shadow-sm'
                }`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 md:mb-6 transform group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                
                <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}