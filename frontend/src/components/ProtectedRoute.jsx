import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ role, children }) => {
    const { user } = useAppContext();

    // Loading check removed as AppContext initializes synchronously from localStorage

    if (!user) return <Navigate to="/" />;

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
