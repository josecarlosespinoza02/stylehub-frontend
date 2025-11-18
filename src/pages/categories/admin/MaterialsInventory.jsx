import { useState } from 'react';
import { 
  Box, Plus, Edit2, Trash2, Save, X, Search,
  AlertTriangle, TrendingUp, Download, Package, Layers, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function MaterialsInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [classificationFilter, setClassificationFilter] = useState('all');

  const [materials, setMaterials] = useState([
    { id: 1, name: 'Hoodie', annualQuantity: 2400, unit: 'ud', unitPrice: 55.68 },
    { id: 2, name: 'Hilo', annualQuantity: 12000, unit: 'm', unitPrice: 3.5 },
    { id: 3, name: 'Algodón franela', annualQuantity: 2000, unit: 'm', unitPrice: 10 },
    { id: 4, name: 'RIP / pretina', annualQuantity: 2000, unit: 'm', unitPrice: 6 },
    { id: 5, name: 'Hilo de costura', annualQuantity: 500, unit: 'conos', unitPrice: 15 },
    { id: 6, name: 'Cubre costura', annualQuantity: 1000, unit: 'm', unitPrice: 5 },
    { id: 7, name: 'Hilo de bordar', annualQuantity: 300, unit: 'conos', unitPrice: 20 },
    { id: 8, name: 'Pellón estabilizador', annualQuantity: 800, unit: 'm', unitPrice: 12 },
    { id: 9, name: 'Etiquetas', annualQuantity: 2400, unit: 'unid', unitPrice: 3.5 },
    { id: 10, name: 'Bolsas y empaques', annualQuantity: 2400, unit: 'unid', unitPrice: 2.7 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    annualQuantity: '',
    unit: 'ud',
    unitPrice: '',
  });

  const calculateABC = () => {
    const materialsWithValue = materials.map(m => ({
      ...m,
      annualValue: m.annualQuantity * m.unitPrice
    }));

    const sorted = [...materialsWithValue].sort((a, b) => b.annualValue - a.annualValue);
    const totalValue = sorted.reduce((sum, m) => sum + m.annualValue, 0);

    let accumulated = 0;
    return sorted.map(m => {
      const percentage = (m.annualValue / totalValue) * 100;
      accumulated += percentage;

      let classification = 'C';
      if (accumulated <= 80) classification = 'A';
      else if (accumulated <= 95) classification = 'B';

      return {
        ...m,
        percentage: percentage.toFixed(2),
        accumulated: accumulated.toFixed(2),
        classification
      };
    });
  };

  const classifiedMaterials = calculateABC();
  
  const filteredMaterials = classifiedMaterials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classificationFilter === 'all' || m.classification === classificationFilter;
    return matchSearch && matchClass;
  });

  const stats = {
    total: classifiedMaterials.length,
    classA: classifiedMaterials.filter(m => m.classification === 'A').length,
    classB: classifiedMaterials.filter(m => m.classification === 'B').length,
    classC: classifiedMaterials.filter(m => m.classification === 'C').length,
    totalValue: classifiedMaterials.reduce((sum, m) => sum + m.annualValue, 0),
  };

  const paretoData = classifiedMaterials.slice(0, 10).map(m => ({
    name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
    value: m.annualValue,
    accumulated: parseFloat(m.accumulated)
  }));

  const abcDistribution = [
    { name: 'Clase A', value: stats.classA, color: '#10B981', percentage: ((stats.classA / stats.total) * 100).toFixed(1) },
    { name: 'Clase B', value: stats.classB, color: '#F59E0B', percentage: ((stats.classB / stats.total) * 100).toFixed(1) },
    { name: 'Clase C', value: stats.classC, color: '#6B7280', percentage: ((stats.classC / stats.total) * 100).toFixed(1) },
  ];

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name,
        annualQuantity: item.annualQuantity.toString(),
        unit: item.unit,
        unitPrice: item.unitPrice.toString(),
      });
    } else {
      setFormData({
        name: '',
        annualQuantity: '',
        unit: 'ud',
        unitPrice: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.annualQuantity || !formData.unitPrice) {
      alert('⚠️ Completa todos los campos requeridos');
      return;
    }

    const newMaterial = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name,
      annualQuantity: parseFloat(formData.annualQuantity),
      unit: formData.unit,
      unitPrice: parseFloat(formData.unitPrice),
    };

    if (editingItem) {
      setMaterials(materials.map(m => m.id === editingItem.id ? newMaterial : m));
      alert('✅ Insumo actualizado');
    } else {
      setMaterials([...materials, newMaterial]);
      alert('✅ Insumo agregado');
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este insumo?')) {
      setMaterials(materials.filter(m => m.id !== id));
      alert('✅ Insumo eliminado');
    }
  };

  const exportData = () => {
    let csv = 'INVENTARIO DE INSUMOS - LOYOLA CREA TU ESTILO\n';
    csv += `Fecha: ${new Date().toLocaleString('es-ES')}\n\n`;
    csv += 'TABLA DE INVENTARIOS\n';
    csv += 'N°,Artículo,Cantidad Anual,Unidad,Precio Unitario (Bs),Valor Anual (Bs)\n';
    
    materials.forEach((m, idx) => {
      const value = m.annualQuantity * m.unitPrice;
      csv += `${idx + 1},${m.name},${m.annualQuantity},${m.unit},${m.unitPrice.toFixed(2)},${value.toFixed(2)}\n`;
    });
    
    csv += `\nTOTAL,,,,Bs${stats.totalValue.toFixed(2)}\n\n`;
    csv += 'CLASIFICACIÓN ABC\n';
    csv += 'N°,Artículo,Valor Anual (Bs),% del Total,% Acumulado,Clasificación\n';
    
    classifiedMaterials.forEach((m, idx) => {
      csv += `${idx + 1},${m.name},${m.annualValue.toFixed(2)},${m.percentage}%,${m.accumulated}%,${m.classification}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_insumos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              Gestión de Insumos y Materiales
            </h1>
            <p className="text-gray-400">Inventario de materias primas y componentes</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={exportData} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button onClick={() => openModal()} className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Agregar Insumo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Total Insumos', value: stats.total, icon: Box, color: 'from-purple-500 to-pink-600' },
            { label: 'Clase A', value: stats.classA, icon: TrendingUp, color: 'from-green-500 to-emerald-600', desc: '0-80%' },
            { label: 'Clase B', value: stats.classB, icon: AlertTriangle, color: 'from-yellow-500 to-orange-600', desc: '80-95%' },
            { label: 'Clase C', value: stats.classC, icon: Package, color: 'from-gray-500 to-slate-600', desc: '95-100%' },
            { label: 'Valor Total', value: `Bs${stats.totalValue.toFixed(2)}`, icon: DollarSign, color: 'from-blue-500 to-cyan-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                {stat.desc && <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Diagrama de Pareto - Clasificación ABC</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" angle={-30} textAnchor="end" height={100} />
                <YAxis yAxisId="left" stroke="#94a3b8" label={{ value: 'Valor Anual (Bs)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" label={{ value: '% Acumulado', angle: 90, position: 'insideRight', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar yAxisId="left" dataKey="value" fill="#8B5CF6" name="Valor Anual (Bs)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Distribución por Clase</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={abcDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ percentage }) => `${percentage}%`}>
                  {abcDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {abcDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-400 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Buscar insumo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <select value={classificationFilter} onChange={(e) => setClassificationFilter(e.target.value)} className="px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">Todas las clases</option>
              <option value="A">Clase A (Críticos)</option>
              <option value="B">Clase B (Importantes)</option>
              <option value="C">Clase C (Normales)</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white">Inventario de Insumos</h3>
            <p className="text-gray-400 text-sm mt-1">Clasificación ABC según valor anual de consumo</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">N°</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Artículo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Cantidad Anual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Precio Unitario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Valor Anual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">% del Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">% Acumulado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Clasificación</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMaterials.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4"><p className="text-white font-semibold">{item.name}</p></td>
                    <td className="px-6 py-4 text-white">{item.annualQuantity.toLocaleString()} {item.unit}</td>
                    <td className="px-6 py-4 text-white">Bs{item.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-white font-semibold">Bs{item.annualValue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-white">{item.percentage}%</td>
                    <td className="px-6 py-4 text-white">{item.accumulated}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.classification === 'A' ? 'bg-green-500/20 text-green-400' : item.classification === 'B' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        Clase {item.classification}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openModal(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800/50 border-t-2 border-slate-700">
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-right text-white font-bold">TOTAL</td>
                  <td className="px-6 py-4 text-white font-bold text-lg">Bs{stats.totalValue.toFixed(2)}</td>
                  <td colSpan="4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Interpretación de la Clasificación ABC</h3>
          <div className="space-y-4 text-gray-300">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 font-semibold mb-2">✓ Clase A (0-80% del valor)</p>
              <p className="text-sm">Insumos críticos que concentran el mayor valor del inventario. Requieren <strong>control estricto</strong>, revisiones frecuentes y planificación cuidadosa para evitar faltantes en la producción.</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-400 font-semibold mb-2">⚠ Clase B (80-95% del valor)</p>
              <p className="text-sm">Insumos importantes con valor intermedio. Requieren <strong>control moderado</strong> con revisiones mensuales, optimizando recursos sin comprometer la producción.</p>
            </div>
            <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
              <p className="text-gray-400 font-semibold mb-2">◯ Clase C (95-100% del valor)</p>
              <p className="text-sm">Insumos de menor impacto económico. Se gestionan con <strong>controles simples</strong> y reposiciones periódicas (trimestrales o semestrales), sin afectar el flujo productivo.</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{editingItem ? 'Editar Insumo' : 'Agregar Insumo'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition-all">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Nombre del Insumo *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ej: Hilo de algodón" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Cantidad Anual *</label>
                  <input type="number" step="0.01" required value={formData.annualQuantity} onChange={(e) => setFormData({...formData, annualQuantity: e.target.value})} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="2400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Unidad *</label>
                  <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="ud">Unidades (ud)</option>
                    <option value="m">Metros (m)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="conos">Conos</option>
                    <option value="unid">Unidades (unid)</option>
                    <option value="rollos">Rollos</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Precio Unitario (Bs) *</label>
                <input type="number" step="0.01" required value={formData.unitPrice} onChange={(e) => setFormData({...formData, unitPrice: e.target.value})} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="55.68" />
              </div>
              {formData.annualQuantity && formData.unitPrice && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-orange-400 text-sm font-semibold mb-1">Valor Anual Calculado:</p>
                  <p className="text-white text-2xl font-bold">Bs{(parseFloat(formData.annualQuantity || 0) * parseFloat(formData.unitPrice || 0)).toFixed(2)}</p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
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