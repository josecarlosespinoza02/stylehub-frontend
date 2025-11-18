import { useState, useEffect } from 'react';
import { 
  Package, Wrench, Plus, X, Save, Edit2, Trash2,
  CheckCircle, Clock, PlayCircle, XCircle, Settings,
  DollarSign, Download, TrendingUp, AlertTriangle, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Operations() {
  const [activeTab, setActiveTab] = useState('production');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('production');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cargar productos del backend
  const [products, setProducts] = useState([]);
  const [eoqData, setEoqData] = useState({});

  // Estados para Producción
  const [productionOrders, setProductionOrders] = useState([]);

  // Estados para Mantenimiento
  const [maintenanceLogs, setMaintenanceLogs] = useState([
    {
      id: 1,
      equipmentName: 'Máquina de Costura Industrial',
      equipmentCode: 'MCI-001',
      maintenanceType: 'preventive',
      status: 'completed',
      priority: 'normal',
      scheduledDate: '2025-01-15',
      completionDate: '2025-01-15',
      nextMaintenance: '2025-04-15',
      technicianName: 'Carlos Mendoza',
      cost: 450,
      downtimeHours: 2.5,
    },
    {
      id: 2,
      equipmentName: 'Cortadora Textil Automática',
      equipmentCode: 'CTA-002',
      maintenanceType: 'corrective',
      status: 'in_progress',
      priority: 'high',
      scheduledDate: '2025-01-20',
      completionDate: null,
      nextMaintenance: null,
      technicianName: 'Ana López',
      cost: 0,
      downtimeHours: 4.0,
    },
  ]);

  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    priority: 'normal',
    scheduledDate: '',
    estimatedCost: '',
    notes: '',
    equipmentName: '',
    equipmentCode: '',
    maintenanceType: 'preventive',
    technicianName: '',
    description: '',
  });

  // Cargar datos del backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        calculateEOQData(data.products);
        generateProductionOrders(data.products);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular datos EOQ para referencia
  const calculateEOQData = (prods) => {
    const eoq = {};
    prods.forEach(p => {
      const D = Number(p.reviews) * 12 || 2400;
      const price = Number(p.price);
      const S = 90;
      const H = price * 0.20;
      const EOQ = Math.sqrt((2 * D * S) / H);
      const ordersPerYear = D / EOQ;
      const daysBetweenOrders = 365 / ordersPerYear;
      
      eoq[p.id] = {
        EOQ: Math.round(EOQ),
        ordersPerYear: Math.round(ordersPerYear),
        daysBetweenOrders: Math.round(daysBetweenOrders)
      };
    });
    setEoqData(eoq);
  };

  // Generar órdenes de producción basadas en EOQ
  const generateProductionOrders = (prods) => {
    const orders = prods.slice(0, 5).map((p, idx) => {
      const D = Number(p.reviews) * 12 || 2400;
      const price = Number(p.price);
      const EOQ = Math.round(Math.sqrt((2 * D * 90) / (price * 0.20)));
      
      const statuses = ['pending', 'in_progress', 'completed'];
      const priorities = ['normal', 'high', 'urgent'];
      const status = statuses[idx % 3];
      const priority = priorities[idx % 3];
      
      return {
        id: idx + 1,
        orderNumber: `PROD-2025-${String(idx + 1).padStart(3, '0')}`,
        product: p.name,
        productId: p.id,
        quantity: EOQ,
        status: status,
        priority: priority,
        scheduledDate: new Date(Date.now() + idx * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: status === 'in_progress' || status === 'completed' ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        expectedCompletion: new Date(Date.now() + (idx + 1) * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: status === 'pending' ? 0 : status === 'in_progress' ? 65 : 100,
        estimatedCost: EOQ * price * 0.7,
        actualCost: status === 'completed' ? EOQ * price * 0.65 : status === 'in_progress' ? EOQ * price * 0.4 : 0,
      };
    });
    setProductionOrders(orders);
  };

  // Estadísticas
  const productionStats = {
    total: productionOrders.length,
    pending: productionOrders.filter(o => o.status === 'pending').length,
    inProgress: productionOrders.filter(o => o.status === 'in_progress').length,
    completed: productionOrders.filter(o => o.status === 'completed').length,
  };

  const maintenanceStats = {
    total: maintenanceLogs.length,
    pending: maintenanceLogs.filter(m => m.status === 'pending').length,
    inProgress: maintenanceLogs.filter(m => m.status === 'in_progress').length,
    completed: maintenanceLogs.filter(m => m.status === 'completed').length,
  };

  // Datos para gráficos
  const monthlyProduction = [
    { month: 'Ene', cantidad: 450, costo: 42750 },
    { month: 'Feb', cantidad: 380, costo: 36100 },
    { month: 'Mar', cantidad: 520, costo: 49400 },
    { month: 'Abr', cantidad: 489, costo: 46455 },
    { month: 'May', cantidad: 612, costo: 58140 },
    { month: 'Jun', cantidad: 587, costo: 55765 },
  ];

  const maintenanceTypes = [
    { name: 'Preventivo', value: 8, color: '#10B981' },
    { name: 'Correctivo', value: 3, color: '#F59E0B' },
    { name: 'Predictivo', value: 2, color: '#8B5CF6' },
  ];

  // Funciones de utilidad
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'normal': return 'bg-green-500/20 text-green-400';
      case 'low': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return Clock;
      case 'in_progress': return PlayCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  // Abrir modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (item) {
      setFormData(type === 'production' ? {
        product: item.product,
        quantity: item.quantity.toString(),
        priority: item.priority,
        scheduledDate: item.scheduledDate,
        estimatedCost: item.estimatedCost.toString(),
        notes: '',
      } : {
        equipmentName: item.equipmentName,
        equipmentCode: item.equipmentCode,
        maintenanceType: item.maintenanceType,
        priority: item.priority,
        scheduledDate: item.scheduledDate,
        technicianName: item.technicianName,
        description: '',
      });
    } else {
      setFormData({
        product: '',
        quantity: '',
        priority: 'normal',
        scheduledDate: '',
        estimatedCost: '',
        notes: '',
        equipmentName: '',
        equipmentCode: '',
        maintenanceType: 'preventive',
        technicianName: '',
        description: '',
      });
    }
    
    setShowModal(true);
  };

  // Guardar
  const handleSave = (e) => {
    e.preventDefault();
    
    if (modalType === 'production') {
      if (!formData.product || !formData.quantity || !formData.scheduledDate) {
        alert('⚠️ Completa todos los campos requeridos');
        return;
      }

      const selectedProduct = products.find(p => p.name === formData.product);
      const newOrder = {
        id: editingItem ? editingItem.id : Date.now(),
        orderNumber: editingItem ? editingItem.orderNumber : `PROD-2025-${String(productionOrders.length + 1).padStart(3, '0')}`,
        product: formData.product,
        productId: selectedProduct?.id,
        quantity: parseInt(formData.quantity),
        status: editingItem ? editingItem.status : 'pending',
        priority: formData.priority,
        scheduledDate: formData.scheduledDate,
        startDate: editingItem ? editingItem.startDate : null,
        expectedCompletion: new Date(new Date(formData.scheduledDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: editingItem ? editingItem.progress : 0,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        actualCost: editingItem ? editingItem.actualCost : 0,
      };

      if (editingItem) {
        setProductionOrders(productionOrders.map(o => o.id === editingItem.id ? newOrder : o));
        alert('✅ Orden de producción actualizada');
      } else {
        setProductionOrders([...productionOrders, newOrder]);
        alert('✅ Orden de producción creada');
      }
    } else {
      if (!formData.equipmentName || !formData.scheduledDate) {
        alert('⚠️ Completa todos los campos requeridos');
        return;
      }

      const newMaintenance = {
        id: editingItem ? editingItem.id : Date.now(),
        equipmentName: formData.equipmentName,
        equipmentCode: formData.equipmentCode || `EQ-${Date.now()}`,
        maintenanceType: formData.maintenanceType,
        status: editingItem ? editingItem.status : 'pending',
        priority: formData.priority,
        scheduledDate: formData.scheduledDate,
        completionDate: editingItem ? editingItem.completionDate : null,
        nextMaintenance: editingItem ? editingItem.nextMaintenance : null,
        technicianName: formData.technicianName,
        cost: editingItem ? editingItem.cost : 0,
        downtimeHours: editingItem ? editingItem.downtimeHours : 0,
      };

      if (editingItem) {
        setMaintenanceLogs(maintenanceLogs.map(m => m.id === editingItem.id ? newMaintenance : m));
        alert('✅ Mantenimiento actualizado');
      } else {
        setMaintenanceLogs([...maintenanceLogs, newMaintenance]);
        alert('✅ Mantenimiento programado');
      }
    }

    setShowModal(false);
    setEditingItem(null);
  };

  // Eliminar
  const handleDelete = (type, id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      if (type === 'production') {
        setProductionOrders(productionOrders.filter(o => o.id !== id));
      } else {
        setMaintenanceLogs(maintenanceLogs.filter(m => m.id !== id));
      }
      alert('✅ Registro eliminado');
    }
  };

  // Exportar
  const exportData = (format) => {
    const data = activeTab === 'production' ? productionOrders : maintenanceLogs;
    
    if (format === 'csv') {
      let csv = activeTab === 'production' 
        ? 'ÓRDENES DE PRODUCCIÓN - LOYOLA CREA TU ESTILO\n\nOrden,Producto,Cantidad,Estado,Prioridad,Fecha,Progreso,Costo Estimado,Costo Real\n'
        : 'MANTENIMIENTOS - LOYOLA CREA TU ESTILO\n\nEquipo,Código,Tipo,Estado,Prioridad,Fecha,Técnico,Costo,Tiempo Parada\n';
      
      data.forEach(item => {
        if (activeTab === 'production') {
          csv += `${item.orderNumber},${item.product},${item.quantity},${item.status},${item.priority},${item.scheduledDate},${item.progress}%,Bs${item.estimatedCost},Bs${item.actualCost}\n`;
        } else {
          csv += `${item.equipmentName},${item.equipmentCode},${item.maintenanceType},${item.status},${item.priority},${item.scheduledDate},${item.technicianName},Bs${item.cost},${item.downtimeHours}h\n`;
        }
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const currentStats = activeTab === 'production' ? productionStats : maintenanceStats;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando operaciones...</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              Gestión de Operaciones
            </h1>
            <p className="text-gray-400">Producción basada en EOQ y mantenimiento preventivo</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportData('csv')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={() => openModal(activeTab)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {activeTab === 'production' ? 'Nueva Orden' : 'Programar Mantenimiento'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-xl">
          {[
            { id: 'production', label: 'Producción', icon: Package },
            { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total', value: currentStats.total, icon: activeTab === 'production' ? Package : Wrench, color: 'from-purple-500 to-pink-600' },
            { label: 'Pendientes', value: currentStats.pending, icon: Clock, color: 'from-yellow-500 to-orange-600' },
            { label: 'En Proceso', value: currentStats.inProgress, icon: PlayCircle, color: 'from-blue-500 to-cyan-600' },
            { label: 'Completados', value: currentStats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {activeTab === 'production' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Producción Mensual (basada en EOQ)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyProduction}>
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
                  <Bar dataKey="cantidad" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Costos de Producción</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProduction}>
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
                  <Line type="monotone" dataKey="costo" stroke="#EC4899" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Tipos de Mantenimiento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maintenanceTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {maintenanceTypes.map((entry, index) => (
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
          </div>
        )}

        {/* Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white">
              {activeTab === 'production' ? 'Órdenes de Producción (Calculadas con EOQ)' : 'Registros de Mantenimiento'}
            </h3>
            {activeTab === 'production' && (
              <p className="text-gray-400 text-sm mt-1">
                Las cantidades están optimizadas según el modelo EOQ para minimizar costos
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  {activeTab === 'production' ? (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Orden</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Producto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Cantidad (EOQ)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Prioridad</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Progreso</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Costo</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Acciones</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Equipo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Prioridad</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Fecha</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Técnico</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Costo</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Acciones</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeTab === 'production' ? (
                  productionOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{order.orderNumber}</p>
                          <p className="text-xs text-gray-500">{order.scheduledDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{order.product}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{order.quantity}</span>
                          <span className="text-gray-500 text-sm ml-1">unidades</span>
                          {eoqData[order.productId] && (
                            <p className="text-xs text-gray-500 mt-1">
                              Pedidos/año: {eoqData[order.productId].ordersPerYear}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(order.priority)}`}>
                            {order.priority === 'urgent' ? 'Urgente' : order.priority === 'high' ? 'Alta' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-2 w-fit ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.status === 'pending' ? 'Pendiente' : order.status === 'in_progress' ? 'En Proceso' : 'Completado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${order.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold text-sm">{order.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">Bs{order.actualCost.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Est: Bs{order.estimatedCost.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openModal('production', order)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('production', order.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  maintenanceLogs.map((log) => {
                    const StatusIcon = getStatusIcon(log.status);
                    return (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{log.equipmentName}</p>
                          <p className="text-xs text-gray-500">{log.equipmentCode}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            log.maintenanceType === 'preventive' ? 'bg-green-500/20 text-green-400' :
                            log.maintenanceType === 'corrective' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {log.maintenanceType === 'preventive' ? 'Preventivo' : log.maintenanceType === 'corrective' ? 'Correctivo' : 'Predictivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(log.priority)}`}>
                            {log.priority === 'high' ? 'Alta' : log.priority === 'critical' ? 'Crítica' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-2 w-fit ${getStatusColor(log.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {log.status === 'pending' ? 'Pendiente' : log.status === 'in_progress' ? 'En Proceso' : 'Completado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">{log.scheduledDate}</p>
                          {log.nextMaintenance && (
                            <p className="text-xs text-gray-500">Próx: {log.nextMaintenance}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">{log.technicianName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">Bs{log.cost}</p>
                          <p className="text-xs text-gray-500">{log.downtimeHours}h parada</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openModal('maintenance', log)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('maintenance', log.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? 'Editar' : modalType === 'production' ? 'Nueva Orden de Producción' : 'Programar Mantenimiento'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              {modalType === 'production' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Producto *</label>
                      <select
                        required
                        value={formData.product}
                        onChange={(e) => {
                          const product = products.find(p => p.name === e.target.value);
                          const eoq = eoqData[product?.id];
                          setFormData({
                            ...formData, 
                            product: e.target.value,
                            quantity: eoq?.EOQ?.toString() || '',
                            estimatedCost: (Number(product?.price || 0) * (eoq?.EOQ || 0) * 0.7).toFixed(2)
                          });
                        }}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Seleccionar</option>
                        {products.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.name} {eoqData[p.id] ? `(EOQ: ${eoqData[p.id].EOQ})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Cantidad (EOQ) *</label>
                      <input
                        type="number"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="197"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Prioridad *</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="low">Baja</option>
                        <option value="normal">Normal</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Fecha Programada *</label>
                      <input
                        type="date"
                        required
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-2 block">Costo Estimado (Bs)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="15000.00"
                    />
                  </div>

                  {formData.product && eoqData[products.find(p => p.name === formData.product)?.id] && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-blue-400 text-sm font-semibold mb-2">📊 Información EOQ</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                        <p>Pedidos/año: {eoqData[products.find(p => p.name === formData.product)?.id].ordersPerYear}</p>
                        <p>Días entre pedidos: {eoqData[products.find(p => p.name === formData.product)?.id].daysBetweenOrders}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Nombre del Equipo *</label>
                      <input
                        type="text"
                        required
                        value={formData.equipmentName}
                        onChange={(e) => setFormData({...formData, equipmentName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Máquina de Costura"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Código</label>
                      <input
                        type="text"
                        value={formData.equipmentCode}
                        onChange={(e) => setFormData({...formData, equipmentCode: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="MCI-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Tipo *</label>
                      <select
                        value={formData.maintenanceType}
                        onChange={(e) => setFormData({...formData, maintenanceType: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="preventive">Preventivo</option>
                        <option value="corrective">Correctivo</option>
                        <option value="predictive">Predictivo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Prioridad *</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="low">Baja</option>
                        <option value="normal">Normal</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400 mb-2 block">Fecha *</label>
                      <input
                        type="date"
                        required
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-2 block">Técnico Asignado</label>
                    <input
                      type="text"
                      value={formData.technicianName}
                      onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Carlos Mendoza"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingItem ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}