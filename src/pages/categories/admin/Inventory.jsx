import { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, Edit2, Trash2, Filter,
  ChevronDown, X, Save, AlertCircle, Check, Upload, 
  TrendingUp, DollarSign, ShoppingCart, BarChart3,
  Download, FileText, Table
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
  const [exportLoading, setExportLoading] = useState({ pdf: false, excel: false });

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

  // Función para descargar PDF
  const downloadPDF = async () => {
    try {
      setExportLoading(prev => ({ ...prev, pdf: true }));
      
      // Crear contenido HTML para el PDF
      const printContent = document.createElement('div');
      printContent.style.padding = '20px';
      printContent.style.backgroundColor = 'white';
      printContent.style.color = 'black';
      
      // Encabezado
      printContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Reporte de Inventario</h1>
          <p style="color: #666;">Generado el ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Resumen General</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #6c757d; font-size: 14px;">Total Productos</h3>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #333;">${inventoryStats.overview.totalProducts}</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #6c757d; font-size: 14px;">Valor Total</h3>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #333;">Bs ${inventoryStats.overview.totalValue.toFixed(0)}</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #6c757d; font-size: 14px;">Stock Bajo</h3>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #dc3545;">${inventoryStats.overview.lowStock}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Productos (${filteredProducts.length})</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #343a40; color: white;">
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Producto</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">SKU</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Categoría</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Precio</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Stock</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${filteredProducts.map(product => {
                const price = Number(product.price);
                const stock = Number(product.stock);
                const totalValue = price * stock;
                const stockBadge = getStockBadge(stock);
                
                return `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${product.name}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-family: monospace;">${product.sku}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${getCategoryLabel(product.category)}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">Bs ${price.toFixed(2)}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; color: ${stockBadge.color.includes('red') ? '#dc3545' : stockBadge.color.includes('orange') ? '#fd7e14' : '#28a745'}">${stock}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Bs ${totalValue.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; text-align: center; color: #666;">
          <p>Sistema de Gestión de Inventario - StyleHub</p>
          <p>Página 1 de 1</p>
        </div>
      `;

      // Crear ventana de impresión
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Reporte de Inventario - ${new Date().toLocaleDateString()}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                color: #333;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                font-size: 12px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left;
              }
              th { 
                background-color: #f8f9fa; 
                font-weight: bold;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Esperar a que cargue el contenido y luego imprimir
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 500);

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setExportLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  // Función para descargar Excel
  const downloadExcel = async () => {
    try {
      setExportLoading(prev => ({ ...prev, excel: true }));
      
      // Crear contenido CSV
      const headers = ['Producto', 'SKU', 'Categoría', 'Precio (Bs)', 'Precio Anterior (Bs)', 'Stock', 'Nivel Stock', 'Valor Total (Bs)', 'Vendidos'];
      const csvData = filteredProducts.map(product => {
        const price = Number(product.price);
        const oldPrice = product.old_price ? Number(product.old_price) : '';
        const stock = Number(product.stock);
        const totalValue = price * stock;
        const stockBadge = getStockBadge(stock);
        
        // Buscar ventas del producto
        const productSales = inventoryStats.topProducts.find(p => p.product_id === product.id);
        const totalSold = productSales ? productSales.total_sold : 0;

        return [
          `"${product.name}"`,
          product.sku,
          getCategoryLabel(product.category),
          price.toFixed(2),
          oldPrice ? oldPrice.toFixed(2) : '',
          stock,
          stockBadge.label,
          totalValue.toFixed(2),
          totalSold
        ];
      });

      // Agregar fila de totales
      const totalValue = filteredProducts.reduce((sum, product) => {
        return sum + (Number(product.price) * Number(product.stock));
      }, 0);
      
      const totalProducts = filteredProducts.length;
      const totalStock = filteredProducts.reduce((sum, product) => sum + Number(product.stock), 0);

      csvData.push([]); // Línea vacía
      csvData.push(['TOTALES', '', '', '', '', totalStock, '', totalValue.toFixed(2), '']);
      csvData.push(['CANTIDAD PRODUCTOS', totalProducts, '', '', '', '', '', '', '']);

      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✅ Archivo Excel descargado exitosamente');

    } catch (error) {
      console.error('Error generando Excel:', error);
      alert('Error al generar el archivo Excel');
    } finally {
      setExportLoading(prev => ({ ...prev, excel: false }));
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
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Botones de exportación */}
            <div className="flex gap-2">
              <button
                onClick={downloadPDF}
                disabled={exportLoading.pdf || filteredProducts.length === 0}
                className="px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading.pdf ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                PDF
              </button>
              
              <button
                onClick={downloadExcel}
                disabled={exportLoading.excel || filteredProducts.length === 0}
                className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading.excel ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Table className="w-4 h-4" />
                )}
                Excel
              </button>
            </div>
            
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Resto del código permanece igual... */}
        {/* Stats Cards */}
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

          {/* ... resto de las stats cards ... */}
        </div>

        {/* ... resto del componente ... */}

      </div>

      {/* Modal Add/Edit - permanece igual */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* ... contenido del modal ... */}
        </div>
      )}
    </div>
  );
}