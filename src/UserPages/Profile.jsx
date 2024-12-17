import NavBar from '../Component/NavBar';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Success from '../Component/Success'
import Error from '../Component/Error'
import { useContext } from 'react';
import { AuthContext } from '../ContextStore/AuthContext';
import { NotificationContext } from '../ContextStore/NotificationContext';



export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();

    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { error, setError, success, setSuccess, clearNotification } = useContext(NotificationContext);
    const currentUser = authState.user;

    const [profilePic, setProfilePic] = useState(`http://localhost:3000/${currentUser.profilepic}`);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        clearNotification();
    }, [location, clearNotification]);

    function handleFileChange(e) {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleUpload() {
        if (!selectedFile) return alert("Please select a file first!");
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);

        try {
            const response = await fetch("http://localhost:3000/change-profile-pic", {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                },
                method: "PATCH",
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                console.log(data);
                setProfilePic(`http://localhost:3000/${data.user.profilePicture}`);
                authDispatch({
                    type: "UPDATE_PROFILE_PICTURE",
                    payload: data.user.profilePicture,
                });
            } else {
                const errorData = await response.json();
                setError(errorData.errMsg);
                console.error('Error uploading file:', errorData.errMsg);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <NavBar />
            <div className="profile">
                <div>
                    <img className="profile-pic" src={profilePic} alt="Profile" />
                    <p>{authState.user.username}</p>
                    <div className="buttons">
                        <button onClick={() => navigate(-1)}><i className="fas fa-arrow-left"></i> &nbsp; Back</button>
                        <label htmlFor="profilePicture" className="label-as-button">Choose Photo</label>
                        <input id="profilePicture" name="profilePicture" type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload &nbsp; <i className="fas fa-arrow-up"></i></button>
                        <button>Delete</button>
                    </div>
                    {error && <Error message={error} />}
                    {success && <Success message={success} />}
                </div>
            </div>
        </>
    );
}
