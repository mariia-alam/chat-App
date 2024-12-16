import { useContext, useEffect } from "react";
import { AuthContext } from "../ContextStore/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../ContextStore/NotificationContext";

export default function SessionManager() {
    const { isTokenExpired, clearToken } = useContext(AuthContext);
    const { setError } = useContext(NotificationContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isTokenExpired) {
            setError("Session expired. Please log in again.");
            const timer = setTimeout(() => {
                clearToken();
                navigate("/login");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isTokenExpired, clearToken, navigate, setError]);

    return null;
}
