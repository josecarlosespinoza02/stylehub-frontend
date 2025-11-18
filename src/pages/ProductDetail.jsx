// frontend/src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Share2, Star, Truck, 
  Shield, RefreshCw, Check, Minus, Plus, ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductDetail() {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Cargar producto
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.product);
        loadRelatedProducts(data.product.category);
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category) => {
    try {
      const response = await fetch(`${API_URL}/products?category=${category}`);
      const data = await response.json();
      
      if (data.success) {
        const filtered = data.products.filter(p => p.id !== parseInt(id)).slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error('Error cargando productos relacionados:', error);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('⚠️ Por favor selecciona una talla y un color');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    alert(`✅ ${product.name} agregado al carrito\nTalla: ${selectedSize} | Color: ${selectedColor} | Cantidad: ${quantity}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Producto no encontrado
          </h2>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const sizes = Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]');
  const colors = Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]');
  const features = Array.isArray(product.features) ? product.features : JSON.parse(product.features || '[]');
  const specifications = typeof product.specifications === 'object' ? product.specifications : JSON.parse(product.specifications || '{}');

  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

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
            <Link to={`/${product.category}`} className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            {/* Imagen Principal */}
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <img
                src={images[selectedImage] || 'https://via.placeholder.com/800x800?text=Hoodie'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800?text=Hoodie'; }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <div className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    -{discount}%
                  </div>
                )}
                {product.stock < 10 && (
                  <div className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                    ¡Últimas unidades!
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDark ? 'bg-slate-900/80 hover:bg-slate-800' : 'bg-white/80 hover:bg-white'
                    } backdrop-blur-xl`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDark ? 'bg-slate-900/80 hover:bg-slate-800' : 'bg-white/80 hover:bg-white'
                    } backdrop-blur-xl`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedImage === index
                        ? 'border-purple-500 scale-95'
                        : isDark
                        ? 'border-slate-800 hover:border-slate-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Hoodie'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className={`text-sm mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
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
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {product.rating}
                  </span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    ({product.reviews} reseñas)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                    minimumFractionDigits: 2
                  }).format(product.price)}
                </span>
                {product.old_price && (
                  <span className={`text-2xl line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {new Intl.NumberFormat('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                      minimumFractionDigits: 2
                    }).format(product.old_price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      En stock ({product.stock} disponibles)
                    </span>
                  </>
                ) : (
                  <span className={`font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    Agotado
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-gray-50 border border-gray-200'}`}>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <label className={`text-sm font-semibold mb-3 block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Talla: {selectedSize || 'Selecciona una talla'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-95'
                          : isDark
                          ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                          : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <label className={`text-sm font-semibold mb-3 block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Color: {selectedColor || 'Selecciona un color'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedColor === color
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-95'
                          : isDark
                          ? 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className={`text-sm font-semibold mb-3 block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cantidad
              </label>
              <div className="flex items-center gap-4">
                <div className={`flex items-center rounded-xl overflow-hidden ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-300'
                }`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`p-3 transition-colors ${
                      isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className={`px-6 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className={`p-3 transition-colors ${
                      isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Máximo {product.stock} unidades
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || product.stock === 0}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingBag className="w-5 h-5" />
                Agregar al Carrito
              </button>
              <button className={`p-4 rounded-xl transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-300'
              }`}>
                <Heart className="w-6 h-6" />
              </button>
              <button className={`p-4 rounded-xl transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-300'
              }`}>
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-xl ${
              isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-gray-50 border border-gray-200'
            }`}>
              {[
                { icon: Truck, text: 'Envío gratis +Bs100' },
                { icon: Shield, text: 'Compra protegida' },
                { icon: RefreshCw, text: 'Devolución gratis' },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-slate-800' : 'bg-white'
                    }`}>
                      <Icon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        {(product.description || features.length > 0 || Object.keys(specifications).length > 0) && (
          <div className="mt-16">
            {/* Tab Headers */}
            <div className={`flex gap-1 mb-6 p-1 rounded-xl ${
              isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-gray-100 border border-gray-200'
            }`}>
              {['description', 'features', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'description' && 'Descripción'}
                  {tab === 'features' && 'Características'}
                  {tab === 'specifications' && 'Especificaciones'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={`p-6 md:p-8 rounded-xl ${
              isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'
            }`}>
              
              {activeTab === 'description' && product.description && (
                <div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Descripción del Producto
                  </h3>
                  <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'features' && features.length > 0 && (
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Características Principales
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && Object.keys(specifications).length > 0 && (
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Especificaciones Técnicas
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <dt className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {key}
                        </dt>
                        <dd className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Productos Relacionados
              </h2>
              <Link
                to={`/${product.category}`}
                className={`text-sm font-semibold flex items-center gap-2 ${
                  isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                Ver más
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => {
                const relImages = Array.isArray(relProduct.images) ? relProduct.images : JSON.parse(relProduct.images || '[]');
                
                return (
                  <Link
                    key={relProduct.id}
                    to={`/product/${relProduct.id}`}
                    className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                      isDark 
                        ? 'bg-slate-900/50 border border-slate-800 hover:border-purple-500/50' 
                        : 'bg-white border border-gray-200 hover:border-purple-500/50 shadow-sm'
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relImages[0] || 'https://via.placeholder.com/400x600?text=Hoodie'}
                        alt={relProduct.name}
                        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Hoodie'; }}
                      />
                      {relProduct.old_price && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          OFERTA
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className={`font-bold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {relProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(relProduct.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : isDark ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {new Intl.NumberFormat('es-BO', {
                            style: 'currency',
                            currency: 'BOB',
                            minimumFractionDigits: 2
                          }).format(relProduct.price)}
                        </span>
                        {relProduct.old_price && (
                          <span className={`text-sm line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {new Intl.NumberFormat('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                              minimumFractionDigits: 2
                            }).format(relProduct.old_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}