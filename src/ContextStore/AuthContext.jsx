/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { useMemo } from "react";
const token =localStorage.getItem("authToken");
let tokenData = null;

if (token) {
    try {
        tokenData = JSON.parse(atob(token.split('.')[1]));
        // console.log(tokenData)
    } catch (error) {
        console.error("Invalid token format", error);
    }
}
// Initial state
const initialAppState = {
    user: tokenData
        ? {
            exp: tokenData.exp,
            id: tokenData.id,
            profilepic: tokenData.profilepic || null,
            username: tokenData.username || null,
            room: tokenData.rooms.roomId,
        }
        : {},
    token: token || null,
        isLoggedOut: false,
};

// Reducer function to manage sign-up state
const appReducer = (state, action) => {
    switch (action.type) {
        // case "SIGNUP":
            // return { ...state, user: action.payload.user };
        case "LOGIN":
            return { ...state, token: action.payload.token, isLoggedOut:false , user:action.payload.user};
        case "SESSION_EXPIRED":
            return { ...state, token: null };
        case "LOGOUT":
            return { ...state, token: null, user:null, isLoggedOut:true };
        case "UPDATE_PROFILE_PICTURE":
        return {
            ...state,
            user: {...state.user , profilepic: action.payload },
        };
        case "UPDATE_MY_ROOM":
        return {
            ...state,
            user: {...state.user , room: action.payload },
        };
        default:
            return state;
    }
};

// Creating the context
const AuthContext = createContext();

// Context provider for sign-up
export function AuthProvider({ children }){
    const [state, dispatch] = useReducer(appReducer, initialAppState);
console.log("user" ,state.user)
console.log("token",state.token)

const isTokenExpired = useMemo(() => {
    if (state.token) {
        const currentTime = Date.now() / 1000;
        return tokenData?.user?.exp < currentTime;
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