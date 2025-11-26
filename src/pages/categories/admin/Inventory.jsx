import { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, Edit2, Trash2, Filter,
  ChevronDown, X, Save, AlertCircle, Check, Upload, 
  TrendingUp, DollarSign, ShoppingCart, BarChart3
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function InventoryComplete() {
  const isDark = true;
  
  const [products, setProducts] = useState([]);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'hombre',
    price: '',
    oldPrice: '',
    stock: '',
    sku: '',
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro'],
    badge: '',
    features: [''],
    specifications: { Material: '', Peso: '', Origen: 'Bolivia' },
    images: []
  });

  // Cargar productos y estadísticas
  useEffect(() => {
    loadData();
  }, [categoryFilter, stockFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos con filtros
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (stockFilter !== 'all') params.append('inStock', stockFilter === 'high' || stockFilter === 'medium');
      
      const [productsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/products?${params}`),
        fetch(`${API_URL}/inventory/stats`)
      ]);
      
      const productsData = await productsRes.json();
      const statsData = await statsRes.json();
      
      if (productsData.success) {
        setProducts(productsData.products || []);
      }
      
      if (statsData.success) {
        setInventoryStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos del inventario');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos localmente
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStock = stockFilter === 'all' ||
                      (stockFilter === 'low' && product.stock < 20) ||
                      (stockFilter === 'medium' && product.stock >= 20 && product.stock < 50) ||
                      (stockFilter === 'high' && product.stock >= 50);
    
    return matchSearch && matchStock;
  });

  // Abrir modal para agregar
  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: 'hombre',
      price: '',
      oldPrice: '',
      stock: '',
      sku: 'HOOD-' + Date.now(),
      description: '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro'],
      badge: '',
      features: ['Algodón 100%', 'Diseño personalizable'],
      specifications: { Material: 'Algodón franela', Peso: '450g', Origen: 'Bolivia' },
      images: []
    });
    setImagePreview([]);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      oldPrice: product.old_price?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku,
      description: product.description || '',
      sizes: Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]'),
      colors: Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]'),
      badge: product.badge || '',
      features: Array.isArray(product.features) ? product.features : JSON.parse(product.features || '[]'),
      specifications: typeof product.specifications === 'object' ? product.specifications : JSON.parse(product.specifications || '{}'),
      images: []
    });
    const existingImages = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    setImagePreview(existingImages.map(url => ({ url, isExisting: true })));
    setShowModal(true);
  };

  // Manejar selección de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`⚠️ La imagen ${file.name} supera los 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const currentImages = formData.images || [];
    const newImages = [...currentImages, ...validFiles];
    setFormData({ ...formData, images: newImages });
    
    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      isExisting: false,
      file: file
    }));
    
    setImagePreview([...imagePreview, ...newPreviews]);
  };

  // Eliminar imagen del preview
  const removeImage = (index) => {
    const imageToRemove = imagePreview[index];
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
    
    if (!imageToRemove.isExisting) {
      const newImages = (formData.images || []).filter((file, i) => {
        const nonExistingBeforeIndex = imagePreview
          .slice(0, index)
          .filter(p => !p.isExisting).length;
        return i !== nonExistingBeforeIndex;
      });
      setFormData({ ...formData, images: newImages });
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  // Guardar producto
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock || !formData.sku) {
      alert('⚠️ Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('oldPrice', formData.oldPrice || '');
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('badge', formData.badge);
      formDataToSend.append('sizes', JSON.stringify(formData.sizes));
      formDataToSend.append('colors', JSON.stringify(formData.colors));
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));

      if (modalMode === 'edit') {
        const existingImages = imagePreview.filter(p => p.isExisting).map(p => p.url);
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      const url = modalMode === 'add' 
        ? `${API_URL}/products` 
        : `${API_URL}/products/${selectedProduct.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert(modalMode === 'add' ? '✅ Producto agregado exitosamente' : '✅ Producto actualizado exitosamente');
        setShowModal(false);
        loadData();
      } else {
        alert('❌ Error al guardar producto');
      }
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('❌ Error al guardar producto');
    }
  };

  // Eliminar producto
  const handleDelete = async (product) => {
    if (window.confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      try {
        const response = await fetch(`${API_URL}/products/${product.id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('✅ Producto eliminado exitosamente');
          loadData();
        } else {
          alert('❌ Error al eliminar producto');
        }
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('❌ Error al eliminar producto');
      }
    }
  };

  const getStockBadge = (stock) => {
    const stockNum = Number(stock);
    if (stockNum < 20) return { color: 'bg-red-500/20 text-red-400', label: 'Bajo' };
    if (stockNum < 50) return { color: 'bg-orange-500/20 text-orange-400', label: 'Medio' };
    return { color: 'bg-green-500/20 text-green-400', label: 'Alto' };
  };

  const getCategoryLabel = (category) => {
    const labels = {
      hombre: 'Hombre',
      mujer: 'Mujer',
      ninos: 'Niños',
      ofertas: 'Ofertas',
      novedades: 'Novedades'
    };
    return labels[category] || category;
  };

  if (loading || !inventoryStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              Gestión de Inventario
            </h1>
            <p className="text-gray-400">Administra tus productos con datos en tiempo real</p>
          </div>
          
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        </div>

        {/* Stats Cards - CONECTADAS CON BACKEND */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Productos</p>
                <p className="text-3xl font-bold text-white">{inventoryStats.overview.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Stock Bajo</p>
                <p className="text-3xl font-bold text-white">{inventoryStats.overview.lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Agotados</p>
                <p className="text-3xl font-bold text-white">{inventoryStats.overview.outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-white">Bs {inventoryStats.overview.totalValue.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Ventas Totales</p>
                <p className="text-3xl font-bold text-white">{inventoryStats.overview.totalSales}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Ingresos</p>
                <p className="text-2xl font-bold text-white">Bs {inventoryStats.overview.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Productos Más Vendidos */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Top 5 Productos Más Vendidos
          </h3>
          <div className="space-y-3">
            {inventoryStats.topProducts.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg font-bold text-white">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{product.product_name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{product.total_sold} unidades vendidas</span>
                    <span>•</span>
                    <span>Stock actual: {product.current_stock || 0}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">Bs {parseFloat(product.total_revenue).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Precio: Bs {product.current_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2 justify-center"
            >
              <Filter className="w-5 h-5" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Categoría</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="ninos">Niños</option>
                  <option value="ofertas">Ofertas</option>
                  <option value="novedades">Novedades</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Nivel de Stock</label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="low">Bajo (&lt;20)</option>
                  <option value="medium">Medio (20-49)</option>
                  <option value="high">Alto (≥50)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Producto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Vendidos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Valor</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((product) => {
                  const stockBadge = getStockBadge(product.stock);
                  const price = Number(product.price);
                  const oldPrice = product.old_price ? Number(product.old_price) : null;
                  const stock = Number(product.stock);
                  const totalValue = price * stock;
                  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
                  
                  // Buscar ventas del producto
                  const productSales = inventoryStats.topProducts.find(p => p.product_id === product.id);
                  const totalSold = productSales ? productSales.total_sold : 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={images[0] || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Hoodie'; }}
                          />
                          <div>
                            <p className="text-white font-semibold">{product.name}</p>
                            {oldPrice && (
                              <p className="text-xs text-gray-400">
                                Descuento: {Math.round(((oldPrice - price) / oldPrice) * 100)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 font-mono text-sm">{product.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">Bs {price.toFixed(2)}</p>
                          {oldPrice && (
                            <p className="text-xs text-gray-500 line-through">Bs {oldPrice.toFixed(2)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stockBadge.color}`}>
                          {stock} - {stockBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">{totalSold}</p>
                          <p className="text-xs text-gray-500">unidades</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">Bs {totalValue.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No se encontraron productos</p>
                <p className="text-gray-500 text-sm mt-2">Intenta cambiar los filtros o términos de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'add' ? 'Agregar Producto' : 'Editar Producto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSave} className="space-y-6" id="productForm">
              
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Ej: Hoodie Personalizada Premium"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="HOOD-001"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Categoría *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="ninos">Niños</option>
                    <option value="ofertas">Ofertas</option>
                    <option value="novedades">Novedades</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Precio (Bs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="189.99"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Precio Anterior (Bs)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="249.99"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="45"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="">Sin badge</option>
                    <option value="HOT">HOT</option>
                    <option value="NEW">NEW</option>
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Descripción</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                  placeholder="Descripción detallada del producto..."
                />
              </div>

              {/* Tallas y Colores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Tallas (separadas por coma)</label>
                  <input
                    type="text"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Colores (separados por coma)</label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(c => c.trim())})}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Negro, Gris, Azul"
                  />
                </div>
              </div>

              {/* Imágenes */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Imágenes del Producto *
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {imagePreview.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-purple-500 transition-all">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Click para subir imágenes</span>
                  <span className="text-xs text-gray-500">(Máx 5MB por imagen)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              </form>
            </div>

            {/* Botones */}
            <div className="flex gap-3 p-6 border-t border-slate-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="productForm"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" />
                {modalMode === 'add' ? 'Agregar' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}