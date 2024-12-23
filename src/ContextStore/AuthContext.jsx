/* eslint-disable react/prop-types */
import { createContext, useReducer, useEffect } from "react";
const token =localStorage.getItem("authToken");
let tokenData = null;

if (token) {
    try {
        tokenData = JSON.parse(atob(token?.split('.')[1]));
        console.log("token data",tokenData)
    } catch (error) {
        console.error("Invalid token format", error);
    }
}
// Initial state
const initialAppState = {
    user: {},
    token: token || null,
    isLoggedOut: false,
};

// Reducer function to manage sign-up state
const appReducer = (state, action) => {
    switch (action.type) {
        // case "SIGNUP":
            // return { ...state, user: action.payload.user };
        case "LOGIN":
            return { ...state, token: action.payload.token, isLoggedOut:false};
        case "GET_USER":
            return { ...state, user: action.payload.user};
        case "SESSION_EXPIRED":
            return { ...state, token: null, user:null };
        case "LOGOUT":
            return { ...state, token: null, user:null, isLoggedOut:true };
        case "UPDATE_PROFILE_PICTURE":
        return {
            ...state,
            user: {...state.user , profilePicture: action.payload },
        };
        case "UPDATE_MY_ROOM":
        return {
            ...state,
            user: {...state.user , rooms: action.payload },
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
    // console.log("token",state.token)


function isTokenExpired (){
    if (state.token && tokenData) {
        const currentTime = Date.now() / 1000;
        console.log(tokenData.exp < currentTime)
        return tokenData.exp < currentTime;
    }
    // return true;
}




function clearToken() {
        dispatch({ type: "SESSION_EXPIRED" });
        localStorage.removeItem("authToken");
    }


async function handleGetUser(){
        try {
            const response = await fetch("http://localhost:3000/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${state.token}`,
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                // console.log("fetching user" , responseData)
                dispatch({
                        type: "GET_USER",
                        payload: {
                            user: responseData,
                            },
                        })
                } else {
                const errorData = await response.json();
            console.error("Error fetching user data:", errorData.message);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    }

useEffect(() => {
    if (state.token) {
        handleGetUser();
    }
}, [state.token]);


return (
        <AuthContext.Provider value={{state , dispatch , clearToken , isTokenExpired}}>
            {children}
        </AuthContext.Provider>
    );
};

export  {AuthContext}