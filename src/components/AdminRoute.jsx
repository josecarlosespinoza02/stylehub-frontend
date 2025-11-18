import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero NO es admin, redirigir al home
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si es admin autenticado, permitir acceso
  return children;
}