/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { useMemo } from "react";

// Initial state
const initialAppState = {
    user: JSON.parse(localStorage.getItem("user")),
    token:localStorage.getItem("authToken") || null,
};

// Reducer function to manage sign-up state
const appReducer = (state, action) => {
    switch (action.type) {
        case "SIGNUP":
            return { ...state, user: action.payload.user };
        case "LOGIN":
            return { ...state, token: action.payload.token };
        case "SESSION_EXPIRED":
            return { ...state, token: null };
        case "LOGOUT":
            return { ...state, token: null,};
        case "UPDATE_PROFILE_PICTURE":
        return {
            ...state,
            user: { ...state.user, profilePicture: action.payload.profilePicture },
        };        default:
            return state;
    }
};

// Creating the context
const AuthContext = createContext();

// Context provider for sign-up
export function AuthProvider({ children }){
    const [state, dispatch] = useReducer(appReducer, initialAppState);

const isTokenExpired = useMemo(() => {
    if (state.token) {
        const currentTime = Date.now() / 1000;
        const tokenData = JSON.parse(atob(state.token.split('.')[1]));
        return tokenData.exp < currentTime;
    }
    return true;
}, [state.token]);


    function clearToken() {
        localStorage.removeItem("authToken");
                dispatch({ type: "SESSION_EXPIRED" });
    }

    return (
        <AuthContext.Provider value={{state , dispatch , clearToken , isTokenExpired}}>
            {children}
        </AuthContext.Provider>
    );
};

export  {AuthContext}