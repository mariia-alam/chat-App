import './App.css'
import './UserPages/userPages.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from "./Pages/SignUp";
import GetStarted from './Pages/GetStarted';
import Landing from './Pages/Landing';
import Rooms from './UserPages/Rooms';
import Profile from './UserPages/Profile';
import Room from './UserPages/Room';
import  RoomsProvider  from './ContextStore/RoomsContext';
import { AuthProvider } from './ContextStore/AuthContext';
import SessionManager from './Component/SessionManager';
import PublicRoute from './Component/PublicRoute';
import { NotificationProvider } from './ContextStore/NotificationContext';
import PrivateRoute from './Component/PrivateRoute';


function App() {
  return (
    <NotificationProvider>
      <RoomsProvider>
        <AuthProvider>
          <Router>
          {location.pathname !== "/" && <SessionManager />}
            <Routes>
              <Route path="/" element={<Landing></Landing>}></Route>

              <Route path="/get-started" element={<PublicRoute> <GetStarted/> </PublicRoute>}></Route>
              <Route path="/login" element={<PublicRoute> <Login></Login> </PublicRoute>}></Route>
              <Route path="/signup" element={<PublicRoute><SignUp></SignUp> </PublicRoute>}></Route>

              <Route path="/rooms" element={<PrivateRoute><Rooms></Rooms></PrivateRoute>}></Route>
              <Route path="/profile" element={<PrivateRoute><Profile></Profile></PrivateRoute>}></Route>
              <Route path="/room/:roomId" element={<PrivateRoute><Room></Room></PrivateRoute>}></Route>
            </Routes>
          </Router>
        </AuthProvider>
      </RoomsProvider>
    </NotificationProvider>

  )
}

export default App
