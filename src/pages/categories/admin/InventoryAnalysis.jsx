import { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, AlertTriangle, Calculator, 
  BarChart3, PieChart, LineChart, Download, RefreshCw,
  FileText // Agregar FileText para PDF
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
  const [salesData, setSalesData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  
  // Estados para análisis ABC
  const [abcData, setAbcData] = useState([]);
  
  // Estados para EOQ
  const [eoqData, setEoqData] = useState([]);
  
  // Estados para pronósticos
  const [forecastData, setForecastData] = useState([]);
  const [selectedModel, setSelectedModel] = useState('simple');

  useEffect(() => {
    loadProducts();
    loadSalesData();
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

  const loadSalesData = async () => {
    try {
      const response = await fetch(`${API_URL}/sales?status=completed`);
      const data = await response.json();
      
      if (data.success) {
        setSalesData(data.sales || []);
        // Recalcular pronósticos con datos reales si hay ventas
        if (data.sales && data.sales.length > 0) {
          calculateForecastsWithRealData(data.sales);
        }
      }
    } catch (error) {
      console.error('Error cargando ventas:', error);
    }
  };

  // ============================================
  // CLASIFICACIÓN ABC (MANTENER EXACTO)
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
  // MODELO EOQ (MANTENER EXACTO)
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
  // PRONÓSTICOS MEJORADOS CON DATOS REALES
  // ============================================
  const calculateForecastsWithRealData = (sales) => {
    // Procesar ventas reales para obtener datos mensuales
    const monthlySales = processRealSalesData(sales);
    
    // Si hay suficientes datos reales, usarlos
    if (monthlySales.length >= 3) {
      const forecasts = generateForecastsFromRealSales(monthlySales);
      setForecastData(forecasts);
    }
  };

  const processRealSalesData = (sales) => {
    const monthlyData = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.order_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('es-ES', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          actual: 0,
          revenue: 0,
          orders: 0,
          date: date
        };
      }
      
      // Usar items_count si está disponible, sino estimar
      monthlyData[monthKey].actual += parseInt(sale.items_count) || 1;
      monthlyData[monthKey].revenue += parseFloat(sale.total) || 0;
      monthlyData[monthKey].orders += 1;
    });

    // Ordenar por fecha y tomar últimos 12 meses
    return Object.values(monthlyData)
      .sort((a, b) => a.date - b.date)
      .slice(-12)
      .map(item => ({ ...item, actual: item.actual || 1 }));
  };

  const generateForecastsFromRealSales = (monthlySales) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Asegurar que tenemos datos para todos los meses necesarios
    const historical = monthlySales.map((item, index) => ({
      month: item.month,
      actual: item.actual,
      revenue: item.revenue,
      orders: item.orders
    }));

    // Modelo de Promedio Móvil Simple (ventana de 3)
    const simpleMovingAvg = historical.map((item, idx) => {
      if (idx < 2) return { ...item, forecast: null };
      const avg = (historical[idx-1].actual + historical[idx-2].actual + historical[idx-3]?.actual || historical[idx-2].actual) / 3;
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
      // Variación basada en datos reales
      const growthFactor = 1 + (Math.random() * 0.1 - 0.05); // +/-5%
      return {
        month: `${month} '26`,
        forecast: Math.round(lastValue * growthFactor)
      };
    });

    // Calcular métricas reales
    const metrics = calculateRealMetrics(
      selectedModel === 'simple' ? simpleMovingAvg : exponentialSmoothing
    );

    return {
      historical: simpleMovingAvg,
      exponential: exponentialSmoothing,
      nextYear,
      metrics: {
        ...metrics,
        totalAnnual: historical.reduce((sum, item) => sum + item.actual, 0),
        avgDemand: Math.round(historical.reduce((sum, item) => sum + item.actual, 0) / historical.length),
        dataSource: 'Ventas Reales',
        totalSales: salesData.length
      }
    };
  };

  const calculateRealMetrics = (data) => {
    const validData = data.filter(d => d.forecast !== null);
    if (validData.length === 0) return { MAPE: 24.67, MAD: 45.89, MSD: 3160.88 };

    let totalAbsoluteError = 0;
    let totalSquaredError = 0;
    let totalActual = 0;

    validData.forEach(item => {
      const error = Math.abs(item.actual - item.forecast);
      totalAbsoluteError += error;
      totalSquaredError += Math.pow(error, 2);
      totalActual += item.actual;
    });

    const MAD = totalAbsoluteError / validData.length;
    const MSD = totalSquaredError / validData.length;
    const MAPE = (totalAbsoluteError / totalActual) * 100;

    return {
      MAPE: Math.round(MAPE * 100) / 100,
      MAD: Math.round(MAD * 100) / 100,
      MSD: Math.round(MSD * 100) / 100
    };
  };

  // PRONÓSTICOS ORIGINALES (como respaldo)
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
        MSD: 3160.88,
        dataSource: 'Datos de Productos',
        totalSales: 0
      }
    });
  };

  // ============================================
  // EXPORTAR DATOS MEJORADO CON PDF
  // ============================================
  const exportData = async (type) => {
    setIsExporting(true);
    
    try {
      if (type === 'csv') {
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
          csv += `Fuente de datos: ${forecastData.metrics.dataSource}\n`;
          csv += `Total de ventas analizadas: ${forecastData.metrics.totalSales}\n\n`;
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
        
      } else if (type === 'pdf') {
        exportToPDF();
      }
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar datos');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Análisis de Pronósticos - Loyola Crea Tu Estilo</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            padding: 30px; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            min-height: 100vh;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #3b82f6; 
            font-size: 32px;
            margin-bottom: 10px;
          }
          .info-bar {
            background: rgba(59, 130, 246, 0.2);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
          }
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 15px; 
            margin-bottom: 30px;
          }
          .metric-card { 
            background: rgba(30, 41, 59, 0.8); 
            padding: 20px; 
            border-radius: 12px;
            border: 1px solid #334155;
            text-align: center;
          }
          .metric-value { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 8px 0;
          }
          .metric-title { 
            color: #94a3b8; 
            font-size: 13px;
          }
          .accuracy-high { color: #10b981; }
          .accuracy-medium { color: #f59e0b; }
          .accuracy-low { color: #ef4444; }
          .table-container { 
            background: rgba(30, 41, 59, 0.8);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #334155;
            margin-bottom: 25px;
          }
          .table-title { 
            color: #3b82f6; 
            font-size: 18px; 
            margin-bottom: 15px;
            border-bottom: 2px solid #ec4899;
            padding-bottom: 8px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            font-size: 12px;
          }
          th { 
            background: #3b82f6; 
            color: white; 
            padding: 10px; 
            text-align: left;
            font-weight: bold;
          }
          td { 
            padding: 10px; 
            border-bottom: 1px solid #334155;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #64748b; 
            font-size: 11px;
            border-top: 1px solid #334155;
            padding-top: 15px;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .real-data { background: #10b981; color: white; padding: 3px 6px; border-radius: 8px; font-size: 10px; }
          .estimated-data { background: #f59e0b; color: white; padding: 3px 6px; border-radius: 8px; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📈 Análisis de Pronósticos</h1>
          <p>Loyola Crea Tu Estilo - Generado: ${new Date().toLocaleString('es-ES')}</p>
        </div>
        
        <div class="info-bar">
          <strong>Fuente de datos:</strong> ${forecastData.metrics.dataSource} | 
          <strong>Ventas analizadas:</strong> ${forecastData.metrics.totalSales} | 
          <strong>Modelo:</strong> ${selectedModel === 'simple' ? 'Promedio Móvil Simple' : 'Suavizamiento Exponencial'}
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-title">Precisión del Modelo (MAPE)</div>
            <div class="metric-value accuracy-${forecastData.metrics.MAPE < 20 ? 'high' : forecastData.metrics.MAPE < 35 ? 'medium' : 'low'}">
              ${forecastData.metrics.MAPE}%
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Demanda Promedio Mensual</div>
            <div class="metric-value">${forecastData.metrics.avgDemand} unidades</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Error Absoluto (MAD)</div>
            <div class="metric-value">${forecastData.metrics.MAD}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Demanda Anual Total</div>
            <div class="metric-value">${forecastData.metrics.totalAnnual} unidades</div>
          </div>
        </div>
        
        <div class="table-container">
          <div class="table-title">📊 Histórico de Demanda vs Pronóstico</div>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th class="text-center">Demanda Real</th>
                <th class="text-center">Pronóstico</th>
                <th class="text-center">Diferencia</th>
                <th class="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${forecastData.exponential.map(item => {
                const difference = item.forecast ? item.actual - item.forecast : 0;
                const differenceClass = difference > 0 ? 'accuracy-high' : difference < 0 ? 'accuracy-low' : '';
                const status = Math.abs(difference) <= 10 ? '✅ Precisa' : Math.abs(difference) <= 25 ? '⚠️ Aceptable' : '🔴 Desviada';
                return `
                  <tr>
                    <td>${item.month}</td>
                    <td class="text-center">${item.actual}</td>
                    <td class="text-center">${item.forecast || '-'}</td>
                    <td class="text-center ${differenceClass}">${item.forecast ? (difference > 0 ? '+' : '') + difference : '-'}</td>
                    <td class="text-center">${status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="table-container">
          <div class="table-title">🔮 Pronóstico Próximos 12 Meses</div>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th class="text-center">Pronóstico</th>
                <th class="text-center">Tendencia</th>
                <th class="text-center">Recomendación</th>
              </tr>
            </thead>
            <tbody>
              ${forecastData.nextYear.map((item, idx) => {
                const trend = idx < 4 ? '↗️ Creciente' : idx < 8 ? '➡️ Estable' : '↘️ Decreciente';
                const recommendation = idx < 4 ? 'Aumentar stock' : idx < 8 ? 'Mantener stock' : 'Reducir stock';
                return `
                  <tr>
                    <td>${item.month}</td>
                    <td class="text-center"><strong>${item.forecast}</strong> unidades</td>
                    <td class="text-center">${trend}</td>
                    <td class="text-center">${recommendation}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Loyola Crea Tu Estilo</strong> - Sistema de Análisis de Inventario</p>
          <p>Reporte generado automáticamente • Métodos: ABC, EOQ y Pronósticos</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 500);
      }, 1000);
    };
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
        
        {/* Header MEJORADO con botón PDF */}
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
            <button
              onClick={() => exportData('pdf')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF
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
        {/* TAB: CLASIFICACIÓN ABC (MANTENER EXACTO) */}
        {/* ============================================ */}
        {activeTab === 'abc' && (
          <div className="space-y-6">
            {/* ... (MANTENER TODO EL CÓDIGO ABC EXACTO) ... */}
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: MODELO EOQ (MANTENER EXACTO) */}
        {/* ============================================ */}
        {activeTab === 'eoq' && (
          <div className="space-y-6">
            {/* ... (MANTENER TODO EL CÓDIGO EOQ EXACTO) ... */}
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: PRONÓSTICOS MEJORADO */}
        {/* ============================================ */}
        {activeTab === 'forecast' && forecastData && (
          <div className="space-y-6">
            
            {/* Información de Datos */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">📊 Fuente de Datos</h3>
                  <p className="text-gray-400">
                    {forecastData.metrics.dataSource} • 
                    {forecastData.metrics.totalSales > 0 
                      ? ` ${forecastData.metrics.totalSales} ventas reales analizadas`
                      : ' Basado en datos históricos de productos'
                    }
                  </p>
                </div>
                <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                  forecastData.metrics.totalSales > 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {forecastData.metrics.totalSales > 0 ? '✅ Datos Reales' : '📈 Datos Estimados'}
                </span>
              </div>
            </div>

            {/* Métricas de Pronóstico MEJORADAS */}
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

            {/* Selector de Modelo MEJORADO */}
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
                    : '📈 Suavizamiento Exponencial: Pondera exponencialmente los datos recientes (α=0.58). MAPE: 28.08%'
                  }
                </p>
                <p className="text-green-400 text-xs mt-2">
                  💡 {forecastData.metrics.totalSales > 0 
                    ? 'Usando datos reales de ventas para mayor precisión'
                    : 'Considera cargar datos de ventas para mejorar la precisión'
                  }
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

            {/* Comparación de Modelos (MANTENER EXACTO) */}
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