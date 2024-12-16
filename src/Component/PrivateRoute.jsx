/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../ContextStore/AuthContext";

export default function PrivateRoute({ children }) {
    const { state: authState } = useContext(AuthContext);

    // إذا لم يكن هناك توكن يعيد التوجيه مباشرة
    if (!authState.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
