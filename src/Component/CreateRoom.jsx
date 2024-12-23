// flex
import { useNavigate, useLocation } from 'react-router-dom';
import Error from './Error';
import Success from '../Component/Success'
import { AuthContext } from '../ContextStore/AuthContext';
import { useContext , useEffect } from 'react';
import { NotificationContext } from '../ContextStore/NotificationContext';
import { RoomsContext } from '../ContextStore/RoomsContext';
export default function CreateRoom({ name, date, roomId, pic }) {
    const { state: authState , dispatch:authDispatch  } = useContext(AuthContext);
    const { state: roomsState , setRooms, setOneRoom } = useContext(RoomsContext);
    const {error , setError , success , setSuccess , clearNotification} = useContext(NotificationContext);
    const navigate = useNavigate()
    const location = useLocation()
    const datee = new Date(date);
    const day = datee.getDate();
    const month = datee.toLocaleString('en-US', { month: 'short' });
    const year = datee.getFullYear();

    async function handleJoin(event) {
        event.stopPropagation();
        setError("");
        try {
            const response = await fetch('http://localhost:3000/join-room', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authState.token}`,
                },
                body:JSON.stringify({
                    roomid: roomId,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error joining room:", errorData.message);
                setError(errorData.message);
            }else{
            const data = await response.json();
            console.log("Joined room:", data);
            authDispatch({ type: "UPDATE_MY_ROOM", payload: [data.room] });

            setSuccess(data.message)
            setTimeout(() => {
                    handleGetRoom();
                    }, 1500);
            }
        } catch (error) {
            console.error("Error:", error);
            setError(error);
        }
    }

    async function handleGetRoom() {
        setError("");
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
            console.log("get one room:", data);//room userRole participants
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

    return (
    <div onClick={handleGetRoom}  className="room">
        <span id="name">{name}</span>
        <img src={pic} alt="Profile" />
        <span className="date">
            <span className="day">{day}</span>
            <span className="month">{month}</span>
            <span className="year">{year}</span>
        </span>
        <button onClick={handleJoin} >Join</button>
        {error && <Error message={error}/>}
        {success && <Success message={success}/>}
    </div>
);
}