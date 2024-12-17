/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from "react-router-dom";
import Error from "../Component/Error";
import { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../ContextStore/AuthContext";
import { NotificationContext } from "../ContextStore/NotificationContext";

export default function Login(){
    const navigate = useNavigate();
    const [passwordVisible , setPasswordVisible] = useState(false);
    const location = useLocation();
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { error: notificationError , setError: setNotificationError, clearNotification } = useContext(NotificationContext);
    const [error , setError] = useState("")

function togglePasswordVisibility(){
        setPasswordVisible(!passwordVisible);
    }

async function handleSubmit(event){
        event.preventDefault();
        const data = new FormData(event.target);
        const userInfo = Object.fromEntries(data.entries());
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userInfo.email,
                password: userInfo.password,
            }),
        });
        if (response.ok) {
            const responseData = await response.json();
            // console.log("Login successful:", responseData.token);
            const tokenData = JSON.parse(atob(responseData.token.split('.')[1]));
            console.log(tokenData);
            //LocalStorage
            localStorage.setItem("authToken", responseData.token);
            authDispatch({
                    type: "LOGIN",
                    payload: {
                        token: responseData.token,
                        user: {
                            exp: tokenData.exp,
                            id: tokenData.id,
                            profilepic: tokenData.profilepic,
                            username: tokenData.username,
                            room: tokenData.rooms.roomId,
                        },
                    }
                });
                navigate("/rooms");
        }
        else {
            const errorData = await response.json();
            if (errorData.errMsg === "A user with this email cannot be found") {
            setError(
                <>
                    {errorData.errMsg} <a href="/signup">Create an account</a>
                </>
            );
            } else {
            setError(errorData.errMsg);
            }
    }
    }catch (err) {
        console.error("Error during login:", err);
            setNotificationError(err);
        }
}

useEffect(() => {
    clearNotification()
}, [location, clearNotification]);

    return(
        <div className="common">
                <p className="left"></p>
                <p className="right"></p>
                <p className="bottom"></p>
            <h2>Login</h2>
            <hr/>
            <form onSubmit={handleSubmit}>

                <input type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    required />
                <div className="password">
                <input type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required />
                <span className="loginpassword" onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEyeSlash></FaEyeSlash> : <FaEye/>}
                </span>
                </div>
                {error && <p style={{ color: "red", fontSize: "15px" }}>{error}</p>}
                <button>Login</button>
            </form>
            {notificationError && <Error message={notificationError}/>}

        </div>
    );
}