import { Navigate } from 'react-router-dom';
import {getToken} from "../services/auth/storage.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = getToken()

    if (!token) {
        // Если нет токена — редиректим на страницу логина
        return <Navigate to="/login" replace />;
    }

    // Если есть токен — показываем защищённый контент
    return <>{children}</>;
}
