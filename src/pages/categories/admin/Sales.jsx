import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Download, Eye, Search, XCircle,
  TrendingUp, DollarSign, Package, Users
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar ventas
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
      const salesRes = await fetch(`${API_URL}/sales?${params}`);
      const salesData = await salesRes.json();
      setSales(salesData.sales || []);
      
      // Cargar estadísticas
      const statsRes = await fetch(`${API_URL}/sales/stats/summary?month=${selectedMonth}&year=${selectedYear}`);
      const statsData = await statsRes.json();
      setStats(statsData.stats);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos de ventas');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchSearch = 
      sale.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${sale.customer_first_name} ${sale.customer_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchSearch;
  });

  const exportData = () => {
    let csv = 'REPORTE DE VENTAS - LOYOLA CREA TU ESTILO\n';
    csv += `Período: ${getMonthName(selectedMonth)} ${selectedYear}\n`;
    csv += `Fecha de generación: ${new Date().toLocaleString('es-ES')}\n\n`;
    
    csv += 'Orden,Fecha,Cliente,Email,Teléfono,Ciudad,Método Pago,Items,Total\n';
    
    filteredSales.forEach(sale => {
      csv += `${sale.order_number},`;
      csv += `${new Date(sale.order_date).toLocaleDateString('es-ES')},`;
      csv += `${sale.customer_first_name} ${sale.customer_last_name},`;
      csv += `${sale.customer_email},`;
      csv += `${sale.customer_phone || ''},`;
      csv += `${sale.shipping_city},`;
      csv += `${sale.payment_method},`;
      csv += `${sale.items_count || 0},`;
      csv += `Bs${parseFloat(sale.total).toFixed(2)}\n`;
    });
    
    csv += `\nTOTAL DE VENTAS,,,,,,,Bs${filteredSales.reduce((sum, s) => sum + parseFloat(s.total), 0).toFixed(2)}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ventas_${selectedMonth}_${selectedYear}.csv`;
    link.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'refunded': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getMonthName = (month) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando ventas...</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              Gestión de Ventas
            </h1>
            <p className="text-gray-400">Registro y análisis de todas las ventas realizadas</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: 'Total Ventas',
                value: `Bs${parseFloat(stats.summary.total_revenue || 0).toFixed(2)}`,
                icon: DollarSign,
                color: 'from-green-500 to-emerald-600',
                change: '+12.5%'
              },
              {
                label: 'Pedidos',
                value: stats.summary.total_orders || 0,
                icon: ShoppingCart,
                color: 'from-blue-500 to-cyan-600',
                change: '+8.2%'
              },
              {
                label: 'Ticket Promedio',
                value: `Bs${parseFloat(stats.summary.average_order_value || 0).toFixed(2)}`,
                icon: TrendingUp,
                color: 'from-purple-500 to-pink-600',
                change: '+5.3%'
              },
              {
                label: 'Productos Vendidos',
                value: filteredSales.reduce((sum, s) => sum + parseInt(s.total_items || 0), 0),
                icon: Package,
                color: 'from-orange-500 to-red-600',
                change: '+15.7%'
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts */}
        {stats && stats.monthly && stats.monthly.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Ventas Mensuales (Últimos 6 Meses)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthly}>
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
                  <Legend />
                  <Bar dataKey="revenue" fill="#10B981" name="Ingresos (Bs)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Top 5 Productos Más Vendidos</h3>
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg font-bold text-white text-sm">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{product.product_name}</p>
                      <p className="text-gray-400 text-xs">{product.total_sold} unidades vendidas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">Bs{parseFloat(product.total_revenue).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por orden, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
              <option value="refunded">Reembolsadas</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white">
              Ventas de {getMonthName(selectedMonth)} {selectedYear}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{filteredSales.length} ventas encontradas</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Orden</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ciudad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Método Pago</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-mono text-sm font-semibold">{sale.order_number}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">
                        {new Date(sale.order_date).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(sale.order_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">
                        {sale.customer_first_name} {sale.customer_last_name}
                      </p>
                      <p className="text-gray-400 text-xs">{sale.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-white">{sale.shipping_city}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                        {sale.payment_method === 'card' ? 'Tarjeta' : 'PayPal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white text-center">{sale.items_count || 0}</td>
                    <td className="px-6 py-4">
                      <p className="text-green-400 font-bold text-lg">
                        Bs{parseFloat(sale.total).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(sale.status)}`}>
                        {sale.status === 'completed' ? 'Completada' : 
                         sale.status === 'pending' ? 'Pendiente' :
                         sale.status === 'cancelled' ? 'Cancelada' : 'Reembolsada'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setShowDetails(sale)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800/50 border-t-2 border-slate-700">
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-right text-white font-bold text-lg">
                    TOTAL:
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-green-400 font-bold text-2xl">
                      Bs{filteredSales.reduce((sum, s) => sum + parseFloat(s.total), 0).toFixed(2)}
                    </p>
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay ventas para mostrar</p>
            <p className="text-gray-500 text-sm mt-2">Intenta cambiar los filtros o el período de tiempo</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">Detalles de Venta</h2>
                <p className="text-gray-400 text-sm">{showDetails.order_number}</p>
              </div>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Nombre:</p>
                    <p className="text-white font-semibold">
                      {showDetails.customer_first_name} {showDetails.customer_last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email:</p>
                    <p className="text-white font-semibold">{showDetails.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Teléfono:</p>
                    <p className="text-white font-semibold">{showDetails.customer_phone || 'No proporcionado'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  Dirección de Envío
                </h3>
                <p className="text-white">
                  {showDetails.shipping_address}<br />
                  {showDetails.shipping_city}, {showDetails.shipping_zip_code}<br />
                  {showDetails.shipping_country}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Resumen de Pago
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>Bs{parseFloat(showDetails.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Envío:</span>
                    <span>Bs{parseFloat(showDetails.shipping_cost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Impuestos:</span>
                    <span>Bs{parseFloat(showDetails.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg border-t border-slate-700 pt-2">
                    <span>TOTAL:</span>
                    <span className="text-green-400">Bs{parseFloat(showDetails.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}