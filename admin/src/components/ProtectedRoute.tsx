import { useAuthStore } from '../stores/auth.store.ts';
import { Navigate, Outlet } from 'react-router-dom';
import React, {ReactNode} from "react";

interface ProtectedRouteProps {
    children?: ReactNode;
    redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, redirectPath = '/login',}: { children?: ReactNode; redirectPath?: string }) => {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;