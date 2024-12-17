import { createContext , useReducer } from 'react';
// Reducer for room-related state
const initialRoomsState = {
    rooms: [],
    oneRoom:{
        room: {},
        userRole: null,
        participants:[{}]
    }
};

const roomsReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_ROOMS":
        return { ...state, rooms: action.payload };
        case "DELETE_ROOM":
        return { ...state, rooms: state.rooms.filter((room) => room.id !== action.payload) };
        case "CREATE_ROOM":
        return { ...state, rooms: [...state.rooms, action.payload.room] };
        case "GET_ONE_ROOM":
        return {
        ...state,
            oneRoom: {
                room: action.payload.room,
                userRole: action.payload.userRole,
                participants: action.payload.participants,
                ...action.payload.room,
            },
        };
        default:
        return state;
    }
};
const RoomsContext = createContext();

export  default function RoomsProvider({ children }) {
    const [state, dispatch] = useReducer(roomsReducer, initialRoomsState);

    function setRooms  (rooms) {
        dispatch({ type: "FETCH_ROOMS", payload: rooms });
    };

    function setOneRoom(room, userRole, participants) {
    dispatch({
        type: "GET_ONE_ROOM",
        payload: { room, userRole, participants },
    });
    }

        function deleteRoom(roomId) {
        dispatch({ type: "DELETE_ROOM", payload: roomId });
    }
    return (
        <RoomsContext.Provider value={{ state, setRooms, setOneRoom, deleteRoom}}>
        {children}
        </RoomsContext.Provider>
    );
}

export { RoomsContext };