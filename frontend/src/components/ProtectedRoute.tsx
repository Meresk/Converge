import { Navigate } from 'react-router-dom';
import {getToken, isTokenValid} from "../services/auth/storage.ts";
import {getUserRole} from "../services/auth/authService.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // если не указано — любой валидный пользователь
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const token = getToken();

    if (!token || !isTokenValid()) {
        return <Navigate to="/login" replace />;
    }

    const role = getUserRole();

    if (allowedRoles && !allowedRoles.includes(role || '')) {
        return <Navigate to="/403" replace />; // доступ запрещён
    }

    return <>{children}</>;
}
