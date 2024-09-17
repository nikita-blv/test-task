import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@root/context/auth/AuthContext.jsx";
import { routes } from "@root/routes/routes.js";

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to={`${routes.signIn}?loginFrom=${encodeURIComponent(location.pathname+location.search)}`} />;
    }
    return children;
};