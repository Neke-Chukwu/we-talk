import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useStore';
import Spinner from './Spinner';

const ProtectedRoute = () => {
  const location = useLocation();
  const { user, hydrated } = useAppSelector((state) => state.auth);

  if (!hydrated) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


