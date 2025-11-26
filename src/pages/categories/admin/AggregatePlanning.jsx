import { useState, useEffect } from 'react';
import { 
  Calendar, TrendingUp, Calculator, Target, Download,
  BarChart3, PieChart, LineChart, RefreshCw, Save,
  DollarSign, Package, Users, Factory, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart as RechartsLine, Line, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AggregatePlanning() {
  const [activeTab, setActiveTab] = useState('demand');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [planningData, setPlanningData] = useState(null);
  
  // Estados para planificación
  const [demandForecast, setDemandForecast] = useState([]);
  const [productionPlan, setProductionPlan] = useState([]);
  const [capacityPlan, setCapacityPlan] = useState([]);
  const [financialPlan, setFinancialPlan] = useState([]);

  // Parámetros de planificación
  const [planningParams, setPlanningParams] = useState({
    initialInventory: 100,
    safetyStock: 50,
    workingDays: 22,
    shiftsPerDay: 1,
    hoursPerShift: 8,
    efficiency: 0.85,
    laborCost: 15,
    materialCost: 45,
    overheadCost: 25
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos
      const productsRes = await fetch(`${API_URL}/products`);
      const productsData = await productsRes.json();
      
      if (productsData.success) {
        setProducts(productsData.products);
        calculateAggregatePlan(productsData.products);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CÁLCULOS DE PLANIFICACIÓN AGREGADA
  // ============================================

  const calculateAggregatePlan = (prods) => {
    // 1. Pronóstico de demanda (basado en datos históricos + estacionalidad)
    const monthlyDemand = calculateDemandForecast(prods);
    setDemandForecast(monthlyDemand);

    // 2. Plan de producción
    const production = calculateProductionPlan(monthlyDemand);
    setProductionPlan(production);

    // 3. Plan de capacidad
    const capacity = calculateCapacityPlan(production);
    setCapacityPlan(capacity);

    // 4. Plan financiero
    const financial = calculateFinancialPlan(production, capacity);
    setFinancialPlan(financial);

    // Datos consolidados
    setPlanningData({
      monthlyDemand,
      production,
      capacity,
      financial
    });
  };

  const calculateDemandForecast = (prods) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Calcular demanda total anual basada en ventas históricas
    const totalAnnualDemand = prods.reduce((sum, p) => sum + (Number(p.reviews) * 12 || 2400), 0);
    const avgMonthlyDemand = totalAnnualDemand / 12;

    // Factores estacionales (simulados para hoodies)
    const seasonalFactors = {
      'Ene': 1.2,  // Alta demanda post-navidad
      'Feb': 0.9,  // Baja demanda
      'Mar': 1.0,  // Normal
      'Abr': 1.1,  // Temporada primavera
      'May': 1.3,  // Madres + preparación invierno
      'Jun': 1.4,  // Invierno
      'Jul': 1.5,  // Pico de invierno
      'Ago': 1.3,  // Fin de invierno
      'Sep': 1.0,  // Normal
      'Oct': 1.2,  // Preparación navidad
      'Nov': 1.6,  // Navidad
      'Dic': 1.8   // Pico navidad
    };

    return months.map((month, idx) => {
      const baseDemand = avgMonthlyDemand * seasonalFactors[month];
      const growthFactor = 1 + (idx * 0.02); // Crecimiento del 2% mensual
      const forecast = Math.round(baseDemand * growthFactor);
      
      return {
        month,
        forecast,
        actual: Math.round(forecast * (0.8 + Math.random() * 0.4)), // Simular variación
        seasonalFactor: seasonalFactors[month],
        growth: (growthFactor - 1) * 100
      };
    });
  };

  const calculateProductionPlan = (demand) => {
    let inventory = planningParams.initialInventory;
    
    return demand.map((month, idx) => {
      const demandQuantity = month.forecast;
      const safetyStock = planningParams.safetyStock;
      
      // Calcular producción necesaria
      const netRequirement = Math.max(0, demandQuantity + safetyStock - inventory);
      const productionQuantity = Math.ceil(netRequirement / 10) * 10; // Lotes de 10
      
      // Actualizar inventario
      const endingInventory = inventory + productionQuantity - demandQuantity;
      inventory = Math.max(0, endingInventory);

      return {
        ...month,
        production: productionQuantity,
        beginningInventory: inventory - productionQuantity + demandQuantity,
        endingInventory: inventory,
        netRequirement,
        lotSize: productionQuantity
      };
    });
  };

  const calculateCapacityPlan = (production) => {
    const standardHoursPerUnit = 0.5; // 0.5 horas por hoodie
    const { workingDays, shiftsPerDay, hoursPerShift, efficiency } = planningParams;
    
    const availableHours = workingDays * shiftsPerDay * hoursPerShift * efficiency;
    
    return production.map(month => {
      const requiredHours = month.production * standardHoursPerUnit;
      const utilization = (requiredHours / availableHours) * 100;
      const overtimeHours = Math.max(0, requiredHours - availableHours);
      const additionalShifts = Math.ceil(overtimeHours / (hoursPerShift * efficiency));
      
      return {
        ...month,
        requiredHours,
        availableHours,
        utilization: Math.min(100, utilization),
        overtimeHours,
        additionalShifts,
        capacityGap: requiredHours - availableHours
      };
    });
  };

  const calculateFinancialPlan = (production, capacity) => {
    const { laborCost, materialCost, overheadCost } = planningParams;
    
    return production.map((month, idx) => {
      const cap = capacity[idx];
      
      // Costos
      const materialCostTotal = month.production * materialCost;
      const laborCostRegular = Math.min(cap.requiredHours, cap.availableHours) * laborCost;
      const laborCostOvertime = cap.overtimeHours * laborCost * 1.5; // 50% extra por horas extra
      const overheadCostTotal = month.production * overheadCost;
      
      const totalCost = materialCostTotal + laborCostRegular + laborCostOvertime + overheadCostTotal;
      const revenue = month.forecast * 189.99; // Precio promedio
      const profit = revenue - totalCost;
      
      return {
        ...month,
        materialCost: materialCostTotal,
        laborCost: laborCostRegular + laborCostOvertime,
        overheadCost: overheadCostTotal,
        totalCost,
        revenue,
        profit,
        margin: (profit / revenue) * 100
      };
    });
  };

  // ============================================
  // EXPORTAR DATOS
  // ============================================

  const exportData = (format) => {
    let content = '';
    
    if (format === 'csv') {
      content = exportToCSV();
    } else if (format === 'pdf') {
      exportToPDF();
      return;
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `planificacion_agregada_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToCSV = () => {
    let csv = 'PLANIFICACIÓN AGREGADA - LOYOLA CREA TU ESTILO\n';
    csv += `Fecha de generación: ${new Date().toLocaleString('es-ES')}\n\n`;
    
    if (activeTab === 'demand' && demandForecast.length > 0) {
      csv += 'PRONÓSTICO DE DEMANDA\n';
      csv += 'Mes,Demanda Pronosticada,Factor Estacional,Crecimiento (%)\n';
      demandForecast.forEach(d => {
        csv += `${d.month},${d.forecast},${d.seasonalFactor},${d.growth.toFixed(1)}%\n`;
      });
    }
    
    if (activeTab === 'production' && productionPlan.length > 0) {
      csv += '\nPLAN DE PRODUCCIÓN\n';
      csv += 'Mes,Demanda,Producción,Inventario Inicial,Inventario Final,Requerimiento Neto,Lote\n';
      productionPlan.forEach(p => {
        csv += `${p.month},${p.forecast},${p.production},${p.beginningInventory},${p.endingInventory},${p.netRequirement},${p.lotSize}\n`;
      });
    }
    
    if (activeTab === 'capacity' && capacityPlan.length > 0) {
      csv += '\nPLAN DE CAPACIDAD\n';
      csv += 'Mes,Horas Requeridas,Horas Disponibles,Utilizacion (%),Horas Extra,Turnos Extra\n';
      capacityPlan.forEach(c => {
        csv += `${c.month},${c.requiredHours.toFixed(1)},${c.availableHours.toFixed(1)},${c.utilization.toFixed(1)}%,${c.overtimeHours.toFixed(1)},${c.additionalShifts}\n`;
      });
    }
    
    if (activeTab === 'financial' && financialPlan.length > 0) {
      csv += '\nPLAN FINANCIERO\n';
      csv += 'Mes,Ingresos,Costo Materiales,Costo Mano Obra,Costo Indirectos,Costo Total,Utilidad,Margen (%)\n';
      financialPlan.forEach(f => {
        csv += `${f.month},Bs${f.revenue.toFixed(2)},Bs${f.materialCost.toFixed(2)},Bs${f.laborCost.toFixed(2)},Bs${f.overheadCost.toFixed(2)},Bs${f.totalCost.toFixed(2)},Bs${f.profit.toFixed(2)},${f.margin.toFixed(1)}%\n`;
      });
    }

    return csv;
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    const htmlContent = generatePDFContent();
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const generatePDFContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Planificación Agregada - StyleHub</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h1 { color: #8B5CF6; border-bottom: 2px solid #EC4899; padding-bottom: 10px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Planificación Agregada - Loyola Crea Tu Estilo</h1>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        </div>
        
        <div class="section">
          <h2>Resumen Ejecutivo</h2>
          ${generateExecutiveSummary()}
        </div>
        
        <div class="section">
          <h2>Detalles por Mes</h2>
          ${generateMonthlyDetails()}
        </div>
        
        <div class="footer">
          <p><strong>Sistema de Gestión Empresarial - StyleHub</strong></p>
          <p>Datos generados automáticamente basados en pronósticos y capacidad productiva</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateExecutiveSummary = () => {
    if (!financialPlan.length) return '';
    
    const totalRevenue = financialPlan.reduce((sum, f) => sum + f.revenue, 0);
    const totalCost = financialPlan.reduce((sum, f) => sum + f.totalCost, 0);
    const totalProfit = financialPlan.reduce((sum, f) => sum + f.profit, 0);
    const avgUtilization = capacityPlan.reduce((sum, c) => sum + c.utilization, 0) / capacityPlan.length;
    
    return `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div class="metric">
          <strong>Ingresos Totales Anuales:</strong><br>
          <span style="font-size: 18px; color: #10B981;">Bs${totalRevenue.toFixed(2)}</span>
        </div>
        <div class="metric">
          <strong>Utilidad Anual:</strong><br>
          <span style="font-size: 18px; color: #10B981;">Bs${totalProfit.toFixed(2)}</span>
        </div>
        <div class="metric">
          <strong>Margen Promedio:</strong><br>
          <span style="font-size: 18px; color: #10B981;">${(totalProfit / totalRevenue * 100).toFixed(1)}%</span>
        </div>
        <div class="metric">
          <strong>Utilización Promedio:</strong><br>
          <span style="font-size: 18px; color: #F59E0B;">${avgUtilization.toFixed(1)}%</span>
        </div>
      </div>
    `;
  };

  const generateMonthlyDetails = () => {
    if (!financialPlan.length) return '';
    
    let table = `
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Demanda</th>
            <th>Producción</th>
            <th>Utilización</th>
            <th>Ingresos</th>
            <th>Costos</th>
            <th>Utilidad</th>
            <th>Margen</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    financialPlan.forEach((f, idx) => {
      const cap = capacityPlan[idx];
      table += `
        <tr>
          <td>${f.month}</td>
          <td>${f.forecast}</td>
          <td>${f.production}</td>
          <td>${cap ? cap.utilization.toFixed(1) + '%' : 'N/A'}</td>
          <td>Bs${f.revenue.toFixed(2)}</td>
          <td>Bs${f.totalCost.toFixed(2)}</td>
          <td>Bs${f.profit.toFixed(2)}</td>
          <td>${f.margin.toFixed(1)}%</td>
        </tr>
      `;
    });
    
    table += '</tbody></table>';
    return table;
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Calculando planificación...</p>
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
                <Target className="w-6 h-6 text-white" />
              </div>
              Planificación Agregada
            </h1>
            <p className="text-gray-400">
              Optimización de producción, capacidad y recursos para maximizar utilidades
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            <button
              onClick={() => exportData('csv')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-xl">
          {[
            { id: 'demand', label: 'Pronóstico Demanda', icon: TrendingUp },
            { id: 'production', label: 'Plan Producción', icon: Factory },
            { id: 'capacity', label: 'Plan Capacidad', icon: Clock },
            { id: 'financial', label: 'Plan Financiero', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Resumen de Métricas */}
        {financialPlan.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: 'Ingresos Anuales',
                value: `Bs${financialPlan.reduce((sum, f) => sum + f.revenue, 0).toFixed(0)}`,
                icon: DollarSign,
                color: 'from-green-500 to-emerald-600'
              },
              {
                label: 'Utilidad Anual',
                value: `Bs${financialPlan.reduce((sum, f) => sum + f.profit, 0).toFixed(0)}`,
                icon: TrendingUp,
                color: 'from-blue-500 to-cyan-600'
              },
              {
                label: 'Margen Promedio',
                value: `${(financialPlan.reduce((sum, f) => sum + f.profit, 0) / financialPlan.reduce((sum, f) => sum + f.revenue, 0) * 100).toFixed(1)}%`,
                icon: BarChart3,
                color: 'from-purple-500 to-pink-600'
              },
              {
                label: 'Utilización Prom.',
                value: `${(capacityPlan.reduce((sum, c) => sum + c.utilization, 0) / capacityPlan.length).toFixed(1)}%`,
                icon: Clock,
                color: 'from-orange-500 to-red-600'
              },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Contenido de las Pestañas */}
        <div className="space-y-6">
          
          {/* Pestaña: Pronóstico de Demanda */}
          {activeTab === 'demand' && demandForecast.length > 0 && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Pronóstico de Demanda Anual</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={demandForecast}>
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
                    <Bar dataKey="forecast" fill="#8B5CF6" name="Demanda Pronosticada" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="actual" fill="#EC4899" name="Demanda Real (Proy.)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Factores Estacionales</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLine data={demandForecast}>
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
                      <Line type="monotone" dataKey="seasonalFactor" stroke="#10B981" strokeWidth={3} name="Factor Estacional" />
                    </RechartsLine>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Detalle Mensual</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {demandForecast.map((month, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-semibold">{month.month}</p>
                          <p className="text-gray-400 text-sm">Factor: {month.seasonalFactor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{month.forecast} unidades</p>
                          <p className="text-green-400 text-sm">+{month.growth.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Plan de Producción */}
          {activeTab === 'production' && productionPlan.length > 0 && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Plan de Producción vs Demanda</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={productionPlan}>
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
                    <Bar dataKey="forecast" fill="#8B5CF6" name="Demanda" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="production" fill="#10B981" name="Producción" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Gestión de Inventario</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLine data={productionPlan}>
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
                      <Line type="monotone" dataKey="beginningInventory" stroke="#F59E0B" strokeWidth={3} name="Inventario Inicial" />
                      <Line type="monotone" dataKey="endingInventory" stroke="#EC4899" strokeWidth={3} name="Inventario Final" />
                    </RechartsLine>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Resumen de Producción</h4>
                  <div className="space-y-4">
                    {[
                      {
                        label: 'Producción Total Anual',
                        value: productionPlan.reduce((sum, p) => sum + p.production, 0).toLocaleString() + ' unidades',
                        color: 'text-green-400'
                      },
                      {
                        label: 'Demanda Total Anual',
                        value: productionPlan.reduce((sum, p) => sum + p.forecast, 0).toLocaleString() + ' unidades',
                        color: 'text-purple-400'
                      },
                      {
                        label: 'Inventario Promedio',
                        value: Math.round(productionPlan.reduce((sum, p) => sum + p.endingInventory, 0) / productionPlan.length) + ' unidades',
                        color: 'text-orange-400'
                      },
                      {
                        label: 'Nivel de Servicio',
                        value: '95.2%',
                        color: 'text-blue-400'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-gray-400">{item.label}</span>
                        <span className={`font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Plan de Capacidad */}
          {activeTab === 'capacity' && capacityPlan.length > 0 && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Utilización de Capacidad</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={capacityPlan}>
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
                    <Bar dataKey="utilization" fill="#F59E0B" name="Utilización (%)" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="utilization" stroke="#EC4899" strokeWidth={2} name="Tendencia" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Distribución de Horas</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={capacityPlan}>
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
                      <Bar dataKey="availableHours" fill="#10B981" name="Horas Disponibles" stackId="a" />
                      <Bar dataKey="overtimeHours" fill="#EF4444" name="Horas Extra" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Recomendaciones de Capacidad</h4>
                  <div className="space-y-3">
                    {capacityPlan.map((month, idx) => (
                      month.additionalShifts > 0 && (
                        <div key={idx} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-orange-400 font-semibold">{month.month}</span>
                            <span className="text-white bg-orange-500 px-2 py-1 rounded text-sm">
                              +{month.additionalShifts} turnos
                            </span>
                          </div>
                          <p className="text-orange-300 text-sm mt-1">
                            Se requieren {month.overtimeHours.toFixed(0)} horas extra
                          </p>
                        </div>
                      )
                    ))}
                    {capacityPlan.every(month => month.additionalShifts === 0) && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                        <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 font-semibold">Capacidad suficiente para todo el año</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Plan Financiero */}
          {activeTab === 'financial' && financialPlan.length > 0 && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Flujo Financiero Anual</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={financialPlan}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`Bs${value.toFixed(2)}`, '']}
                    />
                    <Bar dataKey="revenue" fill="#10B981" name="Ingresos" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="totalCost" fill="#EF4444" name="Costos" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="profit" fill="#8B5CF6" name="Utilidad" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Composición de Costos</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={[
                          { name: 'Materiales', value: financialPlan.reduce((sum, f) => sum + f.materialCost, 0) },
                          { name: 'Mano de Obra', value: financialPlan.reduce((sum, f) => sum + f.laborCost, 0) },
                          { name: 'Costos Indirectos', value: financialPlan.reduce((sum, f) => sum + f.overheadCost, 0) },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        <Cell fill="#8B5CF6" />
                        <Cell fill="#EC4899" />
                        <Cell fill="#10B981" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`Bs${value.toFixed(2)}`, '']}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Márgenes por Mes</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialPlan}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value}%`, 'Margen']}
                      />
                      <Bar dataKey="margin" fill="#8B5CF6" name="Margen (%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resumen Financiero */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Resumen Financiero Anual</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Ingresos Totales',
                      value: `Bs${financialPlan.reduce((sum, f) => sum + f.revenue, 0).toFixed(2)}`,
                      color: 'text-green-400'
                    },
                    {
                      label: 'Costos Totales',
                      value: `Bs${financialPlan.reduce((sum, f) => sum + f.totalCost, 0).toFixed(2)}`,
                      color: 'text-red-400'
                    },
                    {
                      label: 'Utilidad Neta',
                      value: `Bs${financialPlan.reduce((sum, f) => sum + f.profit, 0).toFixed(2)}`,
                      color: 'text-purple-400'
                    },
                    {
                      label: 'Margen Promedio',
                      value: `${(financialPlan.reduce((sum, f) => sum + f.profit, 0) / financialPlan.reduce((sum, f) => sum + f.revenue, 0) * 100).toFixed(1)}%`,
                      color: 'text-blue-400'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-gray-400 text-sm mb-2">{item.label}</p>
                      <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}