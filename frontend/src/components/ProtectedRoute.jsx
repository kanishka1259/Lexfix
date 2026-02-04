import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/" />;

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
