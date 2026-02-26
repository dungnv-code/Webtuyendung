import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
    const User = useSelector(state => state.user);

    if (!User.isLogIn) return <Navigate to="/login" replace />;

    const decode = jwtDecode(User.token);

    if (role === "ADMIN" && decode.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    if (role === "BUSINESS" &&
        decode.role !== "nhatuyendung" &&
        decode.role !== "STAFF") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;