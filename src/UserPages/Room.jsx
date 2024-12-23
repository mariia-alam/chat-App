/* eslint-disable no-unused-vars */
import  { useState, useEffect,useRef, useContext } from "react";
import send from "../assets/send.png";
import addEmoji from "../assets/add-emoji.png";
import backArrow from "../assets/back-arrow.png";
import roomSetting from "../assets/room-setting.png";
import { useNavigate, useLocation } from "react-router-dom";
import { RoomsContext } from "../ContextStore/RoomsContext";
import Error from "../Component/Error";
import Success from '../Component/Success';
import NavBar from "../Component/NavBar";
import io from "socket.io-client";
const socket = io("http://localhost:3000");
import { AuthContext } from "../ContextStore/AuthContext";
import { NotificationContext } from "../ContextStore/NotificationContext";

import { useParams } from "react-router-dom";

export default function Room() {
    //context
    const { state: authState, dispatch: authDispatch  } = useContext(AuthContext);
    const { state: roomsState , setRooms, setOneRoom , deleteRoom } = useContext(RoomsContext);
    const {error , setError , success , setSuccess , clearNotification} = useContext(NotificationContext);
    //host
    const host = roomsState.oneRoom?.participants?.find(item => item.role === "host")?.user || null;
    //guset
    const guset=roomsState.oneRoom?.participants?.find(item => item.role ==="guest")?.user ||  null;
    //current room
    const currentRoomId=roomsState.oneRoom?.room?.id;
    //Reference
    const messagesEndRef = useRef(null);
    const textAreaRef = useRef(null);

    // Navigation and URL handling
    const navigate = useNavigate();
    const location = useLocation();
    const { roomId } = useParams();

    // Local state
    const [newMessage, setNewMessage] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [messages, setMessages] = useState([]);

    //fetch room details
async function handleGetRoom() {
        try {
            const response = await fetch(`http://localhost:3000/room/${authState.user.rooms[0].id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authState.token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error get room:", errorData.errMsg);
                return;
            }else{
            const data = await response.json();
            setOneRoom(data.room, data.userRole, data.participants);
            }
        } catch (error) {
            console.error("Error:", error.errMsg);
        }
    }

useEffect(() => {
    handleGetRoom();
}, [authState.user.rooms]);

    // Clear notifications on location change
    useEffect(() => {
        clearNotification();
    }, [location, clearNotification]);

    // Scroll to bottom when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    // Focus on the textarea initially
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, []);

    // Send message handler
    async function sendMessage (){
        if (newMessage.trim() === "") return;
        try{
            const response = await fetch(`http://localhost:3000/message/${roomsState.oneRoom.room.id}` ,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authState.token}`,
                },
                body:JSON.stringify({ message: newMessage }),
            });
            if(response.ok){
                const data = await response.json();
                console.log("Message sent via rest", data);//data msg(sent)
                //data { id message roomId sender{id profile username} senderId}

                socket.emit("message", {
                    roomid: roomsState.oneRoom.room.id,
                    userid: roomsState.oneRoom.userRole.userId,
                    message: newMessage,
    username: data.data.sender.username,
                });
                console.log(data.data.sender.username)
                    setNewMessage("");
            }else{
                const errorData = await response.json();
                console.error("Error sending message via REST:", errorData);
                setError(errorData.errMsg)
            }
        }catch (err) {
        console.error("Error:", err.errMsg);
        setError(err.errMsg);
        }
    };

    // Handle receiving messages via socket
    useEffect(() => {
    socket.on("message", (data) => {
            console.log("Message received: ", data);
        if (data.message.roomId === currentRoomId) {
            const isSelf = data.message.senderId === authState.user.id;
            const sender = roomsState.oneRoom.participants.find((user) => user.user.id === data.message.senderId);
            setMessages((prevMessages) => [
                ...prevMessages,
                { username: data.message.sender.username , id: data.message.id, text: data.message.message, self: isSelf,
                    avatar: sender?.user?.profilePicture && `http://localhost:3000/${sender.user.profilePicture}`
                },
            ]);
        }
        });
    return () => {
        socket.off("message");
    };
}, [roomsState , authState , currentRoomId]);


    // Fetch messages on component mount
