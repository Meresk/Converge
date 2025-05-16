import { Navigate } from 'react-router-dom';
import {getToken} from "../services/auth/storage.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function PublicRoute({ children }: ProtectedRouteProps) {
    const token = getToken()

    if (token) {
        return <Navigate to="/teacher" replace />;
    }

    return <>{children}</>;
}
