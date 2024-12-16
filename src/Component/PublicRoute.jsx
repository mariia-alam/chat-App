/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../ContextStore/AuthContext";

export default function PublicRoute({ children }) {
    const { state: authState } = useContext(AuthContext);

    if (authState.token) {
        return <Navigate to="/rooms" replace />;
    }

    return children;
}