useEffect(() => {
    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/messages/${roomsState.oneRoom.room.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const formattedMessages = data.messages.map((msg) => ({
                    username:msg.sender.username,
                    id: msg.id,
                    text: msg.message,
                    senderId: msg.senderId,
                    self: msg.senderId === authState.user.id,
                    profile:msg.sender.profilePicture,
                })).sort((a, b) => a.id - b.id);
                setMessages(formattedMessages);
            }
            else {
                const errorData = await response.json();
                console.error("Error fetching messages:", errorData.errMsg);
                setError(errorData.errMsg)
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Fetching messages failed")
        }
    };
    fetchMessages();
}, [roomsState , setError,  authState]);




    // Handle dropdown visibility
    const handleOpenSetting = () => setDropdownVisible(true);
    const handleCloseSetting = () => setDropdownVisible(false);

    // Delete or leave room handlers
    function handleDelete(){
    setDropdownVisible(false);
    try {
        roomsState.rooms.map(async (room) => {
            const response = await fetch(`http://localhost:3000/delete-room/${room.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${authState.token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                deleteRoom(roomId);
                setSuccess(responseData.message)
                authDispatch({ type: "UPDATE_MY_ROOM" , payload:null });
                setTimeout(() => {
                    navigate('/rooms');
                }, 1500);
                console.log("delete room", responseData.message);
            } else {
                const errorData = await response.json();
                setError(errorData.message)
                console.error("Error:", errorData.message);
            }
        });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Internal server error");
    }
    };

async function handleLeave() {
    setDropdownVisible(false);
    try {
        roomsState.rooms.map(async (room) => {
            const response = await fetch(`http://localhost:3000/leave-room/${room.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authState.token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                setSuccess(responseData.message)
                authDispatch({ type: "UPDATE_MY_ROOM", payload: null });

                setTimeout(() => {
                    navigate('/rooms');
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message)
                console.error("Error:", errorData.message);
            }
        });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Internal server error");
    }
}

if (!roomsState.oneRoom || !roomsState.oneRoom.participants) {
    return <div>Loading...</div>; // أو أي رسالة أو مكون انتظار
}

    return (
        <div  className="chatting">
            <NavBar></NavBar>
            <header>
                <div className="left-header">
                    <img src={backArrow} onClick={()=>navigate(-1)} alt="Back" />
                    <span id="chat-name">{host?.username}</span>
                    <p id="guest-name">{guset?.username || ""}</p>

                </div>
                <div onMouseLeave={handleCloseSetting} onMouseEnter={handleOpenSetting}>
                    <img  src={roomSetting} alt="Settings" />
                        {dropdownVisible && (
                        <div className="dropdown">
                                        {roomsState.oneRoom.userRole ==="host" ? (
                                        <a style={{ color: "red" }} onClick={handleDelete}>
                                            Delete
                                        </a>
                                        ) : (
                                        <a onClick={handleLeave}>Leave</a>
                                        )}
                        </div>
                    )}
                </div>
            </header>
            <main>
                {messages.map((message) => {
                    return (
                        <div key={message.id}
                            className={`message-wrapper ${message.self ? "self" : ""}`}>
                            {message.self && (<>
                                    <img src={message.avatar || `http://localhost:3000/${message.profile}` } alt="User Avatar" className="avatar" />
                                    <div className="message-content">
                                        <span className="username">{message.username}</span>
                                        <div className="message self">{message.text}</div>
                                    </div>
                                    </>
                            )}
                            {!message.self && (<>
                                    <img src={message.avatar ||  `http://localhost:3000/${message.profile}`|| "http://localhost:3000/uploads/user.jpg" } alt="User Avatar" className="avatar" />
                                    <div className="message-content">
                                        <span className="username">{message.username}</span>
                                        <div className="message self">{message.text}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
            })}
            <div ref={messagesEndRef}></div>
            </main>
            <footer>
                <img src={addEmoji} alt="Emoji" />
                <textarea
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (e.shiftKey) {
                                return;
                            }
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    ref={textAreaRef}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                ></textarea>
                <img src={send} alt="Send" onClick={sendMessage} style={{ cursor: "pointer" }} />
            </footer>
            {error && <Error message={error}/>}
            {success && <Success message={success}/>}
        </div>
    );
}
