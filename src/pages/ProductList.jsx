// frontend/src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Grid, List, Star, Heart, Eye, ShoppingBag
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductList() {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { categoria } = useParams();
  
  const [view, setView] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos del backend
  useEffect(() => {
    loadProducts();
  }, [categoria]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/products`;
      
      // Filtrar por categoría si existe
      if (categoria && categoria !== 'productos') {
        url += `?category=${categoria}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Títulos de categorías
  const categoryTitles = {
    hombre: 'Moda para Hombre',
    mujer: 'Moda para Mujer',
    ninos: 'Moda Infantil',
    ofertas: 'Ofertas Especiales',
    novedades: 'Nuevos Productos',
  };

  const categoryTitle = categoria ? categoryTitles[categoria] || 'Productos' : 'Todos los Productos';

  // Función para agregar rápido al carrito
  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sizes = Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]');
    const colors = Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]');
    
    const defaultSize = sizes[0] || 'M';
    const defaultColor = colors[0] || 'Negro';
    
    addToCart(product, 1, defaultSize, defaultColor);
    alert(`✅ ${product.name} agregado al carrito\nTalla: ${defaultSize} | Color: ${defaultColor}`);
  };

  const formatBs = (amount) =>
    new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(amount);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
      
      {/* Breadcrumb */}
      <div className={`${isDark ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}>
              Inicio
            </Link>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{categoryTitle}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {categoryTitle}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {products.length} productos disponibles
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${
                view === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-gray-400 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${
                view === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-gray-400 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={`${
          view === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'flex flex-col gap-6'
        }`}>
          {products.map((product) => {
            const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
            const imageUrl = images[0] || 'https://via.placeholder.com/400x600?text=Hoodie';
            
            return (
              <div
                key={product.id}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/50 border border-slate-800 hover:border-purple-500/50' 
                    : 'bg-white border border-gray-200 hover:border-purple-500/50 shadow-sm'
                } ${view === 'list' ? 'flex flex-row' : ''}`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${view === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={`w-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${
                        view === 'list' ? 'h-full' : 'h-72'
                      }`}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Hoodie'; }}
                    />
                  </Link>
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                      product.badge === 'HOT' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('❤️ Agregado a favoritos');
                      }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                    >
                      <Heart className="w-5 h-5 text-gray-900" />
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                    >
                      <Eye className="w-5 h-5 text-gray-900" />
                    </Link>
                  </div>

                  {/* Add to Cart */}
                  {view === 'grid' && (
                    <button 
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="absolute bottom-4 left-4 right-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Agregar
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className={`p-6 ${view === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <div className={`text-sm mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                    
                    <Link to={`/product/${product.id}`}>
                      <h3 className={`text-lg font-bold mb-2 hover:text-purple-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
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

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatBs(product.price)}
                      </span>
                      {product.old_price && (
                        <>
                          <span className={`text-lg line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {formatBs(product.old_price)}
                          </span>
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart (list view) */}
                  {view === 'list' && (
                    <button 
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Agregar al Carrito
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No hay productos disponibles en esta categoría</p>
            <Link to="/" className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}