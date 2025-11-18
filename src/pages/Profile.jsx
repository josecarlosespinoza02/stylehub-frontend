import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, X, Camera,
  Package, Heart, ShoppingBag, LogOut, Settings, Shield
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { isDark } = useTheme();
  const { user, logout, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Órdenes simuladas (luego vendrán del backend)
  const orders = [
    {
      id: '#ORD-001',
      date: '2025-01-05',
      status: 'Entregado',
      total: 289.99,
      items: 3,
      statusColor: 'green',
    },
    {
      id: '#ORD-002',
      date: '2025-01-08',
      status: 'En camino',
      total: 149.99,
      items: 1,
      statusColor: 'blue',
    },
    {
      id: '#ORD-003',
      date: '2025-01-10',
      status: 'Procesando',
      total: 459.99,
      items: 4,
      statusColor: 'yellow',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      alert('❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
      
      {/* Breadcrumb */}
      <div className={`${isDark ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}>
              Inicio
            </Link>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Mi Perfil</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className={`rounded-2xl p-6 ${
              isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              
              {/* Avatar y nombre */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full border-4 border-purple-500"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h2 className={`text-xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.email}
                </p>
                {user?.role === 'admin' && (
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Administrador
                  </div>
                )}
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Mi Perfil</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Mis Pedidos</span>
                  <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                    activeTab === 'orders'
                      ? 'bg-white/20'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {orders.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'wishlist'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Favoritos</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configuración</span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isDark
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className={`rounded-2xl p-6 md:p-8 ${
                isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Información Personal
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                          isDark
                            ? 'bg-slate-800 text-white hover:bg-slate-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Guardar
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } border focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } border focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } border focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all resize-none ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } border focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                        placeholder="Calle, número, ciudad..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className={`rounded-2xl p-6 md:p-8 ${
                isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Mis Pedidos
                </h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                          : 'bg-gray-50 border-gray-200 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {order.id}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.statusColor === 'green'
                                ? 'bg-green-500/20 text-green-400'
                                : order.statusColor === 'blue'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p>Fecha: {new Date(order.date).toLocaleDateString('es-ES')}</p>
                            <p>{order.items} productos • ${order.total}</p>
                          </div>
                        </div>
                        <Link
                          to={`/order/${order.id}`}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className={`rounded-2xl p-6 md:p-8 ${
                isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Mis Favoritos
                </h2>
                
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-4">Aún no tienes productos favoritos</p>
                  <Link
                    to="/productos"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Explorar Productos
                  </Link>
                </div>
              </div>
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <div className={`rounded-2xl p-6 md:p-8 ${
                isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Configuración
                </h2>
                
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Cambiar Contraseña
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Actualiza tu contraseña periódicamente para mayor seguridad
                    </p>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      Cambiar Contraseña
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Notificaciones
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gestiona cómo quieres recibir notificaciones
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                          Notificaciones por email
                        </span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                          Ofertas y promociones
                        </span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </label>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                    <h3 className={`font-bold mb-2 text-red-500`}>
                      Eliminar Cuenta
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                      Esta acción es permanente y no se puede deshacer
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">
                      Eliminar Mi Cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}