import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Error from "../Component/Error";
import search from '../assets/search.png'
import CreateRoom from "../Component/CreateRoom";
import { useLocation } from "react-router-dom";
import { RoomsContext } from "../ContextStore/RoomsContext";
import { AuthContext } from "../ContextStore/AuthContext";
import { useContext } from "react";
import NavBar from "../Component/NavBar";
import Success from '../Component/Success'
import { NotificationContext } from "../ContextStore/NotificationContext";


export default function Rooms(){
  const { state: authState  , dispatch: authDispatch} = useContext(AuthContext);
  const { state: roomsState , setRooms } = useContext(RoomsContext);
  const {error , setError , success , setSuccess , clearNotification} = useContext(NotificationContext);

    const location = useLocation();




    async function handleCreate(){
        const result= await Swal.fire({
        title: 'Do you want to create a room?',
        //= icon: 'question', //success, error, warning, info, question
        confirmButtonText: 'Create',
        confirmButtonColor: '#9759C7',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        width: '400px',
        customClass: {
            title:'title',
            popup: 'question-popup',
        },
        position: 'center',
    });
    if (result.isConfirmed) {
        Swal.close();
        try{
            const response = await fetch("http://localhost:3000/create-room",{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authState.token}`,
                },
            });
                if (response.ok) {
                const responseData = await response.json();
                console.log("room created successfully:", responseData);
                setSuccess(responseData.message);
                    authDispatch({ type: "UPDATE_MY_ROOM", payload: responseData.room.id });
                await handleFetchRooms();
                }
                else {
                const errorData = await response.json();
                setError(errorData.errMsg || "Internal server error");
                Swal.close();
                }
        }catch(err){
            console.error("Error during create a room:", err);
            setError("Internal server error");
        }
    } else if (result.isDismissed) {
        console.log('User clicked Cancel');
        Swal.close();
    }
}


    async function handleFetchRooms(){
        try {
            const response = await fetch("http://localhost:3000/rooms", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authState.token}`,
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                setRooms(responseData.rooms);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Internal server error");
            }
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setError("Internal server error");
        }
    }

    useEffect(() => {
    handleFetchRooms();
}, []);



    useEffect(() => {
clearNotification();
    }, [location, clearNotification]);



    return(
        <div className="rooms">
            <NavBar></NavBar>
            <nav className="nav">
                    <p>Available Rooms</p>
                    <div className="nav-right">
                        <button onClick={handleCreate}>Create Room</button>
                        <img id="search" src={search} alt="" />
                    </div>
            </nav>
            <main>
                <div className="scrollable-content">
                {roomsState.rooms.length === 0 && <p id='note'>No rooms created</p>}
                {roomsState.rooms.map((room) => (<CreateRoom name={room.host.username} date={room.updatedAt} roomId={room.id} key={room.id} pic={`http://localhost:3000/${room.host.profilePicture}`}></CreateRoom>
                ))}
                </div>
            </main>
            {error && <Error message={error}/>}
            {success && <Success message={success}/>}
        </div>
    );
}
