import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../../api/api';

const AuthGuard = () => {
    const token = getToken();
    const location = useLocation();

    if (!token) {
        // Redirect to login while saving the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
