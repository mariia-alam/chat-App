/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../ContextStore/AuthContext";
import SessionManager from "./SessionManager";
export default function PrivateRoute({ children }) {
    const { state: authState } = useContext(AuthContext);
    if (!authState.token) {
        return <Navigate to="/login" replace />;
    }

    return       ( <>
            <SessionManager />
            {children}
        </>);
}
