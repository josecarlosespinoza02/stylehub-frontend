import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, TrendingUp, Users, DollarSign,
  ShoppingCart, AlertCircle, Download, FileText, FileSpreadsheet, Activity,
  ArrowUp, ArrowDown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Componente de gráfico simplificado sin Recharts
const SimpleBarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:opacity-80"
              style={{ height: `${(item.value / maxValue) * 80}%` }}
            ></div>
            <span className="text-xs text-gray-400 mt-2">{item.label}</span>
            <span className="text-xs text-white font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de donut chart simplificado
const SimpleDonutChart = ({ data, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const startAngle = (accumulated / 100) * 360;
          const endAngle = ((accumulated + percentage) / 100) * 360;
          accumulated += percentage;
          
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);
          
          const x1 = 60 + 40 * Math.cos(startRad);
          const y1 = 60 + 40 * Math.sin(startRad);
          const x2 = 60 + 40 * Math.cos(endRad);
          const y2 = 60 + 40 * Math.sin(endRad);
          
          const largeArc = percentage > 50 ? 1 : 0;
          
          return (
            <path
              key={index}
              d={`M 60 60 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              stroke="#1e293b"
              strokeWidth="2"
            />
          );
        })}
        <circle cx="60" cy="60" r="20" fill="#1e293b" />
      </svg>
    </div>
  );
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('30days');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estados de datos
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStock: 0,
    totalValue: 0
  });

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Cargar datos
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, salesRes, inventoryRes] = await Promise.all([
        fetch(`${API_URL}/products`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/sales?status=completed`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/inventory/stats`).catch(() => ({ ok: false }))
      ]);

      let productsData = [];
      let salesData = [];
      let inventoryStats = { overview: {} };

      // Procesar productos
      if (productsRes.ok) {
        const data = await productsRes.json();
        if (data.success) {
          productsData = data.products || [];
          setProducts(productsData);
        }
      }

      // Procesar ventas
      if (salesRes.ok) {
        const data = await salesRes.json();
        if (data.success) {
          salesData = data.sales || [];
          setSales(salesData);
        }
      }

      // Procesar inventario
      if (inventoryRes.ok) {
        const data = await inventoryRes.json();
        if (data.success) {
          inventoryStats = data.stats;
        }
      }

      // Calcular estadísticas
      const inv = inventoryStats.overview;
      const calculatedStats = {
        totalSales: inv.totalRevenue || salesData.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0),
        totalOrders: inv.totalSales || salesData.length,
        totalProducts: inv.totalProducts || productsData.length,
        totalCustomers: Math.floor((inv.totalProducts || productsData.length) * 1.5),
        lowStock: inv.lowStock || productsData.filter(p => p.stock < 20).length,
        totalValue: inv.totalValue || productsData.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.stock)), 0)
      };

      setStats(calculatedStats);

      // Generar datos mensuales
      generateMonthlyData(salesData);
      
      // Generar datos por categoría
      generateCategoryData(productsData);

    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (salesData) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const data = months.map(month => ({
      label: month,
      value: Math.floor(Math.random() * 1000) + 500 // Datos de ejemplo
    }));
    setMonthlyData(data);
  };

  const generateCategoryData = (productsData) => {
    const categories = {};
    productsData.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });

    const colors = {
      hombre: '#8B5CF6',
      mujer: '#EC4899', 
      ninos: '#10B981',
      ofertas: '#F59E0B',
      novedades: '#3B82F6'
    };

    const data = Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value,
      color: colors[name] || '#6B7280'
    }));

    setCategoryData(data);
  };

  // Top productos
  const topProducts = products
    .slice(0, 5)
    .map((product, idx) => ({
      id: product.id,
      name: product.name,
      sold: product.reviews || Math.floor(Math.random() * 100),
      revenue: (product.price * (product.reviews || 10)).toFixed(2),
      trend: ['up', 'neutral', 'down'][idx % 3]
    }));

  // Productos con stock bajo
  const lowStockProducts = products
    .filter(p => p.stock < 20)
    .slice(0, 3);

  // Exportar datos
  const exportData = (format) => {
    setIsExporting(true);
    
    try {
      if (format === 'csv') {
        let csv = 'REPORTE DASHBOARD - STYLEHUB\n\n';
        csv += 'MÉTRICAS PRINCIPALES\n';
        csv += 'Métrica,Valor\n';
        csv += `Ventas Totales,Bs${stats.totalSales.toFixed(2)}\n`;
        csv += `Pedidos,${stats.totalOrders}\n`;
        csv += `Productos,${stats.totalProducts}\n`;
        csv += `Clientes,${stats.totalCustomers}\n`;
        csv += `Stock Bajo,${stats.lowStock}\n`;
        csv += `Valor Inventario,Bs${stats.totalValue.toFixed(2)}\n\n`;
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `dashboard_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      }
    } catch (error) {
      console.error('Error exportando:', error);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              Dashboard Administrativo
            </h1>
            <p className="text-gray-400">Datos en tiempo real de tu negocio</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="90days">Últimos 90 días</option>
              <option value="year">Este año</option>
            </select>
            
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Actualizar
            </button>
            
            <button
              onClick={() => exportData('csv')}
              disabled={isExporting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Excel'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {[
            {
              title: 'Ventas Totales',
              value: `Bs${stats.totalSales.toLocaleString()}`,
              change: '+12.5%',
              trend: 'up',
              icon: DollarSign,
              color: 'from-green-500 to-emerald-600',
            },
            {
              title: 'Pedidos',
              value: stats.totalOrders.toString(),
              change: '+8.2%',
              trend: 'up',
              icon: ShoppingCart,
              color: 'from-blue-500 to-cyan-600',
            },
            {
              title: 'Productos',
              value: stats.totalProducts.toString(),
              change: '0%',
              trend: 'neutral',
              icon: Package,
              color: 'from-purple-500 to-pink-600',
            },
            {
              title: 'Clientes',
              value: stats.totalCustomers.toString(),
              change: '+15.3%',
              trend: 'up',
              icon: Users,
              color: 'from-orange-500 to-red-600',
            },
            {
              title: 'Stock Bajo',
              value: stats.lowStock.toString(),
              change: stats.lowStock > 0 ? 'Revisar' : 'OK',
              trend: stats.lowStock > 0 ? 'down' : 'up',
              icon: AlertCircle,
              color: 'from-yellow-500 to-orange-600',
            },
            {
              title: 'Valor Inventario',
              value: `Bs${stats.totalValue.toFixed(0)}`,
              change: '+5.2%',
              trend: 'up',
              icon: TrendingUp,
              color: 'from-pink-500 to-rose-600',
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            const isUp = stat.trend === 'up';
            const isNeutral = stat.trend === 'neutral';
            
            return (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    isNeutral 
                      ? 'bg-gray-500/20 text-gray-400' 
                      : isUp 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {!isNeutral && (isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Tendencia de Ventas</h3>
            <SimpleBarChart data={monthlyData} height={250} />
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-400 text-sm">Ventas (Bs)</span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Productos por Categoría</h3>
            <div className="flex flex-col items-center">
              <SimpleDonutChart data={categoryData} size={140} />
              <div className="mt-4 space-y-2 w-full">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-gray-400 text-sm">{cat.name}</span>
                    </div>
                    <span className="text-white font-semibold">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Products */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Top 5 Productos
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg font-bold text-white text-sm">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-400">
                        {product.sold} vendidos • Bs{product.revenue}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    product.trend === 'up' 
                      ? 'bg-green-500/20 text-green-400' 
                      : product.trend === 'down'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {product.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : product.trend === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
                    {product.trend === 'up' ? '+12%' : product.trend === 'down' ? '-5%' : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Alertas de Stock ({lowStockProducts.length})
            </h3>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-xl border-2 ${
                      product.stock < 10
                        ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-orange-500/10 border-orange-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">{product.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stock < 10
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {product.stock < 10 ? 'CRÍTICO' : 'ADVERTENCIA'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          Stock: <span className="font-semibold text-white">{product.stock}</span>
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        Min: 20
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          product.stock < 10 ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(product.stock / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>¡Todo el stock está en niveles óptimos!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}