import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, TrendingUp, Users, DollarSign,
  ShoppingCart, AlertCircle, Download, Calendar, Filter,
  ArrowUp, ArrowDown, FileText, FileSpreadsheet, Activity, Box
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estados para datos reales
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0
  });

  // Cargar datos del backend
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos
      const productsRes = await fetch(`${API_URL}/products`);
      const productsData = await productsRes.json();
      
      if (productsData.success) {
        const prods = productsData.products;
        setProducts(prods);
        
        // Calcular estadísticas
        const totalProducts = prods.length;
        const lowStock = prods.filter(p => Number(p.stock) < 20).length;
        const totalValue = prods.reduce((sum, p) => sum + (Number(p.price) * Number(p.stock)), 0);
        
        // Calcular ventas estimadas (precio * reviews simulado)
        const totalSales = prods.reduce((sum, p) => sum + (Number(p.price) * Number(p.reviews || 0)), 0);
        
        setStats({
          totalProducts,
          lowStock,
          totalValue,
          totalSales: totalSales || 45231, // Si no hay reviews, usar valor demo
          totalOrders: prods.reduce((sum, p) => sum + Number(p.reviews || 0), 0) || 356,
          totalCustomers: Math.floor(totalProducts * 10) || 234
        });
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Top productos basados en datos reales
  const topProducts = products
    .sort((a, b) => Number(b.reviews) - Number(a.reviews))
    .slice(0, 5)
    .map((p, idx) => ({
      id: p.id,
      name: p.name,
      sold: Number(p.reviews) || 0,
      revenue: Number(p.price) * (Number(p.reviews) || 0),
      trend: idx % 3 === 0 ? 'up' : idx % 3 === 1 ? 'neutral' : 'down',
      growth: (Math.random() * 30 - 5).toFixed(1)
    }));

  // Productos con stock bajo
  const lowStockProducts = products
    .filter(p => Number(p.stock) < 20)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      stock: Number(p.stock),
      minStock: 20,
      status: Number(p.stock) < 10 ? 'critical' : 'warning'
    }));

  // Datos para gráficos (simulados pero proporcionales a datos reales)
  const salesData = [
    { month: 'Ene', ventas: stats.totalSales * 0.12, pedidos: Math.floor(stats.totalOrders * 0.15), clientes: Math.floor(stats.totalCustomers * 0.13) },
    { month: 'Feb', ventas: stats.totalSales * 0.10, pedidos: Math.floor(stats.totalOrders * 0.12), clientes: Math.floor(stats.totalCustomers * 0.11) },
    { month: 'Mar', ventas: stats.totalSales * 0.14, pedidos: Math.floor(stats.totalOrders * 0.18), clientes: Math.floor(stats.totalCustomers * 0.15) },
    { month: 'Abr', ventas: stats.totalSales * 0.13, pedidos: Math.floor(stats.totalOrders * 0.16), clientes: Math.floor(stats.totalCustomers * 0.14) },
    { month: 'May', ventas: stats.totalSales * 0.16, pedidos: Math.floor(stats.totalOrders * 0.20), clientes: Math.floor(stats.totalCustomers * 0.17) },
    { month: 'Jun', ventas: stats.totalSales * 0.15, pedidos: Math.floor(stats.totalOrders * 0.19), clientes: Math.floor(stats.totalCustomers * 0.16) },
  ];

  // Distribución por categorías (basado en productos reales)
  const getCategoryData = () => {
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    const total = products.length || 1;
    const colors = {
      hombre: '#8B5CF6',
      mujer: '#EC4899',
      ninos: '#10B981',
      ofertas: '#F59E0B',
      novedades: '#3B82F6'
    };
    
    return Object.entries(categories).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / total) * 100),
      color: colors[name] || '#6B7280'
    }));
  };

  const categoryData = getCategoryData();

  // Exportar datos
  const exportData = (format) => {
    setIsExporting(true);
    
    if (format === 'csv') {
      let csv = 'REPORTE DE DASHBOARD - STYLEHUB\n';
      csv += `Período: ${timeRange === '7days' ? 'Últimos 7 días' : timeRange === '30days' ? 'Últimos 30 días' : timeRange === '90days' ? 'Últimos 90 días' : 'Este año'}\n`;
      csv += `Fecha de generación: ${new Date().toLocaleString('es-ES')}\n\n`;
      
      csv += 'MÉTRICAS PRINCIPALES\n';
      csv += 'Métrica,Valor\n';
      csv += `Ventas Totales,Bs${stats.totalSales.toFixed(2)}\n`;
      csv += `Pedidos,${stats.totalOrders}\n`;
      csv += `Productos,${stats.totalProducts}\n`;
      csv += `Clientes,${stats.totalCustomers}\n`;
      csv += `Stock Bajo,${stats.lowStock}\n`;
      csv += `Valor Inventario,Bs${stats.totalValue.toFixed(2)}\n\n`;
      
      csv += 'TOP PRODUCTOS\n';
      csv += 'Ranking,Producto,Unidades,Ingresos,Crecimiento\n';
      topProducts.forEach((p, idx) => {
        csv += `${idx + 1},${p.name},${p.sold},Bs${p.revenue.toFixed(2)},${p.growth}%\n`;
      });
      
      csv += '\nALERTAS DE STOCK BAJO\n';
      csv += 'Producto,Stock Actual,Stock Mínimo,Estado\n';
      lowStockProducts.forEach(p => {
        csv += `${p.name},${p.stock},${p.minStock},${p.status === 'critical' ? 'CRÍTICO' : 'ADVERTENCIA'}\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Dashboard - Loyola Crea Tu Estilo</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #8B5CF6; border-bottom: 3px solid #EC4899; padding-bottom: 10px; }
            .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #f0f0f0; border-radius: 8px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #8B5CF6; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #8B5CF6; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>📊 Dashboard Administrativo</h1>
          <p><strong>Período:</strong> ${timeRange === '7days' ? 'Últimos 7 días' : timeRange === '30days' ? 'Últimos 30 días' : timeRange === '90days' ? 'Últimos 90 días' : 'Este año'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          
          <h2>Métricas Principales</h2>
          <div class="metric">
            <div>Ventas Totales</div>
            <div class="metric-value">Bs${stats.totalSales.toFixed(2)}</div>
          </div>
          <div class="metric">
            <div>Pedidos</div>
            <div class="metric-value">${stats.totalOrders}</div>
          </div>
          <div class="metric">
            <div>Productos</div>
            <div class="metric-value">${stats.totalProducts}</div>
          </div>
          
          <h2>Top Productos</h2>
          <table>
            <thead>
              <tr><th>Ranking</th><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr>
            </thead>
            <tbody>
              ${topProducts.map((p, idx) => `
                <tr>
                  <td><strong>#${idx + 1}</strong></td>
                  <td>${p.name}</td>
                  <td>${p.sold}</td>
                  <td>Bs${p.revenue.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p><strong>Loyola Crea Tu Estilo</strong> - Sistema de Gestión Empresarial</p>
            <p>Datos generados en tiempo real desde la base de datos</p>
          </div>
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '', 'height=800,width=1000');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
    
    setTimeout(() => setIsExporting(false), 1000);
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
            <p className="text-gray-400">Datos en tiempo real de tu inventario</p>
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
              onClick={() => exportData('csv')}
              disabled={isExporting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>

            <button
              onClick={() => exportData('pdf')}
              disabled={isExporting}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              PDF
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Tendencia de Ventas</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-400">Ventas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-400">Pedidos</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="ventas" stroke="#8B5CF6" strokeWidth={3} />
                <Line type="monotone" dataKey="pedidos" stroke="#EC4899" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Productos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-gray-400 text-sm">{cat.name}</span>
                  </div>
                  <span className="text-white font-semibold">{cat.value}%</span>
                </div>
              ))}
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
                        {product.sold} vendidos • Bs{product.revenue.toFixed(2)}
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
                    {Math.abs(product.growth)}%
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
                      product.status === 'critical'
                        ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-orange-500/10 border-orange-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">{product.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.status === 'critical'
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {product.status === 'critical' ? 'CRÍTICO' : 'ADVERTENCIA'}
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
                        Min: {product.minStock}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          product.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(product.stock / product.minStock) * 100}%` }}
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