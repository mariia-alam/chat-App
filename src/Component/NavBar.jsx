/* eslint-disable no-unused-vars */
import logo from '../assets/logo11.png'
import profile from '../assets/profile.png'
import Error from './Error';
import mobileDropDown from '../assets/bars-solid.svg'
import { useNavigate , useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../ContextStore/AuthContext';
import { NotificationContext } from '../ContextStore/NotificationContext';
import { RoomsContext } from '../ContextStore/RoomsContext';
export default function NavBar(){
    const { state: authState, dispatch: authDispatch ,clearToken } = useContext(AuthContext);
    const { error, setError , success, setSuccess , clearNotification } = useContext(NotificationContext);
    const { state: roomsState , setRooms , setOneRoom } = useContext(RoomsContext);
const roomId = authState?.user?.room
    ? String(authState.user.room)
    : null;

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

    function handleLogout(){
        authDispatch({ type: "LOGOUT" });
        clearToken();
        navigate("/")
    }


async function handleGetRoom() {
            setError("");
    if(!authState.token){
        setError("Please log in first")
    }else{
        if(!roomId){
            setError("You don't have any room")
            return;
        }
    }

        try {
            const response = await fetch(`http://localhost:3000/room/${roomId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authState.token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error get room:", errorData.errMsg);
                setError(errorData.errMsg);
                return;
            }else{
            const data = await response.json();
            // console.log("get one room:", data);//room userRole participants
            // console.log("get one room:", data.participants);//room userRole participants
            setOneRoom(data.room, data.userRole, data.participants);
            navigate(`/room/${roomId}`);
            }
        } catch (error) {
            console.error("Error:", error.errMsg);
            setError(error.errMsg);
        }
    }
    useEffect(() => {
    clearNotification()
    }, [location, clearNotification]);




    return(
        <div className='nav-bar'>
            <img id='nav-logo' src={logo} alt="" />
            <img onClick={handleOpenDropDown} id='mobileDropDown' src={mobileDropDown} alt="" />
                {dropdownVisible && (
                        <div className="mobile-drop-down">
                                        <li onClick={handleRoomsClick}>Rooms</li>
                                        <li onClick={handleProfileClick} id='middle'>Profile</li>
                                        <li onClick={handleGetRoom}>My Room</li>
                        </div>)
                }
            <a onClick={handleRoomsClick}>Rooms</a>
            <a onClick={handleProfileClick}>Profile</a>
            <a onClick={handleGetRoom}>My Room</a>
            <a onClick={handleLogout}>Logout</a>
            <img  id='nav-profile' src={profile} alt="" />
            {error && <Error message={error}/>}
        </div>
    );
}