import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from "react";
import { RoomsContext } from '../ContextStore/RoomsContext';
import logo from '../assets/logo11.png'
export default function GetStarted(){
    const { token } = useContext(RoomsContext);
    const navigate = useNavigate();


        useEffect(() => {
        if (token) {
            navigate('/rooms');
        }
    }, [token, navigate]);

    return (
        <div className='get-started'>
            <img id='logo' src={logo} alt="" />
            <p>Have an accout ?</p>
            <button onClick={() => navigate('/login')}>Login</button>
            <p>Don&apos;t have an account ? Let&apos;s Create a new one.</p>
            <button onClick={() => navigate('/signup')}>SignUp</button>
        </div>
    );
}