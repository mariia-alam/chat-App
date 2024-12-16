/* eslint-disable no-unused-vars */
import logo from '../assets/logo11.png'
import profile from '../assets/profile.png'
import Error from './Error';
import mobileDropDown from '../assets/bars-solid.svg'
import { useNavigate , useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../ContextStore/AuthContext';
import { NotificationContext } from '../ContextStore/NotificationContext';
export default function NavBar(){
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { error, setError , success, setSuccess , clearNotification } = useContext(NotificationContext);

        const navigate = useNavigate();
        const location = useLocation();

        const [dropdownVisible, setDropdownVisible] = useState(false); // حالة القائمة المنسدلة

    function handleRoomsClick(){
        clearNotification()
        if (!authState.token){
            setError("Please log in first")
        }else{
            navigate('/rooms')
        }
    }

    function handleProfileClick(){
        clearNotification()
        if (!authState.token){
            setError("Please log in first")
        }else{
            navigate('/profile')
        }
    }

        useEffect(() => {
    clearNotification()
    }, [clearNotification ,location]);


    function handleOpenDropDown(){
        setDropdownVisible(!dropdownVisible);
    }


    return(
        <div className='nav-bar'>
            <img id='nav-logo' src={logo} alt="" />
            <img onClick={handleOpenDropDown} id='mobileDropDown' src={mobileDropDown} alt="" />
                {dropdownVisible && (
                        <div className="mobile-drop-down">
                                        <li onClick={handleRoomsClick}>Rooms</li>
                                        <li onClick={handleProfileClick} id='middle'>Profile</li>
                                        <li>My Room</li>
                        </div>)
                }
            <a onClick={handleRoomsClick}>Rooms</a>
            <a onClick={handleProfileClick}>Profile</a>
            <a href="">My Room</a>
            <img  id='nav-profile' src={profile} alt="" />
            {error && <Error message={error}/>}
        </div>
    );
}