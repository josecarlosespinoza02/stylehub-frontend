import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Truck, MapPin, User, Mail, Phone, 
  Lock, CheckCircle, ArrowLeft, Building 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Checkout() {
  const { isDark } = useTheme();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bolivia',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.13;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Paso 3: Confirmar pedido
      await processOrder();
    }
  };

  const processOrder = async () => {
    setProcessing(true);
    
    try {
      // 1. Preparar los datos de la orden
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment: {
          method: paymentMethod,
          cardLast4: paymentMethod === 'card' ? formData.cardNumber.slice(-4) : null,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        totals: {
          subtotal,
          shipping,
          tax,
          total,
        },
        orderDate: new Date().toISOString(),
      };

      // 2. Registrar la venta en el backend
      const response = await axios.post(`${API_URL}/sales`, orderData);

      if (response.data.success) {
        // 3. Limpiar el carrito
        clearCart();
        
        // 4. Mostrar mensaje de éxito
        alert(`✅ ¡Pedido realizado con éxito!\n\nNúmero de orden: ${response.data.orderNumber}\nTotal: Bs${total.toFixed(2)}\n\nRecibirás un correo de confirmación pronto.`);
        
        // 5. Redirigir al home
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error procesando orden:', error);
      
      if (error.response?.data?.message) {
        alert(`❌ Error: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        // Mostrar errores de stock específicos
        const stockErrors = error.response.data.errors
          .map(err => `- ${err.product}: Stock insuficiente (disponible: ${err.available})`)
          .join('\n');
        alert(`❌ No se pudo completar la compra:\n\n${stockErrors}\n\nPor favor, actualiza tu carrito.`);
      } else {
        alert('❌ Error al procesar el pedido. Por favor, intenta nuevamente.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No hay productos en el carrito
          </h2>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Ir a Comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
      
      {/* Header */}
      <div className={`${isDark ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/cart"
            className={`inline-flex items-center gap-2 mb-4 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al carrito
          </Link>
          
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Finalizar Compra
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { num: 1, label: 'Envío', icon: Truck },
              { num: 2, label: 'Pago', icon: CreditCard },
              { num: 3, label: 'Confirmación', icon: CheckCircle },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s.num
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : isDark
                        ? 'bg-slate-800 text-gray-400'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`hidden sm:block font-semibold ${
                      step >= s.num
                        ? isDark ? 'text-white' : 'text-gray-900'
                        : isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`hidden md:block flex-1 h-1 mx-4 rounded-full ${
                      step > s.num
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : isDark ? 'bg-slate-800' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className={`rounded-2xl p-6 ${
                  isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Información de Envío
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Nombre *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Juan"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl transition-all ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Pérez"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="juan@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="+591 123 456 789"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Dirección *
                      </label>
                      <div className="relative">
                        <MapPin className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Calle Principal 123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl transition-all ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="La Paz"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    Continuar al Pago
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className={`rounded-2xl p-6 ${
                  isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Información de Pago
                    </h2>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-500/10'
                          : isDark
                          ? 'border-slate-700 hover:border-slate-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                        paymentMethod === 'card' ? 'text-purple-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Tarjeta
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-purple-500 bg-purple-500/10'
                          : isDark
                          ? 'border-slate-700 hover:border-slate-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Building className={`w-8 h-8 mx-auto mb-2 ${
                        paymentMethod === 'paypal' ? 'text-purple-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        PayPal
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Número de Tarjeta
                        </label>
                        <div className="relative">
                          <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          <input
                            type="text"
                            name="cardNumber"
                            required
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            maxLength="19"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                              isDark
                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Nombre en la Tarjeta
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          required
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl transition-all ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="JUAN PEREZ"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Fecha de Expiración
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            required
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            maxLength="5"
                            className={`w-full px-4 py-3 rounded-xl transition-all ${
                              isDark
                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="MM/YY"
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            CVV
                          </label>
                          <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                              type="text"
                              name="cvv"
                              required
                              value={formData.cvv}
                              onChange={handleInputChange}
                              maxLength="4"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all ${
                                isDark
                                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className={`p-6 rounded-xl text-center ${
                      isDark ? 'bg-slate-800/50' : 'bg-gray-50'
                    }`}>
                      <Building className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Serás redirigido a PayPal para completar el pago
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={processing}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        isDark
                          ? 'bg-slate-800 text-white hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                    >
                      Revisar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className={`rounded-2xl p-6 ${
                  isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Revisar y Confirmar
                    </h2>
                  </div>

                  {/* Shipping Info */}
                  <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Información de Envío
                    </h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {formData.firstName} {formData.lastName}<br />
                      {formData.email}<br />
                      {formData.phone}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.zipCode}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Método de Pago
                    </h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {paymentMethod === 'card' ? (
                        <>Tarjeta terminada en {formData.cardNumber.slice(-4)}</>
                      ) : (
                        <>PayPal</>
                      )}
                    </p>
                  </div>

                  {/* Products */}
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Productos ({cartItems.length})
                    </h3>
                    <div className="space-y-3">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {item.name}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.size} | {item.color} | Cant: {item.quantity}
                            </p>
                          </div>
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Bs{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={processing}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        isDark
                          ? 'bg-slate-800 text-white hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </>
                      ) : (
                        'Confirmar Pedido'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 rounded-2xl p-6 ${
              isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Resumen del Pedido
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.quantity}x Bs{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} pt-4 space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Subtotal
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Bs{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Envío
                  </span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                    {shipping === 0 ? '¡Gratis!' : `Bs${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Impuestos (13%)
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Bs{tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} pt-4 mt-4`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Total
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Bs{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-50'
              }`}>
                <Lock className="w-6 h-6 text-green-500" />
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Pago Seguro
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Encriptación SSL 256-bit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}