// import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext , useEffect } from 'react';
import NavBar from '../Component/NavBar';
import { AuthContext } from '../ContextStore/AuthContext';
import { NotificationContext } from '../ContextStore/NotificationContext';
export default function Landing() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const {clearNotification } = useContext(NotificationContext);


    useEffect(() => {
clearNotification()
    }, [location, clearNotification]);



    function handleGetStartedClick() {
        if (!authState.token) {
            navigate('/get-started');
        } else {
            navigate('/rooms');
        }
    }

    return (<>
        <div className="landing">
                <NavBar></NavBar>
            <main>
                <p>Connect, Chat, and<br/>Discover:<br/>Your New Friends<br/>Await</p>
                <button onClick={handleGetStartedClick} className='get-started'>Get Started</button>
            </main>
        </div>
        </>
    );
}
