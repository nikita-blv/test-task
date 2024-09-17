import { Navigate } from "react-router-dom";
import { useAuthContext } from "@root/context/auth/AuthContext.jsx";
import { routes } from "@root/routes/routes";

export const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    if (isAuthenticated) {
        return <Navigate to={routes.lootBoxes} />;
    }
    return children;
};