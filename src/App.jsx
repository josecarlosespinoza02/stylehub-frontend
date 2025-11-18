// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from "./components/AdminRoute";


import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Páginas públicas
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

// Páginas Admin
import Dashboard from "./pages/categories/admin/Dashboard";
import Inventory from "./pages/categories/admin/Inventory";
import InventoryAnalysis from "./pages/categories/admin/InventoryAnalysis";
import Operations from "./pages/categories/admin/Operations";
import MaterialsInventory from "./pages/categories/admin/MaterialsInventory";
import Sales from "./pages/categories/admin/Sales";


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />

              <main className="flex-1">
                <Routes>
                  {/* ========== RUTAS PÚBLICAS ========== */}
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<ProductList />} />
                  <Route path="/:categoria" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* ========== RUTAS PROTEGIDAS ========== */}
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />

                  {/* ========== PANEL ADMIN OPTIMIZADO ========== */}
                  
                  {/* Dashboard Principal (fusiona Dashboard + Reports) */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    } 
                  />

                  {/* Gestión de Inventario (CRUD de productos) */}
                  <Route 
                    path="/admin/inventario" 
                    element={
                      <AdminRoute>
                        <Inventory />
                      </AdminRoute>
                    } 
                  />   

                  {/* Análisis de Inventario (EOQ + ABC + Forecasting en pestañas) */}
                  <Route 
                    path="/admin/analisis" 
                    element={
                      <AdminRoute>
                        <InventoryAnalysis />
                      </AdminRoute>
                    } 
                  />

                  {/* Operaciones (Producción + Mantenimiento fusionados) */}
                  <Route 
                    path="/admin/operaciones" 
                    element={
                      <AdminRoute>
                        <Operations />
                      </AdminRoute>
                    } 
                  />

                  {/* Gestión de Insumos y Materiales */}
                  <Route 
                    path="/admin/materiales" 
                    element={
                      <AdminRoute>
                        <MaterialsInventory />
                      </AdminRoute>
                    } 
                  />

                  <Route 
                    path="/admin/ventas" 
                    element={
                      <AdminRoute>
                        <Sales />
                      </AdminRoute>
                    } 
                  />

                  {/* Ruta 404 */}
                  <Route 
                    path="*" 
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                          <p className="text-xl text-gray-600 dark:text-gray-400">Página no encontrada</p>
                        </div>
                      </div>
                    } 
                  />
                </Routes>
              </main>

              <Footer />
              <WhatsAppButton />
            </div>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}