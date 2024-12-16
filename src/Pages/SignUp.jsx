/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate , useLocation} from "react-router-dom";
import Success from '../Component/Success'
import Error from "../Component/Success";
import { AuthContext } from "../ContextStore/AuthContext";
import { NotificationContext } from "../ContextStore/NotificationContext";

export default function SignUp(){
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { error , setError , success, setSuccess , clearNotification } = useContext(NotificationContext);

    const navigate = useNavigate();
    const location = useLocation();
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

useEffect(() => {
    clearNotification();
}, [location , clearNotification]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }


async function handleSubmit(event){
        event.preventDefault();
        const data = new FormData(event.target);
        const userInfo = Object.fromEntries(data.entries());
                if (!validatePassword(userInfo.password)) {
            setPasswordError("Password must be at least 8 characters long, contain uppercase, lowercase, numbers, and symbols.");
            return;
        }
        if (userInfo.password !== userInfo.confirmPassword) {
            setPasswordError("Passwords do not match!");
            return;
        }
        setPasswordError("");


        try{
            const response = await fetch("http://localhost:3000/signup",{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userInfo.email,
                    username: userInfo.name,
                    password: userInfo.password,
                    repassword: userInfo.confirmPassword
                }),
            });
                if (response.ok) {
                    const responseData = await response.json();
                    console.log("User created successfully:", responseData);
                    localStorage.setItem("user", JSON.stringify(responseData.user));
                    authDispatch({ type: "SIGNUP", payload: { user: responseData.user } });
                    setSuccess(responseData.msg + " log in to continue")
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                }
                else {
                const errorData = await response.json();
                setError(errorData.errMsg || "Sign-up failed");
                }
        } catch (err) {
            console.error("Error during signup:", err);
            setError("An error occurred while signing up");
        }
}


    return(
        <div className="signup common">
                <p className="left"></p>
                <p className="right"></p>
                <p className="bottom"></p>
            <h2>SignUp</h2>
            <hr/>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Enter Your Name"
                    required />
                <input
                    name="email"
                    type="email"
                    placeholder="Enter Your Email"
                    required />
                <div className="password">
                <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    required />
                <span className="signuppassword" onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
                </div>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    required/>
                {passwordError && (
                    <p style={{ color: "red" ,fontSize: "12px" }}>{passwordError}</p>
                )}
                <button>SignUp</button>
            </form>
            {success && <Success message={success}/>}
            {error && <Error message={error}/>}
        </div>
    );
}