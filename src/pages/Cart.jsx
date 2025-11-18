import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift, Percent } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { isDark } = useTheme();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (cartItems.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
            : 'bg-gradient-to-br from-gray-50 to-white'
        }`}
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tu carrito está vacío
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ¡Explora nuestros productos y encuentra lo que buscas!
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Ir a Comprar
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-gray-50 to-white'
      }`}
    >
      {/* Breadcrumb */}
      <div
        className={`${
          isDark
            ? 'bg-slate-900/50 border-b border-slate-800'
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className={`${
                isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
            >
              Inicio
            </Link>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Carrito</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Carrito de Compras
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.color}-${index}`}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-xl"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className={`text-lg font-bold mb-1 hover:text-purple-500 transition-colors line-clamp-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </Link>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Talla: {item.size} | Color: {item.color}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Quantity */}
                      <div
                        className={`flex items-center rounded-xl overflow-hidden ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700'
                            : 'bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                          }
                          className={`p-2 transition-colors ${
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span
                          className={`px-4 font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                          }
                          className={`p-2 transition-colors ${
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`text-xl font-bold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {formatCurrency(item.price)} c/u
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${
                            isDark
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`sticky top-24 rounded-2xl p-6 space-y-6 ${
                isDark
                  ? 'bg-slate-900/50 border border-slate-800'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Resumen del Pedido
              </h2>

              {/* Coupon */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-5 h-5 text-purple-500" />
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    ¿Tienes un cupón?
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código de descuento"
                    className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  <button
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      isDark
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              <div
                className={`border-t ${
                  isDark ? 'border-slate-800' : 'border-gray-200'
                } pt-6 space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Subtotal
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Envío
                  </span>
                  <span
                    className={`font-semibold ${
                      shipping === 0
                        ? 'text-green-500'
                        : isDark
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}
                  >
                    {shipping === 0 ? '¡Gratis!' : formatCurrency(shipping)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Descuento
                    </span>
                    <span className="font-semibold text-green-500">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
              </div>

              {subtotal < 100 && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 ${
                    isDark
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <Gift className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p
                    className={`text-sm ${
                      isDark ? 'text-blue-300' : 'text-blue-700'
                    }`}
                  >
                    Agrega{' '}
                    <span className="font-bold">
                      {formatCurrency(100 - subtotal)}
                    </span>{' '}
                    más para obtener envío gratis
                  </p>
                </div>
              )}

              <div
                className={`border-t ${
                  isDark ? 'border-slate-800' : 'border-gray-200'
                } pt-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Total
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/productos"
                  className={`w-full mt-3 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
