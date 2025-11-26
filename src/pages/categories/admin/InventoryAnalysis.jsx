import { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, AlertTriangle, Calculator, 
  BarChart3, PieChart, LineChart, Download, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  LineChart as RechartsLine, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function InventoryAnalysis() {
  const [activeTab, setActiveTab] = useState('abc');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  
  // Estados para análisis ABC
  const [abcData, setAbcData] = useState([]);
  
  // Estados para EOQ
  const [eoqData, setEoqData] = useState([]);
  
  // Estados para pronósticos
  const [forecastData, setForecastData] = useState([]);
  const [selectedModel, setSelectedModel] = useState('simple');

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
        calculateABC(data.products);
        calculateEOQ(data.products);
        calculateForecasts(data.products);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CLASIFICACIÓN ABC
  // ============================================
  const calculateABC = (prods) => {
    // Calcular valor anual de cada producto (precio * stock)
    const productsWithValue = prods.map(p => ({
      ...p,
      annualValue: Number(p.price) * Number(p.stock)
    }));

    // Ordenar por valor anual descendente
    const sorted = [...productsWithValue].sort((a, b) => b.annualValue - a.annualValue);
    
    // Calcular valor total
    const totalValue = sorted.reduce((sum, p) => sum + p.annualValue, 0);
    
    // Clasificar ABC
    let accumulated = 0;
    const classified = sorted.map(p => {
      const percentage = (p.annualValue / totalValue) * 100;
      accumulated += percentage;
      
      let classification = 'C';
      if (accumulated <= 80) classification = 'A';
      else if (accumulated <= 95) classification = 'B';
      
      return {
        ...p,
        valuePercentage: percentage,
        accumulatedPercentage: accumulated,
        classification
      };
    });
    
    setAbcData(classified);
  };

  // ============================================
  // MODELO EOQ
  // ============================================
  const calculateEOQ = (prods) => {
    const results = prods.map(p => {
      // Datos base
      const D = Number(p.reviews) * 12 || 2400; // Demanda anual estimada
      const price = Number(p.price);
      const S = 90; // Costo por pedido (Bs)
      const H = price * 0.20; // Costo de mantenimiento 20% del precio
      const leadTime = 10; // días
      
      // Cálculo EOQ: √(2DS/H)
      const EOQ = Math.sqrt((2 * D * S) / H);
      
      // Número de pedidos al año
      const ordersPerYear = D / EOQ;
      
      // Tiempo entre pedidos (días)
      const daysBetweenOrders = 365 / ordersPerYear;
      
      // Punto de reorden: (D/365) * leadTime
      const reorderPoint = (D / 365) * leadTime;
      
      // Costos
      const orderingCost = (D / EOQ) * S;
      const holdingCost = (EOQ / 2) * H;
      const totalCost = orderingCost + holdingCost;
      
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        price: price,
        stock: Number(p.stock),
        demand: D,
        EOQ: Math.round(EOQ),
        ordersPerYear: Math.round(ordersPerYear),
        daysBetweenOrders: Math.round(daysBetweenOrders),
        reorderPoint: Math.round(reorderPoint),
        orderingCost: orderingCost.toFixed(2),
        holdingCost: holdingCost.toFixed(2),
        totalCost: totalCost.toFixed(2)
      };
    });
    
    setEoqData(results);
  };

  // ============================================
  // PRONÓSTICOS
  // ============================================
  const calculateForecasts = (prods) => {
    // Simular datos históricos mensuales basados en reviews
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Calcular demanda promedio
    const totalDemand = prods.reduce((sum, p) => sum + (Number(p.reviews) || 0), 0);
    const avgMonthlyDemand = totalDemand / 12;
    
    // Generar datos históricos con variación
    const historical = months.map((month, idx) => {
      const variation = Math.sin(idx * 0.5) * 0.2 + 1; // Variación estacional
      return {
        month,
        actual: Math.round(avgMonthlyDemand * variation),
      };
    });
    
    // Modelo de Promedio Móvil Simple (ventana de 3)
    const simpleMovingAvg = historical.map((item, idx) => {
      if (idx < 2) return { ...item, forecast: null };
      const avg = (historical[idx-1].actual + historical[idx-2].actual + historical[idx-3]?.actual || 0) / 3;
      return { ...item, forecast: Math.round(avg) };
    });
    
    // Suavizamiento Exponencial Simple (α = 0.58)
    const alpha = 0.58;
    let lastForecast = historical[0].actual;
    const exponentialSmoothing = historical.map(item => {
      const forecast = Math.round(alpha * item.actual + (1 - alpha) * lastForecast);
      lastForecast = forecast;
      return { ...item, forecast };
    });
    
    // Pronóstico para próximos 12 meses
    const nextYear = months.map(month => {
      const lastValue = exponentialSmoothing[exponentialSmoothing.length - 1].forecast;
      return {
        month: `${month} '26`,
        forecast: Math.round(lastValue * (0.95 + Math.random() * 0.1)) // Variación +/-5%
      };
    });
    
    setForecastData({
      historical: simpleMovingAvg,
      exponential: exponentialSmoothing,
      nextYear,
      metrics: {
        avgDemand: Math.round(avgMonthlyDemand),
        totalAnnual: totalDemand,
        MAPE: 24.67, // Del documento
        MAD: 45.89,
        MSD: 3160.88
      }
    });
  };

  // ============================================
  // EXPORTAR DATOS
  // ============================================
  const exportData = (type) => {
    let csv = 'ANÁLISIS DE INVENTARIO - LOYOLA CREA TU ESTILO\n';
    csv += `Fecha: ${new Date().toLocaleString('es-ES')}\n\n`;
    
    if (type === 'abc') {
      csv += 'CLASIFICACIÓN ABC\n';
      csv += 'Producto,Valor Anual (Bs),% del Total,% Acumulado,Clasificación\n';
      abcData.forEach(p => {
        csv += `${p.name},${p.annualValue.toFixed(2)},${p.valuePercentage.toFixed(2)}%,${p.accumulatedPercentage.toFixed(2)}%,${p.classification}\n`;
      });
    } else if (type === 'eoq') {
      csv += 'MODELO EOQ (CANTIDAD ECONÓMICA DE PEDIDO)\n';
      csv += 'Producto,Demanda Anual,EOQ,Pedidos/Año,Días entre Pedidos,Punto Reorden,Costo Total (Bs)\n';
      eoqData.forEach(p => {
        csv += `${p.name},${p.demand},${p.EOQ},${p.ordersPerYear},${p.daysBetweenOrders},${p.reorderPoint},${p.totalCost}\n`;
      });
    } else if (type === 'forecast') {
      csv += 'PRONÓSTICOS DE DEMANDA\n';
      csv += 'Mes,Demanda Real,Pronóstico\n';
      forecastData.exponential?.forEach(d => {
        csv += `${d.month},${d.actual},${d.forecast}\n`;
      });
      csv += '\nPRÓXIMOS 12 MESES\n';
      csv += 'Mes,Pronóstico\n';
      forecastData.nextYear?.forEach(d => {
        csv += `${d.month},${d.forecast}\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analisis_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Calculando análisis...</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Análisis de Inventario
            </h1>
            <p className="text-gray-400">Clasificación ABC, EOQ y Pronósticos de Demanda</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            <button
              onClick={() => exportData(activeTab)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-xl">
          {[
            { id: 'abc', label: 'Clasificación ABC', icon: PieChart },
            { id: 'eoq', label: 'Modelo EOQ', icon: Calculator },
            { id: 'forecast', label: 'Pronósticos', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============================================ */}
        {/* TAB: CLASIFICACIÓN ABC */}
        {/* ============================================ */}
        {activeTab === 'abc' && (
          <div className="space-y-6">
            
            {/* Resumen ABC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['A', 'B', 'C'].map((cls) => {
                const items = abcData.filter(p => p.classification === cls);
                const totalValue = items.reduce((sum, p) => sum + p.annualValue, 0);
                
                return (
                  <div key={cls} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-2xl font-bold ${
                        cls === 'A' ? 'text-green-400' : cls === 'B' ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        Clase {cls}
                      </h3>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        cls === 'A' ? 'bg-green-500/20' : cls === 'B' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                      }`}>
                        <Package className={`w-6 h-6 ${
                          cls === 'A' ? 'text-green-400' : cls === 'B' ? 'text-yellow-400' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      {cls === 'A' ? '0-80% del valor' : cls === 'B' ? '80-95% del valor' : '95-100% del valor'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Productos:</span>
                        <span className="text-white font-bold">{items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor Total:</span>
                        <span className="text-white font-bold">Bs{totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gráfico de Pareto */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Diagrama de Pareto - Clasificación ABC</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={abcData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="annualValue" fill="#8B5CF6" name="Valor Anual (Bs)" />
                  <Line yAxisId="right" type="monotone" dataKey="accumulatedPercentage" stroke="#EC4899" name="% Acumulado" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla ABC */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">Detalle de Clasificación ABC</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Producto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Valor Anual</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">% del Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">% Acumulado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Clasificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {abcData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-400">{item.category}</p>
                        </td>
                        <td className="px-6 py-4 text-white font-semibold">
                          Bs{item.annualValue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-white">
                          {item.valuePercentage.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 text-white">
                          {item.accumulatedPercentage.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.classification === 'A' 
                              ? 'bg-green-500/20 text-green-400'
                              : item.classification === 'B'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            Clase {item.classification}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: MODELO EOQ */}
        {/* ============================================ */}
        {activeTab === 'eoq' && (
          <div className="space-y-6">
            
            {/* Resumen EOQ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'EOQ Promedio', value: Math.round(eoqData.reduce((s, p) => s + p.EOQ, 0) / eoqData.length), icon: Calculator },
                { label: 'Pedidos/Año', value: Math.round(eoqData.reduce((s, p) => s + p.ordersPerYear, 0)), icon: Package },
                { label: 'Costo Total', value: `Bs${eoqData.reduce((s, p) => s + Number(p.totalCost), 0).toFixed(2)}`, icon: TrendingUp },
                { label: 'Productos', value: eoqData.length, icon: BarChart3 },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Tabla EOQ */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">Cálculo EOQ por Producto</h3>
                <p className="text-gray-400 text-sm mt-1">Cantidad Económica de Pedido optimizada</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Producto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Demanda Anual</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">EOQ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Pedidos/Año</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Días entre Pedidos</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Punto Reorden</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Costo Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {eoqData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-400">Bs{item.price.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4 text-white">{item.demand} unidades</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-bold">
                            {item.EOQ} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">{item.ordersPerYear}</td>
                        <td className="px-6 py-4 text-white">{item.daysBetweenOrders} días</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg font-semibold">
                            {item.reorderPoint} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-bold">Bs{item.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Información EOQ */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Fórmula EOQ</h3>
              <div className="space-y-4 text-gray-300">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-mono text-center text-white mb-2">EOQ = √(2DS/H)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-400">D = Demanda anual</p>
                    </div>
                    <div>
                      <p className="text-gray-400">S = Costo por pedido (Bs 90)</p>
                    </div>
                    <div>
                      <p className="text-gray-400">H = Costo de mantenimiento (20% del precio)</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  El modelo EOQ minimiza los costos totales de inventario equilibrando los costos de ordenar con los costos de mantener stock.
                  El punto de reorden se calcula considerando un lead time de 10 días.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: PRONÓSTICOS */}
        {/* ============================================ */}
        {activeTab === 'forecast' && forecastData.historical && (
          <div className="space-y-6">
            
            {/* Métricas de Pronóstico */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'MAPE', value: `${forecastData.metrics.MAPE}%`, desc: 'Error Porcentual', color: 'green' },
                { label: 'MAD', value: forecastData.metrics.MAD, desc: 'Desviación Absoluta', color: 'blue' },
                { label: 'MSD', value: forecastData.metrics.MSD.toFixed(2), desc: 'Desviación Cuadrática', color: 'purple' },
                { label: 'Demanda Promedio', value: forecastData.metrics.avgDemand, desc: 'Unidades/mes', color: 'orange' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <p className={`text-${metric.color}-400 text-sm font-semibold mb-2`}>{metric.label}</p>
                  <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-xs text-gray-400">{metric.desc}</p>
                </div>
              ))}
            </div>

            {/* Selector de Modelo */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Modelo de Pronóstico</h3>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="simple">Promedio Móvil Simple</option>
                  <option value="exponential">Suavizamiento Exponencial</option>
                </select>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-xl mb-4">
                <p className="text-gray-300 text-sm">
                  {selectedModel === 'simple' 
                    ? '📊 Promedio Móvil Simple: Promedia los últimos 3 períodos. MAPE: 24.67% - El mejor modelo según los datos históricos.'
                    : '📈 Suavizamiento Exponencial: Pondera exponencialmente los datos recientes (α=0.58). MAPE: 28.08%'}
                </p>
              </div>

              {/* Gráfico de Pronósticos */}
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLine data={selectedModel === 'simple' ? forecastData.historical : forecastData.exponential}>
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
                  <Line type="monotone" dataKey="actual" stroke="#8B5CF6" strokeWidth={3} name="Demanda Real" />
                  <Line type="monotone" dataKey="forecast" stroke="#EC4899" strokeWidth={3} name="Pronóstico" strokeDasharray="5 5" />
                </RechartsLine>
              </ResponsiveContainer>
            </div>

            {/* Pronósticos Futuros */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Pronóstico para Próximos 12 Meses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forecastData.nextYear}>
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
                  <Bar dataKey="forecast" fill="#10B981" name="Pronóstico" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Comparación de Modelos */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Comparación de Modelos de Pronóstico</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Modelo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">MAPE (%)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">MAD</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">MSD</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Recomendación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { name: 'Promedio Móvil Simple', mape: 24.67, mad: 45.89, msd: 3160.88, best: true },
                      { name: 'Promedio Móvil Ponderado', mape: 26.00, mad: 42.50, msd: 2972.50, best: false },
                      { name: 'Suavizamiento Exponencial', mape: 28.08, mad: 46.68, msd: 3494.18, best: false },
                      { name: 'Holt (Doble)', mape: 29.41, mad: 47.00, msd: 2599.73, best: false },
                      { name: 'Winters (Multiplicativo)', mape: 43.36, mad: 86.79, msd: 9787.22, best: false },
                    ].map((model, idx) => (
                      <tr key={idx} className={`hover:bg-slate-800/30 transition-colors ${model.best ? 'bg-green-500/10' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{model.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg font-semibold ${
                            model.best ? 'bg-green-500/20 text-green-400' : 'text-white'
                          }`}>
                            {model.mape}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">{model.mad}</td>
                        <td className="px-6 py-4 text-white">{model.msd.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {model.best && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                              ✓ MEJOR MODELO
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                * El Promedio Móvil Simple presenta el menor MAPE (24.67%), siendo el modelo más preciso para esta demanda.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}